import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_BY_ID } from "@/constants/links";
import { GetProductByIdResponse, ProductWithDiscountDTO } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

export const useProductDetail = (productId?: string) => {
  const { data, isLoading, error } = useGetData<GetProductByIdResponse>({
    url: productId ? `${GET_PRODUCT_BY_ID}?id=${productId}` : undefined,
    queryKey: [QueryKeys.PRODUCT_DETAIL, productId],
    method: HttpMethod.GET,
    enabled: !!productId,
  });

  return {
    product: data?.data as ProductWithDiscountDTO | undefined,
    isSuccess: data?.isSucceed,
    message: data?.message,
    isLoading,
    error,
  };
};
