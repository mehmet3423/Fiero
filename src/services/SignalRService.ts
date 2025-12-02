import * as signalR from "@microsoft/signalr";

// Payment hub URL using environment variable
const PAYMENT_HUB_URL = `${process.env.NEXT_PUBLIC_PAYMENT_MICROSERVICE_URL}paymenthub`;

interface PaymentResult {
  status: string;
  message?: string;
  paymentId?: string;
  transactionId?: string;
  conversationId?: string;
  conversationData?: string;
  mdStatus?: string;
}

class SignalRService {
  private static instance: SignalRService;
  private connection: signalR.HubConnection | null = null;
  private paymentResultCallback: ((result: PaymentResult) => void) | null =
    null;
  private registeredTransactions: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  public async startConnection(): Promise<boolean> {
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      return true;
    }

    try {
      // Basic Auth credentials from environment variables
      const username = process.env.NEXT_PUBLIC_PAYMENT_USERNAME;
      const password = process.env.NEXT_PUBLIC_PAYMENT_PASSWORD;
      const credentials = btoa(`${username}:${password}`);

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(PAYMENT_HUB_URL, {
          skipNegotiation: false,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Error)
        .build();

      this.setupEventHandlers();
      await this.connection.start();

      return true;
    } catch (error) {
      this.connection = null;
      return false;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    // NotifyFrontend event handler (Backend callback çağrısından)
    this.connection.on("NotifyFrontend", (notification: any) => {
      this.handlePaymentNotification(notification);
    });

    // PaymentResult event handler (Ödeme tamamlandıktan sonra)
    this.connection.on("PaymentResult", (notification: any) => {
      this.handlePaymentNotification(notification);
    });

    this.connection.onclose((error) => {
      this.registeredTransactions.clear();
    });

    this.connection.onreconnecting((error) => {
      // Silent reconnect
    });

    this.connection.onreconnected((connectionId) => {
      this.reregisterTransactions();
    });
  }

  private handlePaymentNotification(notification: any): void {
    let result: PaymentResult;

    if (typeof notification === "string") {
      result = { status: notification };
    } else if (notification && typeof notification === "object") {
      result = {
        status: notification.status ?? "unknown",
        message: notification.message,
        paymentId: notification.paymentId,
        transactionId: notification.transactionId,
        conversationId: notification.conversationId,
        conversationData: notification.conversationData,
        mdStatus: notification.mdStatus,
      };
    } else {
      result = { status: "unknown" };
    }

    // Trigger callback if registered
    if (this.paymentResultCallback) {
      this.paymentResultCallback(result);
    }
  }

  private async waitUntilConnected(
    timeoutMs: number = 10000
  ): Promise<boolean> {
    if (!this.connection) {
      return false;
    }

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return true;
    }

    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (Date.now() - startTime > timeoutMs) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);
    });
  }

  async registerTransactionId(orderNumber: string): Promise<boolean> {
    if (!this.connection) return false;

    try {
      const isConnected = await this.waitUntilConnected();

      if (!isConnected) {
        return false;
      }

      const trimmedOrderNumber = orderNumber?.toString().trim();
      await this.connection.invoke("RegisterTransaction", trimmedOrderNumber);
      this.registeredTransactions.add(trimmedOrderNumber);
      return true;
    } catch (err) {
      return false;
    }
  }

  public onPaymentResult(callback: (result: PaymentResult) => void): void {
    this.paymentResultCallback = callback;
  }

  public onNotifyFrontend(callback: (result: PaymentResult) => void): void {
    this.paymentResultCallback = callback; // Aynı callback'i kullan
  }

  public removePaymentResultCallback(): void {
    this.paymentResultCallback = null;
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  public getDebugInfo(): any {
    return {
      connectionState: this.connection?.state,
      connectionId: this.connection?.connectionId,
      registeredTransactions: Array.from(this.registeredTransactions),
      hasCallback: !!this.paymentResultCallback,
    };
  }

  private async reregisterTransactions(): Promise<void> {
    this.registeredTransactions.forEach(async (orderNumber) => {
      try {
        await this.connection?.invoke("RegisterTransaction", orderNumber);
      } catch (error) {
        // Silent fail
      }
    });
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.registeredTransactions.clear();
      this.paymentResultCallback = null;
    }
  }
}

export const signalRService = SignalRService.getInstance();
export default signalRService;
