import { HttpMethod } from "@/constants/enums/HttpMethods";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TRANSFER_ELIGIBLE_COMMISSIONS_TO_EARNINGS } from "@/constants/links";
interface TransferEligibleCommissionsRequest {
  // Request body seems to be empty based on the API screenshot
}

export const useTransferEligibleCommissions = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const transferEligibleCommissions = async (
    data: TransferEligibleCommissionsRequest
  ) => {
    try {
      await mutateAsync(
        {
          url: TRANSFER_ELIGIBLE_COMMISSIONS_TO_EARNINGS,
          method: HttpMethod.POST,
          data,
        },
        {
          onSuccess: () => {
            // Refresh affiliate user data to get updated earnings
            queryClient.invalidateQueries({ queryKey: ["affiliateUser"] });
          },
          onError: (error: any) => {
            console.error("Transfer eligible commissions error:", error);
            toast.error("Kazanç hesaplama sırasında bir hata oluştu");
          },
        }
      );
    } catch (error) {
      console.error("Error transferring eligible commissions:", error);
      throw error;
    }
  };

  return {
    transferEligibleCommissions,
    isPending,
  };
};
