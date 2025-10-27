import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELETE_INVOICE_LINK } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { DeleteInvoiceLinkRequest } from "@/constants/models/trendyol/DeleteInvoiceLinkRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

interface DeleteInvoiceLinkParams {
  shipmentPackageId: number;
  customerId: number;
}

export const useDeleteInvoiceLink = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const deleteInvoiceLink = async ({ shipmentPackageId, customerId }: DeleteInvoiceLinkParams) => {
    const request: DeleteInvoiceLinkRequest = {
      serviceSourceId: shipmentPackageId,
      channelId: 1,
      customerId,
    };

    try {
      const response = await mutateAsync({
        url: DELETE_INVOICE_LINK,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Fatura linki başarıyla silindi");
        return response.data;
      } else {
        toast.error(response.data.message || "Fatura linki silinirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Fatura linki silinirken bir hata oluştu");
      throw error;
    }
  };

  return {
    deleteInvoiceLink,
    isPending,
  };
};