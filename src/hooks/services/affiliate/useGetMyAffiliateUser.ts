import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CURRENT_USER_AFFILIATE_USER } from "@/constants/links";
import { AffiliateUser } from "@/constants/models/Affiliate";
import useGetData from "@/hooks/useGetData";

export const useGetMyAffiliateUser = () => {
  const { data, isLoading, error, refetch } = useGetData<AffiliateUser>({
    url: GET_CURRENT_USER_AFFILIATE_USER,
    queryKey: [QueryKeys.MY_AFFILIATE_USER],
    method: HttpMethod.GET,
    onError: (err: any) => {
      // 400 veya 404 hatası normal durumlar (kullanıcının affiliate kaydı yok veya var)
      if (err?.response?.status !== 400 && err?.response?.status !== 404) {
        console.log("Affiliate user error:", err);
      }
    },
  });

  return {
    affiliateUser: data,
    isLoading,
    error,
    refetchAffiliateUser: refetch,
    hasNoRecord: (error as any)?.response?.status === 404,
    hasExistingRecord: (error as any)?.response?.status === 400,
  };
};
