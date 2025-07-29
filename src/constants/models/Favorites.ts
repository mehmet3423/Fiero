// import { Product } from "./Product";

import { Product } from "./Product";

// export interface IFavoritesResponse {
//     $id: string;
//     isSuccess: boolean;
//     message: string;
//     data: {
//         $id: string;
//         $values: Product[];
//     };
// }

export interface FavoritesResponseModel {
  $id?: string;
  data: ResponseData;
  isSucceed: boolean;
  message: string;
}

export interface ResponseData {
  $id?: string;
  items: Product[];
  from: number;
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ItemCollection<T> {
  $id?: string;
  $values: T[];
}
