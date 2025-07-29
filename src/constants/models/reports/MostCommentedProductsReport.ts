export interface MostCommentedProductsReportParams {
  ascending?: boolean;
  categoryKeyword?: string;
  productNameKeyword?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface MostCommentedProductItem {
  id: string;
  title: string; // API'de title olarak geliyor
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  commentCount: number; // Yorum sayısı
  averageRating?: number; // Ortalama puan (varsa)
  price: number;
  sellableQuantity: number;
  isAvailable: boolean;
  createdateutc: string;
  modifiedonvalue: string;
  // Add more fields based on your API response
}

export interface MostCommentedProductsReportData {
  items: MostCommentedProductItem[];
  count: number;
  from: number;
  size: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MostCommentedProductsReportResponse {
  data: MostCommentedProductsReportData;
  isSucceed: boolean; // API'de isSucceed olarak geliyor (useStockReport ile tutarlı)
  message: string;
}
