import { TrendyolDeliveryOption } from "./TrendyolDeliveryOption";
import { TrendyolProductAttribute } from "./TrendyolProductAttribute";
import { TrendyolProductImage } from "./TrendyolProductImage";

export interface TrendyolUpdateProductRequest {
  items: TrendyolUpdateProductItemRequest[];
}

export interface TrendyolUpdateProductItemRequest {
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  categoryId: number;
  stockCode: string;
  dimensionalWeight: number;
  description: string;
  currencyType: string;
  cargoCompanyId: number;
  deliveryDuration?: number;
  deliveryOption?: TrendyolDeliveryOption;
  images: TrendyolProductImage[];
  vatRate: number;
  shipmentAddressId?: number;
  returningAddressId?: number;
  attributes: TrendyolProductAttribute[];
}
