import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_AFFILIATE_USER_LIST } from "@/constants/links";
import { AffiliateUserListResponse } from "@/constants/models/affiliate/AffiliateUser";
import useGetData from "@/hooks/useGetData";

export interface UserPaymentCard {
  id: string;
  name: string;
}

export const useGetAffiliateUserList = (
  pageIndex: number,
  pageSize: number
) => {
  const { data, isLoading, error } = useGetData<AffiliateUserListResponse>({
    url: GET_AFFILIATE_USER_LIST,
    queryKey: QueryKeys.AFFILIATE_USER_LIST,
    params: {
      PageIndex: pageIndex,
      PageSize: pageSize,
    },
    method: HttpMethod.GET,
    onError(err) {
      console.log(err);
    },
  });

  return {
    affiliateUserList: data?.items || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
  };
};
