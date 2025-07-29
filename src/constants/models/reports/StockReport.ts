export interface StockReportParams {
  categoryKeyword?: string;
  page?: number;
  pageSize?: number;
  from?: number;
}

export interface StockReportItem {
  id: string;
  title: string;
  barcodeNumber: string;
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  subcategory?: {
    id: string;
    title: string;
  };
  sellableQuantity: number;
  stockStatus?: string;
  modifiedOnValue: string;
  createdOnValue: string;
  price: number;
  isAvailable?: boolean;
  ratingCount?: number;
  refundable?: boolean;
}

export interface StockReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: StockReportItem[];
  pages: number;
  size: number;
}

export interface StockReportResponse {
  data: StockReportData;
  isSucceed: boolean;
  message: string;
}
