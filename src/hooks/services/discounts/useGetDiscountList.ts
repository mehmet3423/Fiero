import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_DISCOUNT_LIST } from "@/constants/links";
import {
  DiscountListParams,
  DiscountListResponse
} from "@/constants/models/Discount";
import useGetData from "@/hooks/useGetData";

export const useGetDiscountList = (params?: DiscountListParams) => {
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) {
    queryParams.append("Page", params.page.toString());
  }

  if (params?.pageSize !== undefined) {
    queryParams.append("PageSize", params.pageSize.toString());
  }

  if (params?.discountType !== undefined) {
    queryParams.append("DiscountType", params.discountType.toString());
    if (params.isActive !== undefined && params.isActive !== null)
      queryParams.append("isActive", params.isActive.toString());
    queryParams.append("Name", params.name || "");
  }

  const { data, isLoading, error } = useGetData<DiscountListResponse>({
    queryKey: [
      QueryKeys.DISCOUNTS,
      params?.page?.toString(),
      params?.pageSize?.toString(),
      params?.name,
      params?.isActive?.toString(),
      params?.discountType?.toString(),
      params?.productId,
      params?.subCategoryId,
    ],
    url: `${GET_DISCOUNT_LIST}?${queryParams}`,
    method: HttpMethod.GET,
  });

  return { discounts: data?.data?.items || [], totalCount: data?.data?.count || 0, totalPages: data?.data?.pages || 0, isLoading, error };
};
