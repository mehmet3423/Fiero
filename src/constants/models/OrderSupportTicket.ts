import { PaginationModel } from "./Pagination";

export interface OrderSupportTicketResponse extends PaginationModel {
  items: OrderSupportTicket[];
}

export interface OrderSupportTicket {
  id: number;
  $id: string;
  title: string;
  orderItemId: string;
  description?: string;
  createdOn: string;
  requestType: number;
}
