export interface PassiveProductsReportParams {
  categoryKeyword?: string;
  barcodeNumberKeyword?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface PassiveProductItem {
  id: string;
  title: string; // API'de title olarak geliyor
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  barcodeNumber: string;
  isAvailable: boolean;
  createdateutc: string; // API'de createdateutc olarak geliyor
  modifiedonvalue: string; // API'de modifiedonvalue olarak geliyor
  price: number;
  sellableQuantity: number; // API'de sellableQuantity olarak geliyor
  // Add more fields based on your API response
}

export interface PassiveProductsReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: PassiveProductItem[];
  pages: number;
  size: number;
}

export interface PassiveProductsReportResponse {
  data: PassiveProductsReportData;
  isSucceed: boolean;
  message: string;
}
