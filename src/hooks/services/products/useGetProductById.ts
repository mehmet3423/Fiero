import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_BY_ID } from "@/constants/links";
import { GetProductByIdResponse } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

interface UseGetProductByIdOptions {
  productId: string;
  enabled?: boolean;
}

export const useGetProductById = (options: UseGetProductByIdOptions) => {
  const { productId, enabled = true } = options;

  const { data, isLoading, error, refetch } = useGetData<GetProductByIdResponse>({
    url: `${GET_PRODUCT_BY_ID}?id=${productId}`,
    queryKey: [QueryKeys.GET_PRODUCT_BY_ID, productId],
    method: HttpMethod.GET,
    enabled: enabled && !!productId,
  });

  return {
    data: data?.data, // Extract the actual product data from CommandResult
    isSuccess: data?.isSucceed,
    message: data?.message,
    isLoading,
    error,
    refetch,
  };
};
