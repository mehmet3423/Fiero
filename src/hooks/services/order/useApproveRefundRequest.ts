import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { BASE_URL } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// TODO: Update this endpoint when backend is ready
// For now, this is a placeholder that will need to be updated
const APPROVE_REFUND_REQUEST_ENDPOINT = `${BASE_URL}api/Order/ApproveRefundRequest`;

export const useApproveRefundRequest = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();
  const queryClient = useQueryClient();

  const approveRefundRequest = async (
    orderId: string,
    note?: string
  ) => {
    // TODO: Update this when backend endpoint is ready
    // For now, this is a placeholder
    const response = await mutateAsync(
      {
        url: `${APPROVE_REFUND_REQUEST_ENDPOINT}?orderId=${orderId}`,
        method: HttpMethod.POST,
        data: note ? { note } : undefined,
      },
      {
        onSuccess: () => {
          toast.success("İade talebi başarıyla onaylandı");
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.REFUND_REQUESTED_ORDER_ITEMS],
          });
        },
        // onError kaldırıldı - useMyMutation zaten backend mesajını gösteriyor
      }
    );

    return response.data;
  };

  return { approveRefundRequest, isPending };
};

