import { PaginationModel } from "./Pagination";

export interface SupportTicketResponse extends PaginationModel {
  items: SupportTicket[];
}
export interface SupportTicket {
  id: number;
  $id: string;
  title: string;
  requestType: number;
  status: number;
  createdOnValue: string;
  customerId: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  createdDate?: string;
  customerOrderId?: string;
  ticketStatus?: number;
  isDeleted?: boolean;
}
