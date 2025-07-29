export interface MediaMissingProductsReportParams {
  withoutContentImage?: boolean;
  withoutBanner?: boolean;
  withoutVideo?: boolean;
  categoryKeyword?: string;
  productNameKeyword?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface MediaMissingProductItem {
  id: string;
  title: string;
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  contentImageUrls: string[];
  banner: string[] | null; // API'de banner array olarak geliyor
  videoUrl: string | null; // API'de videoUrl olarak geliyor (videoUrls değil)
  createdOnValue: string;
  modifiedOnValue: string;
  price: number;
  sellableQuantity: number;
  isAvailable: boolean;
}

export interface MediaMissingProductsReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: MediaMissingProductItem[];
  pages: number;
  size: number;
}

export interface MediaMissingProductsReportResponse {
  data: MediaMissingProductsReportData;
  isSucceed: boolean;
  message: string;
}
