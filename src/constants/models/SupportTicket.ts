import { CommandResult } from "./CommandResult";

export interface SupportTicket {
  id: number;
  $id: string;
  title: string;
  requestType: number;
  supportTicketStatus: number;
  createdOnValue: string;
  customerId: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  createdDate?: string;
  customerOrderId?: string;
  isDeleted?: boolean;
}

// API response yapısı: root seviyede isSucceed, message ve data objesi
export interface SupportTicketResponse {
  data: {
    items: SupportTicket[];
    count: number;
    from: number;
    index: number;
    size: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  isSucceed: boolean;
  message: string;
}
