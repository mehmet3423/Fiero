export enum SupportTicketStatus {
  Pending = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
  Cancelled = 4,
}

export const SupportTicketStatusLabels = {
  [SupportTicketStatus.Pending]: "Beklemede",
  [SupportTicketStatus.InProgress]: "İşlemde",
  [SupportTicketStatus.Resolved]: "Çözüldü",
  [SupportTicketStatus.Closed]: "Kapalı",
  [SupportTicketStatus.Cancelled]: "İptal Edildi",
};

export const SupportTicketStatusColors = {
  [SupportTicketStatus.Pending]: "warning",
  [SupportTicketStatus.InProgress]: "info",
  [SupportTicketStatus.Resolved]: "success",
  [SupportTicketStatus.Closed]: "secondary",
  [SupportTicketStatus.Cancelled]: "danger",
};
