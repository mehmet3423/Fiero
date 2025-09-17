import { DiscountSort, LikeCountSort, RatingSort, SalesCountSort } from "@/constants/enums/SortOptions";
import { TrendyolProductStatus } from "@/constants/enums/TrendyolProductStatus";
import { PageRequest } from "@/constants/models/PageRequest";

/**
 * Trendyol ürün listesi alma isteği.
 */
export interface GetAllProductsWithTrendyolListRequest extends PageRequest {
  discountSort: DiscountSort;
  ratingSort: RatingSort;
  salesCountSort: SalesCountSort;
  likeCountSort: LikeCountSort;

  mainCategoryId?: string | null; // Guid
  subCategoryId?: string | null; // Guid
  search?: string | null;
  trendyolStatuses?: TrendyolProductStatus[] | null; // Birden fazla Trendyol durumu seçilebilir

  // Durum filtreleri - backend'de ayrı ayrı gönderiliyor
  approved?: boolean | null;
  onSale?: boolean | null;
  archived?: boolean | null;
  rejected?: boolean | null;
  blacklisted?: boolean | null;

  barcode?: string | null;
  startDate?: number | null; // long timestamp
  endDate?: number | null; // long timestamp
  dateQueryType?: string | null;
  stockCode?: string | null;
  productMainId?: string | null;
  brandIds?: number[] | null;
}