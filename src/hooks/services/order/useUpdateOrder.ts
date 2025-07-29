import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_ORDER } from "@/constants/links";
import { Order, UpdateOrderRequest } from "@/constants/models/Order";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<Order>();

  const updateOrder = async (orderData: UpdateOrderRequest) => {
    try {
      const params = new URLSearchParams();
      params.append("id", orderData.id);
      params.append("status", orderData.status.toString());
      
      if (orderData.recipientFirstName) params.append("recipientFirstName", orderData.recipientFirstName);
      if (orderData.recipientLastName) params.append("recipientLastName", orderData.recipientLastName);
      if (orderData.recipientPhoneNumber) params.append("recipientPhoneNumber", orderData.recipientPhoneNumber);
      if (orderData.recipientIdentityNumber) params.append("recipientIdentityNumber", orderData.recipientIdentityNumber);

      await mutateAsync({
        url: `${UPDATE_ORDER}?${params}`,
        method: HttpMethod.PUT
      }, {
        onSuccess: () => {
          // İlgili sorguları invalidate et
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["order", orderData.id] });
          toast.success("Sipariş başarıyla güncellendi");
        }
      });
    } catch (error) {
      toast.error("Sipariş güncellenirken bir hata oluştu");
      throw error;
    }
  };

  return { updateOrder, isPending };
};
