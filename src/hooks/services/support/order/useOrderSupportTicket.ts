import { useState } from "react";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_ORDER_SUPPORT_TICKET } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { toast } from "react-hot-toast";

interface OrderSupportTicketFormData {
  requestType: number;
  title: string;
  description: string;
  orderItemId: string;
}

export const useOrderSupportTicket = () => {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMyMutation();

  const handleSubmitTicket = async (formData: OrderSupportTicketFormData) => {
    setIsPending(true);

    try {
      // Query parametreleri olarak URL'e ekle
      const queryParams = new URLSearchParams({
        RequestType: formData.requestType.toString(),
        Title: formData.title,
        Description: formData.description,
        OrderItemId: formData.orderItemId,
      });

      const response = await mutation.mutateAsync({
        url: `${CREATE_ORDER_SUPPORT_TICKET}?${queryParams.toString()}`,
        method: HttpMethod.POST,
        // Body boş bırakıyoruz çünkü tüm veriler query string'de
      });

      toast.success("Sipariş destek talebiniz başarıyla oluşturuldu.");
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => toast.error(`${field}: ${msg}`));
            }
          }
        );
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    handleSubmitTicket,
    isPending: isPending || mutation.isPending,
  };
};
