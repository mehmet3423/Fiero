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
      const response = await mutation.mutateAsync({
        url: CREATE_ORDER_SUPPORT_TICKET,
        method: HttpMethod.POST,
        data: {
          requestType: formData.requestType,
          title: formData.title,
          description: formData.description,
          orderItemId: formData.orderItemId,
        },
      });

      toast.success("Sipariş destek talebiniz başarıyla oluşturuldu.");
      return response.data;
    } catch (error: any) {
      console.error("Order Support Ticket API Error:", {
        message: error.message,
        response: error.response?.data,
      });

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
