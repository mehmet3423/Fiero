import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PRODUCT_VARIANTS_BY_BASE_PRODUCT_ID } from "@/constants/links";
import {
  BaseProductVariantDTO,
  BaseProductVariantsResponse,
} from "@/constants/models/Product";
import useGetData from "@/hooks/useGetData";

interface UseGetBaseProductVariantsOptions {
  id?: string;
  enabled?: boolean;
}

export const useGetBaseProductVariants = ({
  id,
  enabled = true,
}: UseGetBaseProductVariantsOptions) => {
  const queryResult = useGetData<BaseProductVariantsResponse>({
    url: id ? GET_PRODUCT_VARIANTS_BY_BASE_PRODUCT_ID(id) : undefined,
    queryKey: [QueryKeys.BASE_PRODUCT_VARIANTS, id],
    method: HttpMethod.GET,
    enabled: enabled && !!id,
  });

  const rawData = queryResult.data?.data;
  const normalizedVariants: BaseProductVariantDTO[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray((rawData as any)?.data)
    ? ((rawData as any).data as BaseProductVariantDTO[])
    : [];

  return {
    variants: normalizedVariants,
    isSuccess: queryResult.data?.isSucceed,
    message: queryResult.data?.message,
    isLoading: queryResult.isLoading,
    isFetchingData: queryResult.isFetchingData,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};
