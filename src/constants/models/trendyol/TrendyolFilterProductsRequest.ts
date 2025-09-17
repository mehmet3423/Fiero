import { TrendyolDeliveryOption } from "./TrendyolDeliveryOption";
import { TrendyolProductAttributeResponse } from "./TrendyolProductAttributeResponse";
import { TrendyolProductImage } from "./TrendyolProductImage";

export interface TrendyolFilterProductsRequest {
  approved?: boolean;
  barcode?: string;
  startDate?: number;
  endDate?: number;
  page?: number;
  dateQueryType?: string;
  size?: number;
  stockCode?: string;
  archived?: boolean;
  productMainId?: string;
  onSale?: boolean;
  rejected?: boolean;
  blacklisted?: boolean;
  brandIds?: number[];
}


/**
 * Trendyol ürün filtreleme cevabı.
 */
export interface TrendyolFilterProductsResponse {
  /** Toplam ürün sayısı */
  totalElements: number;

  /** Toplam sayfa sayısı */
  totalPages: number;

  /** Şu anki sayfa numarası */
  page: number;

  /** Sayfa başına ürün sayısı */
  size: number;

  /** Sayfadaki ürün listesi */
  content?: TrendyolProductItem[];
}

/**
 * Trendyol ürün detay bilgileri.
 */
export interface TrendyolProductItem {
  id: string;
  approved: boolean;
  archived: boolean;
  productCode: number;
  batchRequestId: string;
  supplierId: number;
  createDateTime: number;
  lastUpdateDate: number;
  gender: string;
  brand: string;
  barcode: string;
  title: string;
  categoryName: string;
  productMainId: string;
  description: string;
  stockUnitType: string;
  quantity: number;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  dimensionalWeight: number;
  stockCode: string;
  deliveryOption: TrendyolDeliveryOption;
  images: TrendyolProductImage[];
  attributes: TrendyolProductAttributeResponse[];
  platformListingId: string;
  stockId: string;
  hasActiveCampaign: boolean;
  locked: boolean;
  productContentId: number;
  pimCategoryId: number;
  brandId: number;
  version: number;
  color: string;
  size: string;
  lockedByUnSuppliedReason: boolean;
  onsale: boolean;
  productUrl: string;
}