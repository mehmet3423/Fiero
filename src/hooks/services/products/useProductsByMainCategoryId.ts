import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_LIST_BY_MAIN_CATEGORY_ID } from "@/constants/links";
import { ProductListResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";
import { DiscountSort, RatingSort } from "@/constants/enums/SortOptions";

interface UseProductsByMainCategoryIdOptions {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  discountSort?: DiscountSort;
  ratingSort?: RatingSort;
}

export const useProductsByMainCategoryId = (
  mainCategoryId?: string,
  options: UseProductsByMainCategoryIdOptions = {}
) => {
  const params = new URLSearchParams();
  if (mainCategoryId) params.set("MainCategoryId", mainCategoryId);

  // Add pagination parameters if provided
  if (typeof options.page === "number")
    params.set("Page", options.page.toString());
  if (typeof options.pageSize === "number")
    params.set("PageSize", options.pageSize.toString());

  // DiscountSort parametresi eklenirse (fiyat sıralaması)
  if (options.discountSort !== undefined) {
    params.set("DiscountSort", options.discountSort.toString());
  }

  // RatingSort parametresi eklenirse (puan sıralaması)
  if (options.ratingSort !== undefined) {
    params.set("RatingSort", options.ratingSort.toString());
  }

  // Add search term if provided
  if (options.searchTerm) {
    params.set("SearchTerm", options.searchTerm);
  }

  const { data, isLoading, error } = useGetData<ProductListResponse>({
    url: mainCategoryId
      ? `${GET_PRODUCT_LIST_BY_MAIN_CATEGORY_ID}?${params.toString()}`
      : undefined,
    queryKey: [
      QueryKeys.PRODUCT_LIST,
      mainCategoryId,
      options.page?.toString(),
      options.pageSize?.toString(),
      options.discountSort?.toString(),
      options.ratingSort?.toString(),
    ],
    method: HttpMethod.GET,
    enabled: options.enabled && !!mainCategoryId,
  });

  return {
    products: data?.data || { items: [], from: 0, index: 0, size: 0, count: 0, pages: 0, hasPrevious: false, hasNext: false },
    isLoading,
    error,
    isSuccess: data?.isSucceed,
    message: data?.message,
  };
};
