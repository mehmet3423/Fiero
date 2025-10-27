export interface ProcessAlternativeDeliveryRequest {
  isPhoneNumber: boolean;
  trackingInfo: string;
  params?: Record<string, string>;
  boxQuantity?: number;
  deci?: number;
}