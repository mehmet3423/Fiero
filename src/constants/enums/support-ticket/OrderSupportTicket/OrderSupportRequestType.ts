export enum OrderSupportRequestType {
  OrderNotReceived = 0, // Customer didn't receive their order
  DamagedProduct = 1, // Product arrived damaged
  WrongItemDelivered = 2, // Incorrect item sent
  RefundRequest = 3, // Request for refund
  ExchangeRequest = 4, // Request to exchange an item
  PaymentIssue = 5, // Issues with payment processing
  OrderCancellation = 6, // Request to cancel an order
  DeliveryDelayInquiry = 7, // Questions about delivery delays
  Other = 8, // Miscellaneous issues
}

export const OrderSupportRequestTypeLabels = {
  [OrderSupportRequestType.OrderNotReceived]: "Sipariş Alınamadı",
  [OrderSupportRequestType.DamagedProduct]: "Hasarlı Ürün",
  [OrderSupportRequestType.WrongItemDelivered]: "Yanlış Ürün Gönderildi",
  [OrderSupportRequestType.RefundRequest]: "İade Talebi",
  [OrderSupportRequestType.ExchangeRequest]: "Değişim Talebi",
  [OrderSupportRequestType.PaymentIssue]: "Ödeme Sorunu",
  [OrderSupportRequestType.OrderCancellation]: "Sipariş İptali",
  [OrderSupportRequestType.DeliveryDelayInquiry]: "Teslimat Gecikmesi",
  [OrderSupportRequestType.Other]: "Diğer",
};
