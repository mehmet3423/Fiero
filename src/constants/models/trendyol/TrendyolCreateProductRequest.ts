import { TrendyolDeliveryOption } from "./TrendyolDeliveryOption";
import { TrendyolProductAttribute } from "./TrendyolProductAttribute";
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