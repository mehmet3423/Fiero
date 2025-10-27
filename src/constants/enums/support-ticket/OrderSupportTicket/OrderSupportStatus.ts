export enum OrderSupportTicketStatus {
  Pending = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
  Cancelled = 4,
}

export const OrderSupportTicketStatusLabels = {
  [OrderSupportTicketStatus.Pending]: "Beklemede",
  [OrderSupportTicketStatus.InProgress]: "İşlemde",
  [OrderSupportTicketStatus.Resolved]: "Çözüldü",
  [OrderSupportTicketStatus.Closed]: "Kapalı",
  [OrderSupportTicketStatus.Cancelled]: "İptal Edildi",
};

export const OrderSupportTicketStatusColors = {
  [OrderSupportTicketStatus.Pending]: "warning",
  [OrderSupportTicketStatus.InProgress]: "info",
  [OrderSupportTicketStatus.Resolved]: "success",
  [OrderSupportTicketStatus.Closed]: "secondary",
  [OrderSupportTicketStatus.Cancelled]: "danger",
};
