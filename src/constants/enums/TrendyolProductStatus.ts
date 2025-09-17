/**
 * Trendyol ürün durumu.
 */
export enum TrendyolProductStatus {
  /** Yayından Kaldırıldı (Satışta Değil) */
  NotOnSale = 0,

  /** Trendyol'da Satışta (Yayında) */
  OnSale = 1,

  /** Trendyol'dan Kalıcı Olarak Silindi */
  PermanentlyDeleted = 2,

  /** Trendyol Tarafından İnceleniyor (Onay Sürecinde) */
  AwaitingApproval = 3,

  /** Onay Sürecinde Hata Oluştu */
  ApprovalFailed = 4,

  /** Trendyol Tarafından Reddedildi */
  RejectedByTrendyol = 5,

  /** Yayına Hazır (Tüm Kontroller Tamamlandı) */
  ReadyForPublish = 6,

  /** Trendyol Tarafından Kara Listeye Alındı */
  BlacklistedByTrendyol = 7,

  /** Trendyol işlem sonucu bekleniyor */
  PendingBatchResult = 8
}
