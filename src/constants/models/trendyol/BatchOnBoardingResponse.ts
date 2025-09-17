// ----------------------------------------
// 1) ProductV2OnBoarding (Ürün Oluşturma)
// ----------------------------------------

import { TrendyolProductAttribute } from "./TrendyolProductAttribute";
import { TrendyolProductImage } from "./TrendyolProductImage";

/**
 * Batch onboarding yanıt modeli.
 */
export interface BatchOnBoardingResponse {
  batchRequestId: string;
  items: OnBoardingItem[];
  status: string;
  creationDate: number;
  lastModification: number;
  sourceType: string;
  itemCount: number;
  failedItemCount: number;
  batchRequestType: string;
}

/**
 * Onboarding item detayı.
 */
export interface OnBoardingItem {
  requestItem: OnBoardingRequestItem;
  status: string;
  failureReasons: string[];
}

/**
 * Onboarding request item.
 */
export interface OnBoardingRequestItem {
  product: OnBoardingProductDetail;
  barcode: string;
}

/**
 * Onboarding ürün detayları.
 */
export interface OnBoardingProductDetail {
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  categoryId: number;
  quantity: number;
  stockCode: string;
  dimensionalWeight: number;
  description: string;
  currencyType: string;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  images: TrendyolProductImage[];
  attributes: TrendyolProductAttribute[];
  cargoCompanyId: number;
  shipmentAddressId?: number;
  returningAddressId?: number;
}

// ----------------------------------------
// 2) ProductV2Update (Ürün Güncelleme)
// ----------------------------------------

/**
 * Batch update yanıt modeli.
 */
export interface BatchUpdateResponse {
  batchRequestId: string;
  items: UpdateItem[];
  status: string;
  creationDate: number;
  lastModification: number;
  sourceType: string;
  itemCount: number;
  failedItemCount: number;
  batchRequestType: string;
}

/**
 * Update item detayı.
 */
export interface UpdateItem {
  requestItem: UpdateRequestItem;
  status: string;
  failureReasons: string[];
}

/**
 * Update request item.
 */
export interface UpdateRequestItem {
  product: UpdateProductDetail;
  barcode: string;
}

/**
 * Update ürün detayları.
 */
export interface UpdateProductDetail {
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  categoryId: number;
  stockCode: string;
  dimensionalWeight: number;
  description: string;
  vatRate: number;
  images: TrendyolProductImage[];
  attributes: TrendyolProductAttribute[];
  cargoCompanyId: number;
  shipmentAddressId?: number;
  returningAddressId?: number;
  deliveryDuration?: number;
  deliveryOption?: string;
  contentId?: string;
}

// ----------------------------------------
// 3) ProductInventoryUpdate (Stok & Fiyat Güncelleme)
// ----------------------------------------

/**
 * Batch inventory update yanıt modeli.
 */
export interface BatchInventoryUpdateResponse {
  batchRequestId: string;
  items: InventoryUpdateItem[];
  creationDate: number;
  lastModification: number;
  sourceType: string;
  itemCount: number;
  failedItemCount: number;
  batchRequestType: string;
}

/**
 * Inventory update item detayı.
 */
export interface InventoryUpdateItem {
  requestItem: InventoryUpdateRequestItem;
  status: string;
  failureReasons: string[];
}

/**
 * Inventory update request item.
 */
export interface InventoryUpdateRequestItem {
  updateRequestDate: string; // ISO date string
  quantity: number;
  salePrice: number;
  barcode: string;
  listPrice: number;
}