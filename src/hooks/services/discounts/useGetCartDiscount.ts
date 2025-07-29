import { QueryKeys } from "@/constants/enums/QueryKeys";
import {
  DiscountListParams,
  CartDiscountListResponse,
  CartDiscount,
} from "@/constants/models/Discount";
import useGetData from "@/hooks/useGetData";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_DISCOUNT_LIST } from "@/constants/links";

export const useGetCartDiscount = (params?: DiscountListParams) => {
  const queryParams = new URLSearchParams();

  if (params?.discountType !== undefined) {
    queryParams.append("DiscountType", params.discountType.toString());
  }

  const { data, isLoading, error } = useGetData<CartDiscountListResponse>({
    queryKey: [QueryKeys.CART_DISCOUNTS],
    url: `${GET_DISCOUNT_LIST}?DiscountType=3`,
    method: HttpMethod.GET,
  });

  return { cartDiscount: data?.items || [], isLoading, error };
};
