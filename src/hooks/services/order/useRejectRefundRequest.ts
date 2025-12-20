import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { BASE_URL } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// TODO: Update this endpoint when backend is ready
// For now, this is a placeholder that will need to be updated
const REJECT_REFUND_REQUEST_ENDPOINT = `${BASE_URL}api/Order/RejectRefundRequest`;

export interface RejectRefundRequestParams {
  orderId: string;
  rejectReason?: string;
  note?: string;
}

export const useRejectRefundRequest = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();
  const queryClient = useQueryClient();

  const rejectRefundRequest = async (params: RejectRefundRequestParams) => {
    try {
      // TODO: Update this when backend endpoint is ready
      // For now, this is a placeholder
      const response = await mutateAsync(
        {
          url: `${REJECT_REFUND_REQUEST_ENDPOINT}?orderId=${params.orderId}`,
          method: HttpMethod.POST,
          data: {
            rejectReason: params.rejectReason,
            note: params.note,
          },
        },
        {
          onSuccess: () => {
            toast.success("İade talebi başarıyla reddedildi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.REFUND_REQUESTED_ORDER_ITEMS],
            });
          },
          onError: () => {
            toast.error("İade talebi reddedilirken bir hata oluştu");
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Reject refund request error:", error);
      throw error;
    }
  };

  return { rejectRefundRequest, isPending };
};

