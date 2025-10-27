/**
 * İade-sevkiyat (supplier) adresi kök cevabı.
 */
export interface SupplierAddressesResponse {
  /** Mağazaya tanımlı tüm adresler */
  supplierAddresses: SupplierAddress[];

  /** Varsayılan sevkiyat adresi */
  defaultShipmentAddress?: SupplierAddress;

  /** Varsayılan fatura adresi */
  defaultInvoiceAddress?: SupplierAddress;

  /** Varsayılan iade adresi */
  defaultReturningAddress?: DefaultFlag;
}

/**
 * Tek adres satırı.
 */
export interface SupplierAddress {
  id: number;
  /** Adres türü: Shipment / Invoice / Returning */
  addressType: string;
  country: string;
  city: string;
  cityCode: number;
  district: string;
  districtId: number;
  postCode: string;
  address: string;
  isReturningAddress: boolean;
  fullAddress: string;
  isShipmentAddress: boolean;
  isInvoiceAddress: boolean;
  isDefault: boolean;
}

/**
 * Dönen JSON'daki { "present": true } yapısı için.
 */
export interface DefaultFlag {
  present: boolean;
}