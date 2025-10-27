import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_PRODUCTS } from "@/constants/links";
import { WrappedProductListResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";
import {
  DiscountSort,
  RatingSort,
  SalesCountSort,
  LikeCountSort,
} from "@/constants/enums/SortOptions";

interface UseGetAllProductsOptions {
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
  search?: string;
}

// Ürünler ile ilgili hook
export const useGetAllProducts = (options: UseGetAllProductsOptions = {}) => {
  // Arama terimi - search parametresi öncelikli, yoksa searchTerm kullan
  const searchQuery = options.search || options.searchTerm;

  // Body data objesi oluştur
  const bodyData = {
    discountSort: options.discountSort !== undefined ? options.discountSort : 0,
    ratingSort: options.ratingSort !== undefined ? options.ratingSort : 0,
    salesCountSort:
      options.salesCountSort !== undefined ? options.salesCountSort : 0,
    likeCountSort:
      options.likeCountSort !== undefined ? options.likeCountSort : 0,
    page: options.page !== undefined ? options.page : 0,
    pageSize: options.pageSize !== undefined ? options.pageSize : 30,
    from: 0,
    ...(options.mainCategoryId && { mainCategoryId: options.mainCategoryId }),
    ...(options.subCategoryId && { subCategoryId: options.subCategoryId }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data, isLoading, error } = useGetData<WrappedProductListResponse>({
    url: GET_ALL_PRODUCTS,
    queryKey: [
      QueryKeys.ALL_PRODUCTS,
      options.page?.toString(),
      options.pageSize?.toString(),
      options.discountSort?.toString(),
      options.ratingSort?.toString(),
      options.salesCountSort?.toString(),
      options.likeCountSort?.toString(),
      options.mainCategoryId,
      options.subCategoryId,
      searchQuery, // search query'yi de key'e ekle
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
