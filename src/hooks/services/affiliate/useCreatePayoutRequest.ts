import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_AFFILIATE_PAYOUT_REQUEST } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CreatePayoutRequest {
  affiliateUserId: string;
  requestedAmount: number;
}

export const useCreatePayoutRequest = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const createPayoutRequest = async (data: CreatePayoutRequest) => {
    try {
      await mutateAsync(
        {
          url: CREATE_AFFILIATE_PAYOUT_REQUEST,
          method: HttpMethod.POST,
          data,
        },
        {
          onSuccess: () => {
            toast.success("Ödeme talebi başarıyla oluşturuldu");
            // Refresh affiliate payout data to get updated list
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.AFFILIATE_PAYOUTS],
            });
            // Also refresh affiliate user data to get updated earnings
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.MY_AFFILIATE_USER],
            });
          },
          onError: (error: any) => {
            toast.error("Ödeme talebi oluşturulurken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  return {
    createPayoutRequest,
    isPending,
  };
};
