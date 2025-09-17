export interface BrandListRequest {
  page: number;
  size: number;
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