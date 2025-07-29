import { PaginationModel } from "./Pagination";
import { Product } from "./Product";

export interface CategoryListResponse extends PaginationModel {
  $id: string;
  items: Category[];
}

export interface Category {
  $id: string;
  id: string;
  name: string;
  subCategories: SubCategory[];
  displayIndex: number;
}

export interface SubCategory {
  $id: string;
  id: string;
  name: string;
  products: Product[];
  displayIndex: number;
}
