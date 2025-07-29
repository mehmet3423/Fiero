export interface ReturnReasonReportParams {
  page?: number;
  pageSize?: number;
}

export interface ReturnReasonItem {
  id: string;
  reasonType: number; // İade nedeni türü (0,1,2,3)
  reasonName: string; // İade nedeni adı
  reasonDescription: string; // İade nedeni açıklaması
  totalReturns: number; // Bu nedenle yapılan toplam iade sayısı
  totalRefundAmount: number; // Bu nedenle iade edilen toplam tutar
  percentage: number; // Toplam iadeler içindeki yüzdesi
  averageRefundAmount: number; // Ortalama iade tutarı
  createdateutc: string;
  modifiedonvalue: string;
  // Add more fields based on your API response
}

export interface ReturnReasonReportData {
  count: number;
  from: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: ReturnReasonItem[];
  pages: number;
  size: number;
}

export interface ReturnReasonReportResponse {
  data: ReturnReasonReportData;
  isSucceed: boolean;
  message: string;
}

// Helper function to get reason type display info
export const getReasonTypeInfo = (reasonType: number) => {
  switch (reasonType) {
    case 0:
      return {
        name: "Kusurlu Ürün",
        color: "bg-danger",
        icon: "⚠️",
        priority: "Kritik",
      };
    case 1:
      return {
        name: "Yanlış Ürün",
        color: "bg-warning",
        icon: "❌",
        priority: "Yüksek",
      };
    case 2:
      return {
        name: "Müşteri Fikir Değiştirdi",
        color: "bg-info",
        icon: "🤔",
        priority: "Düşük",
      };
    case 3:
      return {
        name: "Geç Teslimat",
        color: "bg-secondary",
        icon: "⏰",
        priority: "Orta",
      };
    default:
      return {
        name: "Bilinmeyen",
        color: "bg-primary",
        icon: "❓",
        priority: "Normal",
      };
  }
};

// Helper function to get percentage color
export const getPercentageColor = (percentage: number) => {
  if (percentage >= 40) return "text-danger"; // Yüksek oran - kırmızı
  if (percentage >= 25) return "text-warning"; // Orta oran - sarı
  if (percentage >= 10) return "text-info"; // Düşük oran - mavi
  return "text-success"; // Çok düşük oran - yeşil
};
