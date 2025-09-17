// Fiyat sıralaması için enum
export enum DiscountSort {
  None = 0, // Hiç Sıralama Yapma
  PriceAsc = 1, // Fiyata Göre Artan
  PriceDesc = 2, // Fiyata Göre Azalan
}

// Puan sıralaması için enum
export enum RatingSort {
  None = 0, // Hiç Sıralama Yapma
  BestFirst = 1, // En İyiye Göre
  WorstFirst = 2, // En Kötüye Göre
}

// Satış sayısı sıralaması için enum
export enum SalesCountSort {
  None = 0, // Hiç Sıralama Yapma
  LowToHigh = 1,
  HighToLow = 2,
}

// Beğeni sayısı sıralaması için enum
export enum LikeCountSort {
  None = 0,
  LowToHigh = 1,
  HighToLow = 2,
}

// Sıralama seçenekleri
export const SORT_OPTIONS = {
  POPULARITY: "popularity",
  RATING: "rating",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
  SALES_HIGH: "sales-high",
  SALES_LOW: "sales-low",
  LIKES_HIGH: "likes-high",
  LIKES_LOW: "likes-low",
} as const;

// Sıralama seçeneklerinin görüntü adları
export const SORT_OPTION_LABELS = {
  [SORT_OPTIONS.POPULARITY]: "En Popüler",
  [SORT_OPTIONS.RATING]: "En İyi Puan",
  [SORT_OPTIONS.PRICE_LOW]: "Fiyat Düşükten Yüksek",
  [SORT_OPTIONS.PRICE_HIGH]: "Fiyat Yüksekten Düşük",
  [SORT_OPTIONS.SALES_HIGH]: "En Çok Satan",
  [SORT_OPTIONS.SALES_LOW]: "En Az Satan",
  [SORT_OPTIONS.LIKES_HIGH]: "En Çok Beğenilen",
  [SORT_OPTIONS.LIKES_LOW]: "En Az Beğenilen",
} as const;
