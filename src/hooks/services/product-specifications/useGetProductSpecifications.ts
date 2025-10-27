import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_SPECIFICATION_LIST } from "@/constants/links";
import { ProductSpecificationListResponse } from "@/constants/models/ProductSpecification";
import useGetData from "@/hooks/useGetData";

export const useGetProductSpecifications = (productId: string | null) => {
  const { data, isLoading, error, refetch } =
    useGetData<ProductSpecificationListResponse>({
      url:
        productId !== null
          ? `${GET_PRODUCT_SPECIFICATION_LIST}?ProductId=${productId}&_=${Date.now()}`
          : undefined,
      queryKey: [QueryKeys.PRODUCT_SPECIFICATIONS_LIST, productId?.toString()],
      method: HttpMethod.GET,
      onError: () => {
        return {
          $id: "0",
          items: {
            $id: "1",
            $values: [],
          },
        };
      },
    });
  return {
    productSpecifications: data?.items?.$values || data?.items || [],
    isLoading,
    error,
    refetchProductSpecifications: refetch,
  };
};
