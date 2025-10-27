/**
 * CreateCargo API endpoint için model
 * /api/Order/CreateCargo endpoint'ine gönderilecek veri yapısı
 */

export interface CreateCargoRequest {
  orderId: string;
  cargoCompany: CargoCompany;
  cargoPackageItems: CreateCargoTrackingItem[];
}

export interface CreateCargoTrackingItem {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

/**
 * CreateCargo API response modeli
 * API'den dönen response yapısı
 */
export interface CreateCargoResponse {
  success: boolean;
  message?: string;
  data?: {
    cargoId?: string;
    trackingNumber?: string;
    cargoCompany?: CargoCompany;
  };
  errors?: string[];
}

/**
 * Kargo şirketleri enum
 * API'de desteklenen kargo şirketleri
 */
export enum CargoCompany {
  ARAS = 0,
  YURTICI = 1,
  PTT = 2,
  MNG = 3,
  UPS = 4,
  SURAT = 5,
}
