import { HttpMethod } from "@/constants/enums/HttpMethods";
import { PROCESS_REFUND_ITEMS_BY_ORDER } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { ProcessRefundItemsByOrderRequest } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useProcessRefundItemsByOrder = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const processRefundItemsByOrder = async (
    refundData: ProcessRefundItemsByOrderRequest
  ) => {
    try {
      // Backend'e gönderilecek veriyi hazırla
      const requestData = {
        orderId: refundData.orderId,
        isApproved: refundData.isApproved,
        rejectReason: refundData.rejectReason || null, // Backend'de RefundRejectReason? nullable
        description: refundData.description || "" // Kullanıcının girdiği açıklama metni
      };

      const response = await mutateAsync({
        url: PROCESS_REFUND_ITEMS_BY_ORDER,
        method: HttpMethod.POST,
        data: requestData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Sipariş iade işlemi başarıyla gerçekleştirildi");
        return response.data;
      } else {
        // Backend'den hata geldiğinde sadece toast göster, hata fırlatma
        toast.error(response.data.message || "Sipariş iade işlemi sırasında bir hata oluştu");
        return null; // Başarısız işlem için null döndür
      }
    } catch (error) {
      // Network hatası veya diğer hatalar için genel mesaj göster
      return null; // Hata durumunda null döndür
    }
  };

  return {
    processRefundItemsByOrder,
    isPending,
  };
};

export default useProcessRefundItemsByOrder;
