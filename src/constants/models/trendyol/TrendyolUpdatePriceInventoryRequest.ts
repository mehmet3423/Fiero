export interface TrendyolUpdatePriceInventoryRequest {
  items: TrendyolPriceInventoryItem[];
}

export interface TrendyolPriceInventoryItem {
  barcode: string;
  quantity: number;
  salePrice: number;
  listPrice: number;
}

/**
 * Stok ve fiyat güncelleme servisinden dönen yanıt.
 */
export interface TrendyolUpdatePriceInventoryResponse {
  batchRequestId: string;
}