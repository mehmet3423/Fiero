import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_DISCOUNT_BY_ID } from "@/constants/links";
import { Discount } from "@/constants/models/Discount";
import useGetData from "@/hooks/useGetData";

export const useGetDiscountById = (discountId: string) => {
  const { data, isLoading, error, refetch } = useGetData<Discount>({
    url: `${GET_DISCOUNT_BY_ID}?Id=${discountId}`,
    queryKey: [QueryKeys.DISCOUNT_DETAIL, discountId],
    method: HttpMethod.GET,
    enabled: !!discountId,
  });

  return {
    discount: data,
    isLoading,
    error,
    refetch,
  };
};
