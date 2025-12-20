import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_BASE_PRODUCT_BY_ID } from "@/constants/links";
import { BaseProductDetailResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

interface UseGetBaseProductByIdOptions {
  id?: string;
  enabled?: boolean;
}

export const useGetBaseProductById = ({
  id,
  enabled = true,
}: UseGetBaseProductByIdOptions) => {
  const queryResult = useGetData<BaseProductDetailResponse>({
    url: id ? GET_BASE_PRODUCT_BY_ID(id) : undefined,
    queryKey: [QueryKeys.BASE_PRODUCT_BY_ID, id],
    method: HttpMethod.GET,
    enabled: enabled && !!id,
  });

  return {
    baseProduct: queryResult.data?.data,
    isSuccess: queryResult.data?.isSucceed,
    message: queryResult.data?.message,
    isLoading: queryResult.isLoading,
    isFetchingData: queryResult.isFetchingData,
    isFetching: queryResult.isFetching,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};

