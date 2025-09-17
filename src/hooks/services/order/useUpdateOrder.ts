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
      params.append("orderId", orderData.orderId);

      if (orderData.recipientName) params.append("recipientName", orderData.recipientName);
      if (orderData.recipientSurname) params.append("recipientSurname", orderData.recipientSurname);
      if (orderData.recipientPhoneNumber) params.append("recipientPhoneNumber", orderData.recipientPhoneNumber);
      if (orderData.recipientIdentityNumber) params.append("recipientIdentityNumber", orderData.recipientIdentityNumber);
      if (orderData.billingAddressId) params.append("billingAddressId", orderData.billingAddressId);
      if (orderData.shippingAddressId) params.append("shippingAddressId", orderData.shippingAddressId);
      if (orderData.cargoStatus !== undefined) params.append("cargoStatus", orderData.cargoStatus.toString());

      await mutateAsync({
        url: `${UPDATE_ORDER}?${params}`,
        method: HttpMethod.PUT
      }, {
        onSuccess: () => {
          // İlgili sorguları invalidate et
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["order", orderData.orderId] });
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
