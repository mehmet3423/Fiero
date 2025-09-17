/**
 * Sayfalama isteği base sınıfı.
 */
export interface PageRequest {
  page: number; // default: 0
  pageSize: number; // default: 10
  from: number; // default: 0
}