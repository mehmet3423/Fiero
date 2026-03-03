import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_PRODUCTS_ADMIN } from "@/constants/links";
import { WrappedProductListResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";
import {
  DiscountSort,
  RatingSort,
  SalesCountSort,
  LikeCountSort,
} from "@/constants/enums/SortOptions";

interface UseGetAllProductsAdminOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  enabled?: boolean;
  discountSort?: DiscountSort;
  ratingSort?: RatingSort;
  salesCountSort?: SalesCountSort;
  likeCountSort?: LikeCountSort;
  mainCategoryIds?: string[];
  subCategoryIds?: string[];
  mainCategoryId?: string;
  subCategoryId?: string;
  search?: string;
  isAvailable?: boolean;
  specificationOptionIds?: string[];
}

// Admin paneli için ürünler hook'u
export const useGetAllProductsAdmin = (options: UseGetAllProductsAdminOptions = {}) => {
  // Arama terimi - search parametresi öncelikli, yoksa searchTerm kullan
  const searchQuery = options.search || options.searchTerm;

  // Tekil category ID'leri array'e dönüştür
  const mainCategoryIdsArray = options.mainCategoryIds
    ? options.mainCategoryIds
    : options.mainCategoryId
    ? [options.mainCategoryId]
    : [];

  const subCategoryIdsArray = options.subCategoryIds
    ? options.subCategoryIds
    : options.subCategoryId
    ? [options.subCategoryId]
    : [];

  // Body data objesi oluştur (Swagger GetAllProducts ile uyumlu)
  const bodyData = {
    page: options.page !== undefined ? options.page : 0,
    pageSize: options.pageSize !== undefined ? options.pageSize : 1000,
    from: 0,
    discountSort: options.discountSort !== undefined ? options.discountSort : 0,
    ratingSort: options.ratingSort !== undefined ? options.ratingSort : 0,
    salesCountSort:
      options.salesCountSort !== undefined ? options.salesCountSort : 0,
    likeCountSort:
      options.likeCountSort !== undefined ? options.likeCountSort : 0,
    ...(options.isAvailable !== undefined && { isAvailable: options.isAvailable }),
    mainCategoryIds: mainCategoryIdsArray,
    subCategoryIds: subCategoryIdsArray,
    specificationOptionIds: options.specificationOptionIds || [],
    search: searchQuery || "",
  };

  const { data, isLoading, error } = useGetData<WrappedProductListResponse>({
    url: GET_ALL_PRODUCTS_ADMIN,
    queryKey: [
      QueryKeys.ALL_PRODUCTS,
      "admin",
      options.page?.toString() || "0",
      options.pageSize?.toString() || "1000",
      options.discountSort?.toString() || "0",
      options.ratingSort?.toString() || "0",
      options.salesCountSort?.toString() || "0",
      options.likeCountSort?.toString() || "0",
      options.isAvailable?.toString() ?? "",
      JSON.stringify(mainCategoryIdsArray),
      JSON.stringify(subCategoryIdsArray),
      JSON.stringify(options.specificationOptionIds || []),
      searchQuery || "",
    ],
    method: HttpMethod.POST,
    data: bodyData,
    enabled: options.enabled !== false,
  });

  return {
    data: data?.data, // Wrapper'dan data field'ını çıkar
    items: data?.data?.items || [],
    count: data?.data?.count || 0,
    hasNext: data?.data?.hasNext || false,
    hasPrevious: data?.data?.hasPrevious || false,
    isLoading,
    error,
    isSuccess: data?.isSucceed,
    message: data?.message,
  };
};
