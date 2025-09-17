import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_ORDER_SUPPORT_TICKET } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";

interface UpdateOrderSupportTicketData {
  id: string;
  requestType?: number;
  supportTicketStatus?: number;
  title?: string;
  description?: string;
  orderItemId?: string;
}

interface UpdateOrderSupportTicketResponse {
  success: boolean;
  message?: string;
}

export const useUpdateOrderSupportTicket = () => {
  const mutation = useMyMutation();

  const updateOrderSupportTicket = async (
    data: UpdateOrderSupportTicketData
  ) => {
    const params = new URLSearchParams();

    // Required parameter
    params.append("Id", data.id);

    // Optional parameters
    if (data.requestType !== undefined) {
      params.append("RequestType", data.requestType.toString());
    }
    if (data.supportTicketStatus !== undefined) {
      params.append("SupportTicketStatus", data.supportTicketStatus.toString());
    }
    if (data.title) {
      params.append("Title", data.title);
    }
    if (data.description) {
      params.append("Description", data.description);
    }
    if (data.orderItemId) {
      params.append("OrderItemId", data.orderItemId);
    }

    return mutation.mutateAsync({
      url: `${UPDATE_ORDER_SUPPORT_TICKET}?${params.toString()}`,
      method: HttpMethod.PUT,
    });
  };

  return {
    updateOrderSupportTicket,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
