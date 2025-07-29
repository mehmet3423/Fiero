export interface UnsoldProductsReportParams {
  productNameKeyword?: string;
  categoryKeyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface UnsoldProductItem {
  id: string;
  productTitle: string;
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  productPrice: number;
  productBarcodeNumber: string;
}

export interface UnsoldProductsReportResponse {
  data: {
    items: UnsoldProductItem[];
    count: number;
    from: number;
    size: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  isSucceed: boolean;
  message: string;
}
