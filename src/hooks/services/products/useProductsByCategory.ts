import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_LIST_BY_SUB_CATEGORY_ID } from "@/constants/links";
import { ProductListResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";
import { DiscountSort, RatingSort } from "@/constants/enums/SortOptions";

interface UseProductsByCategoryOptions {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  discountSort?: DiscountSort;
  ratingSort?: RatingSort;
}

export const useProductsByCategory = (
  categoryId?: string,
  options: UseProductsByCategoryOptions = {},
  subSpecificationIds?: string[]
) => {
  const params = new URLSearchParams();
  if (categoryId) params.set("SubCategoryId", categoryId);
  if (subSpecificationIds && subSpecificationIds.length > 0) {
    subSpecificationIds.forEach((id) => {
      params.append("SpecificationOptionIds", id);
    });
  }

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
    url: categoryId
      ? `${GET_PRODUCT_LIST_BY_SUB_CATEGORY_ID}?${params.toString()}`
      : undefined,
    queryKey: categoryId
      ? [
        QueryKeys.PRODUCT_LIST,
        categoryId,
        JSON.stringify(subSpecificationIds || []),
        options.page?.toString(),
        options.pageSize?.toString(),
        options.discountSort?.toString(),
        options.ratingSort?.toString(),
      ]
      : QueryKeys.PRODUCT_LIST,
    method: HttpMethod.GET,
    enabled: options.enabled && !!categoryId,
  });

  return {
    products: data?.data || { items: [], from: 0, index: 0, size: 0, count: 0, pages: 0, hasPrevious: false, hasNext: false },
    isLoading,
    error,
    isSuccess: data?.isSucceed,
    message: data?.message,
  };
};
