import { PaginationModel } from "./Pagination";
import { CommandResult } from "./CommandResult";
export interface DtoReview {
  $id: string;
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  approved: boolean | null;
  title: string;
  content: string;
  rating: number;
  comment: string;
  modifiedValue: string;
  imageUrl?: string;
}

export interface UserReviewsResponse extends PaginationModel {
  data: {
    items: DtoReview[];
  };
}

export interface CommentItem {
  title: string;
  content: string;
  rating: number;
  imageUrl: string | null;
  customerId: string;
  customerName: string;
  productId: string;
  id: string;
  createdOnValue: string;
  modifiedOnValue: string | null;
  isDeleted: boolean;
  approved: boolean | null;
}

export interface CommentListResponse extends PaginationModel {
  items: CommentItem[];
}

export interface CommentListApiResponse {
  data: {
    items: CommentItem[];
    count: number;
    from: number;
    hasNext: boolean;
    hasPrevious: boolean;
    index: number;
  };
  items: CommentItem[];
  pages: number;
  size: number;
  isSucceed: boolean;
  message: string;
}

export interface CommentListRequest {
  productId?: string;
  customerId?: string;
  CommentStatusFilter?: number;
  TargetRatings?: number[];
  isDeleted?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}
