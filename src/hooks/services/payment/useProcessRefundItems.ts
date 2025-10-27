import { HttpMethod } from "@/constants/enums/HttpMethods";
import { PROCESS_REFUND_ITEMS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { ProcessRefundItemsRequest } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useProcessRefundItems = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const processRefundItems = async (refundData: ProcessRefundItemsRequest) => {
    try {
      // Backend'e gönderilecek veriyi hazırla
      const requestData = {
        items: refundData.items.map(item => ({
          orderItemId: item.orderItemId,
          isApproved: item.isApproved,
          rejectReason: item.rejectReason || null, // Backend'de RefundRejectReason? nullable
          description: item.description || "" // Kullanıcının girdiği açıklama metni
        }))
      };

      const response = await mutateAsync({
        url: PROCESS_REFUND_ITEMS,
        method: HttpMethod.POST,
        data: requestData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Ürün iade işlemi başarıyla gerçekleştirildi");
        return response.data;
      } else {
        // Backend'den hata geldiğinde sadece toast göster, hata fırlatma
        toast.error(response.data.message || "Ürün iade işlemi sırasında bir hata oluştu");
        return null; // Başarısız işlem için null döndür
      }
    } catch (error) {
      // Network hatası veya diğer hatalar için genel mesaj göster

      return null; // Hata durumunda null döndür
    }
  };

  return {
    processRefundItems,
    isPending,
  };
};

export default useProcessRefundItems;
