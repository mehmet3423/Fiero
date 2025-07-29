export interface FavoriteProductsReportParams {
  productNameKeyword?: string;
  categoryKeyword?: string;
  customerNameKeyword?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  pageSize?: number;
}

export interface FavoriteProductItem {
  id: string;
  productTitle: string; // API'de title olarak geliyor
  mainCategory?: {
    name?: string;
  };
  subCategory?: {
    name?: string;
  };
  customerFullName: string; // Müşteri adı
  customerId: string; // Müşteri id
  favoriteCount: number; // Kaç kişi favorilere eklemiş
  favoritedOn: string; // Favorilere eklenme tarihi
  productPrice: number;
  sellableQuantity: number;
  isAvailable: boolean;
  createdDateUtc: string;
  modifiedOnValue: string;
  // Add more fields based on your API response
}

export interface FavoriteProductsReportResponse {
  data: {
    items: FavoriteProductItem[];
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
