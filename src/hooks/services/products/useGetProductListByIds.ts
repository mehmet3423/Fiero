import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_LIST_BY_IDS } from "@/constants/links";
import { Product } from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

export function useGetProductListByIds(productIds: string[]) {
  // Her id için useGetData hookunu çağır
  const { data, isLoading, error } = useGetData<Product[]>({
    url: GET_PRODUCT_LIST_BY_IDS,
    queryKey: [QueryKeys.PRODUCT_LIST_BY_IDS, productIds.join(",")],
    method: HttpMethod.POST,
    data: {
      productIds,
    },
    enabled: productIds.length > 0,
  });

  return {
    products: data || [],
    isLoading,
    error,
  };
}
