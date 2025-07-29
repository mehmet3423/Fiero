import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELETE_SUPPORT_TICKET } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UseDeleteSupportTicketProps    {
  onSuccess?: () => void;
}

export const useDeleteSupportTicket = ({ onSuccess }: UseDeleteSupportTicketProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation();

  const deleteSupportTicket = async (supportTicketId: string) => {
    try {
      const params = new URLSearchParams();
      params.append("id", supportTicketId);

      await mutateAsync({
        url: `${DELETE_SUPPORT_TICKET}?${params}`,
        method: HttpMethod.DELETE
      }, {
        onSuccess: () => {
          // Müşteri siparişleri query'sini invalidate et
          queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
          onSuccess?.();
        }
      });
    } catch (error) {
      toast.error("Sipariş silinirken bir hata oluştu");
      throw error;
    }
  };

  return { deleteSupportTicket, isPending };
}; 