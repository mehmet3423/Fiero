import { HttpMethod } from "@/constants/enums/HttpMethods";
import { COMPLETE_ORDER } from "@/constants/links";
import { Order } from "@/constants/models/Order";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UseCompleteOrderProps {
  onSuccess?: () => void;
}

export const useCompleteOrder = ({ onSuccess }: UseCompleteOrderProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<Order>();

  const completeOrder = async (orderId: string) => {
    try {
      const params = new URLSearchParams();
      params.append("id", orderId);

      await mutateAsync({
        url: `${COMPLETE_ORDER}?${params}`,
        method: HttpMethod.POST
      }, {
        onSuccess: () => {
          // İlgili sorguları yenile
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
          queryClient.invalidateQueries({ queryKey: ["order", orderId] });
          toast.success("Sipariş başarıyla tamamlandı");
          onSuccess?.();
        }
      });
    } catch (error) {
      toast.error("Sipariş tamamlanırken bir hata oluştu");
      throw error;
    }
  };

  return { completeOrder, isPending };
}; 