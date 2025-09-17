import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_GENERAL_SUPPORT_TICKET } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";

interface UpdateGeneralSupportTicketData {
  id: string;
  requestType?: number;
  supportTicketStatus?: number;
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface UpdateGeneralSupportTicketResponse {
  success: boolean;
  message?: string;
}

export const useUpdateGeneralSupportTicket = () => {
  const mutation = useMyMutation();

  const updateGeneralSupportTicket = async (
    data: UpdateGeneralSupportTicketData
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
    if (data.imageUrl) {
      params.append("ImageUrl", data.imageUrl);
    }

    return mutation.mutateAsync({
      url: `${UPDATE_GENERAL_SUPPORT_TICKET}?${params.toString()}`,
      method: HttpMethod.PUT,
    });
  };

  return {
    updateGeneralSupportTicket,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
