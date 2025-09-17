/**
 * Trendyol kategori ağacı cevabı (ağaç yapısı, sonsuz derinlikte alt kategoriler).
 */
export interface CategoryTreeResponse {
  categories: CategoryTreeItem[];
}

/**
 * Tek bir kategori düğümü.
 */
export interface CategoryTreeItem {
  /** Kategori ID'si */
  id: number;

  /** Kategori adı */
  name: string;

  /** Üst (parent) kategori ID'si. Kök için null gelebilir */
  parentId?: number;

  /** Alt kategori listesi. Alt kategori yoksa boş liste gelir */
  subCategories: CategoryTreeItem[];
}