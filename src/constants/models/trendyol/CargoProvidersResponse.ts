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