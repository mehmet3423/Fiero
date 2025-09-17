import { OrderSupportTicketStatus } from "../enums/support-ticket/OrderSupportTicket/OrderSupportStatus";
import { CommandResult } from "./CommandResult";

export interface OrderSupportTicket {
  id: number;
  $id: string;
  title: string;
  requestType: number;
  createdOnValue: string;
  customerId: string;
  description?: string;
  createdDate?: string;
  orderItemId?: string;
  supportTicketStatus?: OrderSupportTicketStatus;
  isDeleted?: boolean;
}

// API response'unda items ve count root seviyede geliyor
export interface OrderSupportTicketResponse extends CommandResult {
  items: OrderSupportTicket[];
  count: number;
  from: number;
  index: number;
  size: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  data?: {
    items: OrderSupportTicket[];
  };
}
