import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_BASE_PRODUCTS_LIST } from "@/constants/links";
import {
  BaseProductListRequest,
  BaseProductListResponse,
} from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

interface UseGetBaseProductListOptions extends BaseProductListRequest {
  enabled?: boolean;
}

export const useGetBaseProductList = (
  options: UseGetBaseProductListOptions = {}
) => {
  const payload = {
    page: options.page ?? 0,
    pageSize: options.pageSize ?? 20,
    from: options.from ?? 0,
    subCategoryId: options.subCategoryId ?? null,
    search: options.search ?? null,
  };

  const queryKey: (QueryKeys | string | undefined)[] = [
    QueryKeys.BASE_PRODUCTS,
    payload.page?.toString(),
    payload.pageSize?.toString(),
    payload.from?.toString(),
    payload.subCategoryId || "",
    payload.search || "",
  ];

  const queryResult = useGetData<BaseProductListResponse>({
    url: GET_BASE_PRODUCTS_LIST,
    method: HttpMethod.POST,
    data: payload,
    queryKey,
    enabled: options.enabled !== false,
  });

  return {
    data: queryResult.data?.data,
    baseProducts: queryResult.data?.data?.items ?? [],
    isLoading: queryResult.isLoading,
    isFetchingData: queryResult.isFetchingData,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};
