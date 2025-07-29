import { PaginationModel } from "./Pagination";

export interface SubCategorySpecification {
  $id: string;
  id: string;
  name: string;
  subCategoryId: string;
  specificationOptions: SpecificationOption[];
  newOptions?: string[];
}

export interface SpecificationOption {
  $id: string;
  id: string;
  value: string;
  subCategorySpecificationId: string;
}

export interface SubCategorySpecificationListResponse extends PaginationModel {
  $id: string;
  items: SubCategorySpecification[];
}
