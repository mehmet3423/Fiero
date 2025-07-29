export interface MostLikedProductsReportParams {
  ascending?: boolean;
  categoryKeyword?: string;
  productNameKeyword?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface MostLikedProductItem {
  id: string;
  title: string;
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  likeCount: number;
  price: number;
  barcodeNumber: string;
  sellableQuantity: number;
  isAvailable: boolean;
  createdOnValue: string;
  modifiedOnValue: string;
}

export interface MostLikedProductsReportData {
  items: MostLikedProductItem[];
  count: number;
  from: number;
  size: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MostLikedProductsReportResponse {
  data: MostLikedProductsReportData;
  isSucceed: boolean;
  message: string;
}
