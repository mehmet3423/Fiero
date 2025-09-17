import { TrendyolDeliveryOption } from "./TrendyolDeliveryOption";
import { TrendyolProductAttribute } from "./TrendyolProductAttribute";
import { TrendyolProductAttributeResponse } from "./TrendyolProductAttributeResponse";
import { TrendyolProductImage } from "./TrendyolProductImage";

export interface TrendyolCreateProductRequest {
  items: TrendyolCreateProductItemRequest[];
}

export interface TrendyolCreateProductItemRequest {
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
  cargoCompanyId: number;
  shipmentAddressId?: number;
  returningAddressId?: number;
  deliveryOption?: TrendyolDeliveryOption;
  images: TrendyolProductImage[];
  attributes: TrendyolProductAttribute[];
}

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
  onSale: boolean;
  productUrl: string;
}

export interface TrendyolProductsResponse {
  content: TrendyolProductItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}