/**
 * Müşteri tarafında sipariş durumu etiketleri (Beklemede, İşleniyor, Kargoda, Teslim Edildi, İptal Edildi).
 * ordersId.status.* locale anahtarları kullanılır.
 * cargoStatus 0-12 backend değerleri, gerekirse 0-4 müşteri durumuna indirgenir.
 */
export const CUSTOMER_ORDER_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 4,
} as const;

/** Backend cargoStatus 0-12 bazen kullanılıyor; müşteri etiketine dönüştür (0-4). */
function toCustomerStatus(status: number | undefined | null): number {
  if (status === undefined || status === null) return CUSTOMER_ORDER_STATUS.PENDING;
  switch (status) {
    case 0:
      return CUSTOMER_ORDER_STATUS.PENDING;
    case 1:
    case 2:
      return CUSTOMER_ORDER_STATUS.PROCESSING;
    case 3:
    case 4:
    case 5:
    case 6:
      return CUSTOMER_ORDER_STATUS.SHIPPED;
    case 7:
      return CUSTOMER_ORDER_STATUS.DELIVERED;
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return CUSTOMER_ORDER_STATUS.CANCELLED;
    default:
      return status <= 4 ? status : CUSTOMER_ORDER_STATUS.PENDING;
  }
}

export type OrderStatusTranslator = (key: string) => string;

export function getOrderStatusText(
  status: number | undefined | null,
  t: OrderStatusTranslator
): string {
  const s = toCustomerStatus(status);
  switch (s) {
    case CUSTOMER_ORDER_STATUS.PENDING:
      return t("ordersId.status.pending");
    case CUSTOMER_ORDER_STATUS.PROCESSING:
      return t("ordersId.status.processing");
    case CUSTOMER_ORDER_STATUS.SHIPPED:
      return t("ordersId.status.shipped");
    case CUSTOMER_ORDER_STATUS.DELIVERED:
      return t("ordersId.status.delivered");
    case CUSTOMER_ORDER_STATUS.CANCELLED:
      return t("ordersId.status.cancelled");
    default:
      return t("ordersId.status.unknown");
  }
}

export function getOrderStatusClass(status: number | undefined | null): string {
  const s = toCustomerStatus(status);
  switch (s) {
    case CUSTOMER_ORDER_STATUS.PENDING:
      return "bg-warning";
    case CUSTOMER_ORDER_STATUS.PROCESSING:
      return "bg-info";
    case CUSTOMER_ORDER_STATUS.SHIPPED:
      return "bg-primary";
    case CUSTOMER_ORDER_STATUS.DELIVERED:
      return "bg-success";
    case CUSTOMER_ORDER_STATUS.CANCELLED:
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}
