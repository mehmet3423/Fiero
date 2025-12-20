import { HttpMethod } from "@/constants/enums/HttpMethods";
import { APPROVE_CLAIM_LINE_ITEMS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { ApproveClaimLineItemsRequest } from "@/constants/models/trendyol/ApproveClaimLineItemsRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useApproveClaimLineItems = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const approveClaimLineItems = async (claimId: string, request: ApproveClaimLineItemsRequest) => {
    try {
      const response = await mutateAsync({
        url: APPROVE_CLAIM_LINE_ITEMS(claimId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "İade kalemleri onaylanırken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("İade kalemleri onaylanırken bir hata oluştu");
      throw error;
    }
  };

  return {
    approveClaimLineItems,
    isPending,
  };
};
