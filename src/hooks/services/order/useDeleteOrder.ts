import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_ORDER } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UseDeleteOrderProps {
  onSuccess?: () => void;
}

export const useDeleteOrder = ({ onSuccess }: UseDeleteOrderProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation();

  const deleteOrder = async (orderId: string) => {
    try {
      const params = new URLSearchParams();
      params.append("id", orderId);

      await mutateAsync({
        url: `${DELETE_ORDER}?${params}`,
        method: HttpMethod.DELETE
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.USER_ORDER_LIST]
          });

          toast.success("Sipariş başarıyla silindi");
          onSuccess?.();
        }
      });
    } catch (error) {
      toast.error("Sipariş silinirken bir hata oluştu");
      throw error;
    }
  };

  return { deleteOrder, isPending };
}; 