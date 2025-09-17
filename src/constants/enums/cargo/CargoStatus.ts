export enum CargoStatus {
  Unknown = 0,
  Pending = 1, // Sipariş hazırda / depoda
  AtOriginBranch = 2, // Çıkış şubesinde
  Shipped = 3, // Çıkış şubesinden çıktı
  InTransit = 4, // Taşımada
  AtDestinationBranch = 5, // Varış şubesine ulaştı
  OutForDelivery = 6, // Teslimat personeline verildi
  Delivered = 7, // Başarıyla teslim edildi
  Failed = 8, // Teslim edilemedi
  ReturnInitiated = 9, // İade süreci başladı
  Returned = 10, // İade tamamlandı
  ReturnRejected = 11, // İade reddedildi
  Cancelled = 12, // Sipariş/kargo iptal edildi
}

export const CargoStatusLabels: Record<CargoStatus, string> = {
  [CargoStatus.Unknown]: "Bilinmiyor",
  [CargoStatus.Pending]: "Hazırlanıyor",
  [CargoStatus.AtOriginBranch]: "Çıkış Şubesinde",
  [CargoStatus.Shipped]: "Kargoya Verildi",
  [CargoStatus.InTransit]: "Yolda",
  [CargoStatus.AtDestinationBranch]: "Teslimat Şubesinde",
  [CargoStatus.OutForDelivery]: "Dağıtıma Çıktı",
  [CargoStatus.Delivered]: "Teslim Edildi",
  [CargoStatus.Failed]: "Teslim Edilemedi",
  [CargoStatus.ReturnInitiated]: "İade Süreci Başlatıldı",
  [CargoStatus.Returned]: "İade Edildi",
  [CargoStatus.ReturnRejected]: "İade Reddedildi",
  [CargoStatus.Cancelled]: "İptal Edildi",
};

export const CargoStatusColors: Record<CargoStatus, string> = {
  [CargoStatus.Unknown]: "secondary",
  [CargoStatus.Pending]: "warning",
  [CargoStatus.AtOriginBranch]: "info",
  [CargoStatus.Shipped]: "primary",
  [CargoStatus.InTransit]: "primary",
  [CargoStatus.AtDestinationBranch]: "info",
  [CargoStatus.OutForDelivery]: "warning",
  [CargoStatus.Delivered]: "success",
  [CargoStatus.Failed]: "danger",
  [CargoStatus.ReturnInitiated]: "warning",
  [CargoStatus.Returned]: "danger",
  [CargoStatus.ReturnRejected]: "danger",
  [CargoStatus.Cancelled]: "secondary",
};
