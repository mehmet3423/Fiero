import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SEND_INVOICE_LINK } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SendInvoiceLinkRequest } from "@/constants/models/trendyol/SendInvoiceLinkRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSendInvoiceLink = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const sendInvoiceLink = async (request: SendInvoiceLinkRequest) => {
    try {
      const response = await mutateAsync({
        url: SEND_INVOICE_LINK,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Fatura linki başarıyla gönderildi");
        return response.data;
      } else {
        toast.error(response.data.message || "Fatura linki gönderilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Fatura linki gönderilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    sendInvoiceLink,
    isPending,
  };
};