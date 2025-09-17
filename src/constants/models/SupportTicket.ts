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

// API response'unda items ve count root seviyede geliyor
export interface SupportTicketResponse extends CommandResult {
  items: SupportTicket[];
  count: number;
  from: number;
  index: number;
  size: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  data?: {
    items: SupportTicket[];
  };
}
