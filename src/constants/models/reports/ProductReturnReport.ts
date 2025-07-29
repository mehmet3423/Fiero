// Cancel Reason Type Enum (API'den gelen değerler)
export enum CancelReasonType {
  ALL = -1, // Tümü için custom değer
  DEFECTIVE_PRODUCT = 0, // Kusurlu ürün
  WRONG_PRODUCT = 1, // Yanlış ürün
  CUSTOMER_CHANGED_MIND = 2, // Müşteri fikir değiştirdi
  LATE_DELIVERY = 3, // Geç teslimat
}

export interface ProductReturnReportParams {
  cancelReasonType?: CancelReasonType;
  categoryKeyword?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductReturnItem {
  id: string;
  title: string; // API'de title olarak geliyor
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  customerName: string; // İade yapan müşteri
  returnReason: string; // İade nedeni açıklaması
  cancelReasonType: CancelReasonType; // İade nedeni türü
  returnDate: string; // İade tarihi
  returnQuantity: number; // İade edilen miktar
  refundAmount: number; // İade edilen tutar
  orderDate: string; // Sipariş tarihi
  price: number;
  sellableQuantity: number;
  isAvailable: boolean;
  createdateutc: string;
  modifiedonvalue: string;
  // Add more fields based on your API response
}

export interface ProductReturnReportResponse {
  data: ProductReturnItem[];
  totalCount: number;
  success: boolean;
  message: string;
}

// Helper function to get cancel reason type display name
export const getCancelReasonTypeDisplayName = (
  type: CancelReasonType
): string => {
  switch (type) {
    case CancelReasonType.DEFECTIVE_PRODUCT:
      return "Kusurlu Ürün";
    case CancelReasonType.WRONG_PRODUCT:
      return "Yanlış Ürün";
    case CancelReasonType.CUSTOMER_CHANGED_MIND:
      return "Müşteri Fikir Değiştirdi";
    case CancelReasonType.LATE_DELIVERY:
      return "Geç Teslimat";
    case CancelReasonType.ALL:
      return "Tümü";
    default:
      return "Bilinmeyen";
  }
};

// Helper function to get cancel reason type color
export const getCancelReasonTypeColor = (type: CancelReasonType): string => {
  switch (type) {
    case CancelReasonType.DEFECTIVE_PRODUCT:
      return "bg-danger";
    case CancelReasonType.WRONG_PRODUCT:
      return "bg-warning";
    case CancelReasonType.CUSTOMER_CHANGED_MIND:
      return "bg-info";
    case CancelReasonType.LATE_DELIVERY:
      return "bg-secondary";
    default:
      return "bg-primary";
  }
};

// Helper function to get cancel reason type icon
export const getCancelReasonTypeIcon = (type: CancelReasonType): string => {
  switch (type) {
    case CancelReasonType.DEFECTIVE_PRODUCT:
      return "⚠️";
    case CancelReasonType.WRONG_PRODUCT:
      return "❌";
    case CancelReasonType.CUSTOMER_CHANGED_MIND:
      return "🤔";
    case CancelReasonType.LATE_DELIVERY:
      return "⏰";
    default:
      return "🔄";
  }
};
