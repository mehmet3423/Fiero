import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_PRODUCTS } from "@/constants/links";
import { ProductListResponse } from "@/constants/models/Product";
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
  const params = new URLSearchParams();

  // DiscountSort parametresi (fiyat sıralaması) - her zaman ekle
  params.set(
    "DiscountSort",
    (options.discountSort !== undefined ? options.discountSort : 0).toString()
  );

  // RatingSort parametresi (puan sıralaması) - her zaman ekle
  params.set(
    "RatingSort",
    (options.ratingSort !== undefined ? options.ratingSort : 0).toString()
  );

  // SalesCountSort parametresi (satış sayısı sıralaması) - her zaman ekle
  params.set(
    "SalesCountSort",
    (options.salesCountSort !== undefined
      ? options.salesCountSort
      : 0
    ).toString()
  );

  // LikeCountSort parametresi (beğeni sayısı sıralaması) - her zaman ekle
  params.set(
    "LikeCountSort",
    (options.likeCountSort !== undefined ? options.likeCountSort : 0).toString()
  );

  // MainCategoryId parametresi eklenirse
  if (options.mainCategoryId) {
    params.set("MainCategoryId", options.mainCategoryId);
  }

  // SubCategoryId parametresi eklenirse
  if (options.subCategoryId) {
    params.set("SubCategoryId", options.subCategoryId);
  }

  // Arama terimi - search parametresi öncelikli, yoksa searchTerm kullan
  const searchQuery = options.search || options.searchTerm;
  if (searchQuery) {
    params.set("Search", searchQuery);
  }

  params.set(
    "Page",
    options.page !== undefined ? options.page.toString() : "0"
  );
  params.set(
    "PageSize",
    options.pageSize !== undefined ? options.pageSize.toString() : "1000"
  );
  params.set("From", "0");

  const { data, isLoading, error } = useGetData<ProductListResponse>({
    url: `${GET_ALL_PRODUCTS}?${params.toString()}`,
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
    enabled: options.enabled !== false,
  });

  return {
    data,
    isLoading,
    error,
  };
};
