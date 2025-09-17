import { TrendyolProductStatus } from "@/constants/enums/TrendyolProductStatus";
import { CurrencyType } from "@/constants/enums/CurrencyType";
import { TrendyolProductItem } from "./TrendyolMarketplace";
import { Discount } from "../Discount";

export interface ProductWithTrendyolResponse {
  id: string;
  createdOnValue?: string;
  modifiedOnValue?: string;
  isDeleted: boolean;
  title: string;
  barcodeNumber: string;
  sellableQuantity: number;
  price: number;
  discountedPrice: number;
  isAvailable: boolean;
  isOutlet: boolean;
  refundable: boolean;
  averageRating: number;
  ratingCount: number;
  baseImageUrl: string;
  contentImageUrls: string[];
  currencyType: CurrencyType;
  trendyolStatus?: TrendyolProductStatus;
  trendyolBatchRequestId?: string;
  discountDTO?: Discount;
  trendyolInfo?: TrendyolProductItem;
  trendyolProductOperations?: TrendyolProductOperationResponse[];
}


export interface TrendyolProductOperationResponse {
  id: string;
  createdOnValue?: string;
  modifiedOnValue?: string;
  isDeleted: boolean;
  operationType: TrendyolOperationType;
  status: TrendyolProductStatus;
  batchId?: string;
  trendyolMessages?: string[];
  requestedAt: string;
  respondedAt?: string;
  isFinal: boolean;
  barcode?: string;
  title?: string;
  productMainId?: string;
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  quantity?: number;
  stockCode?: string;
  dimensionalWeight?: number;
  description?: string;
  currencyType?: CurrencyType;
  listPrice?: number;
  salePrice?: number;
  vatRate?: number;
  images?: string[];
  productAttributes?: ProductAttributeResponse[];
  attributesJson?: string;
  cargoCompanyId?: number;
  shipmentAddressId?: number;
  returningAddressId?: number;
  failureReasons?: string[];
}


import { TrendyolOperationType } from "@/constants/enums/TrendyolOperationType";

export interface ProductAttributeResponse {
  attributeId: number;
  attributeValueId?: number;
  customAttributeValue?: string;
}