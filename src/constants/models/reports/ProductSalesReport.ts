export interface ProductSalesReportParams {
  page?: number;
  pageSize?: number;
  from?: number;
  startDate?: string; // date-time
  endDate?: string; // date-time
  categoryKeyword?: string;
  customerNameKeyword?: string;
  isRegisteredCustomer?: boolean;
  ascending?: boolean;
}

export interface ProductSalesItem {
  id: string;
  productTitle: string;
  productDescription?: string;
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  customerName: string;
  customerEmail?: string;
  isRegisteredCustomer: boolean;
  saleDate: string;
  salePrice: number;
  quantity: number;
  totalAmount: number;
  orderNumber?: string;
  createdOnValue: string;
  modifiedOnValue: string;
}

export interface ProductSalesReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: ProductSalesItem[];
  pages: number;
  size: number;
}

export interface ProductSalesReportResponse {
  data: ProductSalesReportData;
  isSucceed: boolean;
  message: string;
}
