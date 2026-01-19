import { PaginationModel } from "./Pagination";
import { Product } from "./Product";

export interface CategoryListResponse extends PaginationModel {
$id: string;
  items: Category[];
}

export interface CategorySeo {
  slug?: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface Category {
  $id: string;
  id: string;
  name: string;
  nameEn?: string | null;
  subCategories: SubCategory[];
  displayIndex: number;
  imageUrl?: string;
  isActive?: boolean;
  seo?: CategorySeo;
}

export interface SubCategory {
  $id: string;
  id: string;
  name: string;
  nameEn?: string | null;
  products: Product[];
  displayIndex: number;
  imageUrl?: string;
  isActive?: boolean;
  seo?: CategorySeo;
}
