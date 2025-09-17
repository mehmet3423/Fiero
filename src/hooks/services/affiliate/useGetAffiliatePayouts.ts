import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CURRENT_USER_AFFILIATE_PAYOUTS } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

interface AffiliatePayout {
  id: string;
  affiliateUserId: string;
  requestedAmount: number;
  status: number; // 0: Pending, 1: Approved, 2: Rejected, etc.
  requestDate: string;
  processedDate?: string;
  description?: string;
  createdDate: string;
}

interface AffiliatePayoutResponse {
  items: AffiliatePayout[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const useGetAffiliatePayouts = (
  page: number = 1,
  pageSize: number = 10
) => {
  const { data, isLoading, error, refetch } =
    useGetData<AffiliatePayoutResponse>({
      url: `${GET_CURRENT_USER_AFFILIATE_PAYOUTS} `,
      queryKey: [QueryKeys.AFFILIATE_PAYOUTS],
      method: HttpMethod.GET,
      onError: (err: any) => {
      },
    });

  return {
    payouts: data?.items || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
};
