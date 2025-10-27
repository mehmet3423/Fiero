/**
 * Trendyol işlem türü.
 */
export enum TrendyolOperationType {
  /** Ürün Oluşturma */
  Create = 0,

  /** Ürün Güncelleme */
  Update = 1,

  /** Ürün Silme */
  Delete = 2,

  /** Stok ve Fiyat Güncelleme */
  UpdateInventory = 3
}