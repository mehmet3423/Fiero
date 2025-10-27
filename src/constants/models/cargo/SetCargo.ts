/**
 * SetCargo API endpoint için request modeli
 * /api/Logistics/SetCargo endpoint'ine gönderilecek veri yapısı
 */

export interface SetCargoPackage {
  isSingleProduct: boolean;
  barcodeNumber: string;
  productNumber: string;
  description: string;
  weight: number;
  volumetricWeight: number;
}

export interface SetCargoRequest {
  integrationCode: string;
  tradingWaybillNumber: string;
  invoiceNumber: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone1: string;
  receiverCityName: string;
  receiverTownName: string;
  taxNumber: string;
  taxOffice: string;
  payorTypeCode: number;
  isCod: boolean;
  codAmount: number;
  codCollectionIsCreditCard: boolean;
  packages: SetCargoPackage[];
}

/**
 * SetCargo API response modeli
 * API'den dönen response yapısı
 */
export interface SetCargoResponse {
  success: boolean;
  message?: string;
  data?: {
    cargoId?: string;
    trackingNumber?: string;
    integrationCode?: string;
  };
  errors?: string[];
}

/**
 * PayorTypeCode enum değerleri
 * API'de kullanılan payor type kodları
 */
export enum PayorTypeCode {
  SENDER = 0,
  RECEIVER = 1,
  THIRD_PARTY = 2,
}
