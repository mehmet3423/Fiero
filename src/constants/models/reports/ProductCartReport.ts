export interface ProductCartReportParams {
  customerNameKeyword?: string;
  categoryKeyword?: string;
  productNameKeyword?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductCartItem {
  productId: string;
  productTitle: string;
  productDescription: string;
  productBarcodeNumber: string;
  totalQuantity: number;
  subCategory: {
    id: string;
    name: string;
    createdOnValue: string;
    modifiedOnValue: string | null;
  };
  mainCategory: {
    id: string;
    name: string;
    createdOnValue: string;
    modifiedOnValue: string | null;
  };
  customerCartReport: Array<{
    customerId: string;
    customerFullName: string;
    createdOnValue: string;
    quantity: number;
  }>;
}

export interface ProductCartReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: ProductCartItem[];
  pages: number;
  size: number;
}

export interface ProductCartReportResponse {
  data: ProductCartReportData;
  isSucceed: boolean;
  message: string;
}

// Helper function to get quantity level info
export const getQuantityLevelInfo = (quantity: number) => {
  if (quantity >= 50)
    return { level: "Çok Yüksek", color: "bg-danger", icon: "🔥", priority: 4 };
  if (quantity >= 20)
    return { level: "Yüksek", color: "bg-warning", icon: "📈", priority: 3 };
  if (quantity >= 10)
    return { level: "Orta", color: "bg-info", icon: "📊", priority: 2 };
  if (quantity >= 5)
    return { level: "Düşük", color: "bg-primary", icon: "📉", priority: 1 };
  return { level: "Çok Düşük", color: "bg-secondary", icon: "📋", priority: 0 };
};

// Helper function to get cart age based on creation date
export const getCartAge = (createdDate: string) => {
  const now = new Date();
  const created = new Date(createdDate);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 30)
    return {
      age: "30+ gün",
      color: "bg-danger",
      icon: "⏰",
      level: "Çok Eski",
    };
  if (diffDays >= 14)
    return {
      age: `${diffDays} gün`,
      color: "bg-warning",
      icon: "📅",
      level: "Eski",
    };
  if (diffDays >= 7)
    return {
      age: `${diffDays} gün`,
      color: "bg-info",
      icon: "🗓️",
      level: "Normal",
    };
  if (diffDays >= 1)
    return {
      age: `${diffDays} gün`,
      color: "bg-primary",
      icon: "🆕",
      level: "Yeni",
    };
  return { age: "Bugün", color: "bg-success", icon: "✨", level: "Çok Yeni" };
};

// Helper function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount);
};
