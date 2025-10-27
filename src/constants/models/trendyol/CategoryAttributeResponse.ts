/**
 * Trendyol ürün filtreleme cevabı.
 */
export interface TrendyolFilterProductsResponse {
  /** Toplam ürün sayısı */
  totalElements: number;

  /** Toplam sayfa sayısı */
  totalPages: number;

  /** Şu anki sayfa numarası */
  page: number;

  /** Sayfa başına ürün sayısı */
  size: number;

  /** Sayfadaki ürün listesi */
  content?: TrendyolProductItem[];
}

/**
 * Trendyol ürün detay bilgileri.
 */
export interface TrendyolProductItem {
  id: string;
  approved: boolean;
  archived: boolean;
  productCode: number;
  batchRequestId: string;
  supplierId: number;
  createDateTime: number;
  lastUpdateDate: number;
  gender: string;
  brand: string;
  barcode: string;
  title: string;
  categoryName: string;
  productMainId: string;
  description: string;
  stockUnitType: string;
  quantity: number;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  dimensionalWeight: number;
  stockCode: string;
  deliveryOption: TrendyolDeliveryOption;
  images: TrendyolProductImage[];
  attributes: TrendyolProductAttributeResponse[];
  platformListingId: string;
  stockId: string;
  hasActiveCampaign: boolean;
  locked: boolean;
  productContentId: number;
  pimCategoryId: number;
  brandId: number;
  version: number;
  color: string;
  size: string;
  lockedByUnSuppliedReason: boolean;
  onsale: boolean;
  productUrl: string;
}

/**
 * Trendyol teslimat seçeneği.
 */
export interface TrendyolDeliveryOption {
  // Bu interface için özellikler eklenmelidir
  // C# kodunda TrendyolDeliveryOption sınıfının detayları yok
}

/**
 * Trendyol ürün resmi.
 */
export interface TrendyolProductImage {
  // Bu interface için özellikler eklenmelidir
  // C# kodunda TrendyolProductImage sınıfının detayları yok
}

/**
 * Trendyol ürün özellik cevabı.
 */
export interface TrendyolProductAttributeResponse {
  // Bu interface için özellikler eklenmelidir
  // C# kodunda TrendyolProductAttributeResponse sınıfının detayları yok
}

/**
 * Marka liste çağrısının kök cevabı.
 */
export interface BrandListResponse {
  /** Markaların bulunduğu liste */
  brands: BrandItem[];
}

/**
 * Tek marka satırı.
 */
export interface BrandItem {
  /** Marka ID */
  id: number;

  /** Marka adı */
  name: string;
}

/**
 * Trendyol kargo firması listesini dönen cevap modeli.
 */
export interface CargoProvidersResponse {
  /** Kargo firmalarının tamamı */
  providers: readonly CargoProviderItem[];
}

/**
 * Trendyol kargo firması tekil öğesi.
 */
export interface CargoProviderItem {
  /** Kargo firması ID */
  id: number;

  /** Kargo firması kodu */
  code: string;

  /** Kargo firması adı */
  name: string;

  /** Vergi numarası */
  taxNumber: string;
}

/**
 * Kategoriye ait özelliklerin yanıt modeli.
 */
export interface CategoryAttributeResponse {
  /** Kategorinin ID'si */
  id: number;

  /** Kategorinin adı */
  name: string;

  /** Kategorinin gösterim adı (frontend'de kullanılan) */
  displayName: string;

  /** Kategoriye ait özelliklerin listesi */
  categoryAttributes: CategoryAttributeItem[];
}

/**
 * Kategoriye ait tek bir özellik detayları.
 */
export interface CategoryAttributeItem {
  /** Özelliğin ait olduğu kategori ID'si */
  categoryId: number;

  /** Özelliğin detay bilgileri (ID ve ad) */
  attribute: AttributeDetail;

  /** Bu özelliğin ürün için zorunlu olup olmadığı bilgisi */
  required: boolean;

  /** Özelliğe özel metin (freetext) girilmesine izin verilip verilmediği */
  allowCustom: boolean;

  /** Özelliğin varyant (ürün varyantlama için) olup olmadığı bilgisi */
  varianter: boolean;

  /** Özelliğin slicer (ürün kartı ayırıcı) olup olmadığı bilgisi */
  slicer: boolean;

  /** Özelliğe ait olası değerlerin listesi */
  attributeValues: AttributeValue[];
}

/**
 * Özellik detayları.
 */
export interface AttributeDetail {
  /** Özelliğin ID'si */
  id: number;

  /** Özelliğin adı */
  name: string;
}

/**
 * Özelliğe ait olası değer.
 */
export interface AttributeValue {
  /** Değerin ID'si */
  id: number;

  /** Değerin adı */
  name: string;
}