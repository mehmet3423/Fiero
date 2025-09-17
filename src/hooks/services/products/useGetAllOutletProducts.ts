import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_ALL_OUTLET_PRODUCTS } from "@/constants/links";
import {
  GetAllOutletProductsResponse,
  PaginationListResponse,
  ProductBasicDTO,
} from "@/constants/models/Product";
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
  // Request body oluştur
  const requestBody: {
    discountSort?: DiscountSort;
    ratingSort?: RatingSort;
    salesCountSort?: SalesCountSort;
    likeCountSort?: LikeCountSort;
    mainCategoryId?: string;
    subCategoryId?: string;
    page?: number;
    pageSize?: number;
    from?: number;
  } = {};

  if (options.discountSort !== undefined) {
    requestBody.discountSort = options.discountSort;
  }

  if (options.ratingSort !== undefined) {
    requestBody.ratingSort = options.ratingSort;
  }

  if (options.salesCountSort !== undefined) {
    requestBody.salesCountSort = options.salesCountSort;
  }

  if (options.likeCountSort !== undefined) {
    requestBody.likeCountSort = options.likeCountSort;
  }

  if (options.mainCategoryId) {
    requestBody.mainCategoryId = options.mainCategoryId;
  }

  if (options.subCategoryId) {
    requestBody.subCategoryId = options.subCategoryId;
  }

  if (options.page !== undefined) {
    requestBody.page = options.page;
  }

  if (options.pageSize !== undefined) {
    requestBody.pageSize = options.pageSize;
  }

  if (options.from !== undefined) {
    requestBody.from = options.from;
  }

  const { data, isLoading, error } = useGetData<GetAllOutletProductsResponse>({
    url: GET_ALL_OUTLET_PRODUCTS,

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
    data: requestBody,
    enabled: options.enabled !== false,
  });

  return {
    data: data?.data || {
      items: [],
      from: 0,
      index: 0,
      size: 0,
      count: 0,
      pages: 0,
      hasPrevious: false,
      hasNext: false,
    },
    isLoading,
    error,
    isSuccess: data?.isSucceed,
    message: data?.message,
  };
};
