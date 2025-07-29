export enum AffiliateApplicationStatus {
  InProgress = 1, // Başvuru değerlendirme aşamasında
  Approved = 2, // Başvuru onaylandı
  Rejected = 3, // Başvuru reddedildi
  Cancelled = 4, // Kullanıcı başvurusunu iptal etti
  Suspended = 5, // Hesap askıya alındı
}

export enum UpdateableAffiliateStatus {
  Approved = 2, // Başvuru onaylandı
  Rejected = 3, // Başvuru reddedildi
  Suspended = 5, // Hesap askıya alındı
}

export enum AffiliateCollectionType {
  Product = 1,
  Collection = 2,
  Combination = 3,
  Category = 4,
}

export const getAffiliateStatusText = (
  status: AffiliateApplicationStatus
): string => {
  switch (status) {
    case AffiliateApplicationStatus.InProgress:
      return "Değerlendirme Aşamasında";
    case AffiliateApplicationStatus.Approved:
      return "Onaylandı";
    case AffiliateApplicationStatus.Rejected:
      return "Reddedildi";
    case AffiliateApplicationStatus.Cancelled:
      return "İptal Edildi";
    case AffiliateApplicationStatus.Suspended:
      return "Askıya Alındı";
    default:
      return "Bilinmeyen Durum";
  }
};

export const getUpdateableAffiliateStatusText = (
  status: UpdateableAffiliateStatus
): string => {
  switch (status) {
    case UpdateableAffiliateStatus.Approved:
      return "Onaylandı";
    case UpdateableAffiliateStatus.Rejected:
      return "Reddedildi";
    case UpdateableAffiliateStatus.Suspended:
      return "Askıya Alındı";
    default:
      return "Bilinmeyen Durum";
  }
};
