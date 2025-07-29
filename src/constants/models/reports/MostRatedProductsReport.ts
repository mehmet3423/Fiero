export interface MostRatedProductsReportParams {
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface MostRatedProductItem {
  productId: string;
  productTitle: string;
  commentCount: number;
  ratingCount: number;
  averageRating: number;
}

export interface MostRatedProductsReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: MostRatedProductItem[];
  pages: number;
  size: number;
}

export interface MostRatedProductsReportResponse {
  data: MostRatedProductsReportData;
  isSucceed: boolean;
  message: string;
}
