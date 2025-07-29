import { PaginationModel } from "./Pagination";

export interface DtoReview {
  $id: string;
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  title: string;
  content: string;
  rating: number;
  comment: string;
  modifiedValue: string;
  imageUrl?: string;
}

export interface UserReviewsResponse extends PaginationModel {
  items: DtoReview[];
}
