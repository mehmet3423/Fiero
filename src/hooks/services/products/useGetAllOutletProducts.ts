import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_OUTLET_PRODUCTS } from "@/constants/links";
import { ProductListResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";
import {
  DiscountSort,
  RatingSort,
  SalesCountSort,
  LikeCountSort,
} from "@/constants/enums/SortOptions";

interface UseGetAllOutletProductsOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  enabled?: boolean;
  discountSort?: DiscountSort;
  ratingSort?: RatingSort;
  salesCountSort?: SalesCountSort;
  likeCountSort?: LikeCountSort;
  mainCategoryId?: string;
  subCategoryId?: string;
  from?: number;
}

export const useGetAllOutletProducts = (
  options: UseGetAllOutletProductsOptions = {}
) => {
  const params = new URLSearchParams();

  if (options.discountSort !== undefined) {
    params.append("DiscountSort", options.discountSort.toString());
  }

  if (options.ratingSort !== undefined) {
    params.append("RatingSort", options.ratingSort.toString());
  }

  if (options.salesCountSort !== undefined) {
    params.append("SalesCountSort", options.salesCountSort.toString());
  }

  if (options.likeCountSort !== undefined) {
    params.append("LikeCountSort", options.likeCountSort.toString());
  }

  if (options.mainCategoryId) {
    params.append("MainCategoryId", options.mainCategoryId);
  }

  if (options.subCategoryId) {
    params.append("SubCategoryId", options.subCategoryId);
  }

  if (options.page !== undefined) {
    params.append("Page", options.page.toString());
  }

  if (options.pageSize !== undefined) {
    params.append("PageSize", options.pageSize.toString());
  }

  if (options.from !== undefined) {
    params.append("From", options.from.toString());
  }

  const { data, isLoading, error } = useGetData<ProductListResponse>({
    url: `${GET_ALL_OUTLET_PRODUCTS}?${params.toString()}`,
    queryKey: [
      QueryKeys.ALL_PRODUCTS,
      "outlet",
      options.page?.toString(),
      options.pageSize?.toString(),
      options.discountSort?.toString(),
      options.ratingSort?.toString(),
      options.salesCountSort?.toString(),
      options.likeCountSort?.toString(),
      options.mainCategoryId,
      options.subCategoryId,
    ],
    method: HttpMethod.POST,
    enabled: options.enabled !== false,
  });

  return {
    data,
    isLoading,
    error,
  };
};
