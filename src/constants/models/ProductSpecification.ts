import { ItemsObject, PaginationModel } from "./Pagination";

export interface ProductSpecificationListResponse extends PaginationModel {
  $id: string;
  items: ItemsObject<ProductSpecification>;
}

export interface ProductSpecification {
  $id: string;
  id: string;
  name: string;
  value: string;
}
