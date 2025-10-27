import { OrderSupportRequestType } from "@/constants/enums/support-ticket/OrderSupportTicket/OrderSupportRequestType";

export const getOrderSupportRequestTypeTitle = (
  type: OrderSupportRequestType
): string => {
  switch (type) {
    case OrderSupportRequestType.OrderNotReceived:
      return "Sipariş Teslim Alınmadı";
    case OrderSupportRequestType.DamagedProduct:
      return "Hasarlı Ürün";
    case OrderSupportRequestType.WrongItemDelivered:
      return "Yanlış Ürün Gönderimi";
    case OrderSupportRequestType.RefundRequest:
      return "İade Talebi";
    case OrderSupportRequestType.ExchangeRequest:
      return "Değişim Talebi";
    case OrderSupportRequestType.PaymentIssue:
      return "Ödeme Sorunu";
    case OrderSupportRequestType.OrderCancellation:
      return "Sipariş İptali";
    case OrderSupportRequestType.DeliveryDelayInquiry:
      return "Teslimat Gecikmesi";
    case OrderSupportRequestType.Other:
      return "Diğer";
    default:
      return "Bilinmeyen Talep Tipi";
  }
};

export const getAllOrderSupportRequestTypes = (): {
  value: OrderSupportRequestType;
  title: string;
}[] => {
  return [
    {
      value: OrderSupportRequestType.OrderNotReceived,
      title: "Sipariş Teslim Alınmadı",
    },
    { value: OrderSupportRequestType.DamagedProduct, title: "Hasarlı Ürün" },
    {
      value: OrderSupportRequestType.WrongItemDelivered,
      title: "Yanlış Ürün Gönderimi",
    },
    { value: OrderSupportRequestType.RefundRequest, title: "İade Talebi" },
    { value: OrderSupportRequestType.ExchangeRequest, title: "Değişim Talebi" },
    { value: OrderSupportRequestType.PaymentIssue, title: "Ödeme Sorunu" },
    {
      value: OrderSupportRequestType.OrderCancellation,
      title: "Sipariş İptali",
    },
    {
      value: OrderSupportRequestType.DeliveryDelayInquiry,
      title: "Teslimat Gecikmesi",
    },
    { value: OrderSupportRequestType.Other, title: "Diğer" },
  ];
};
