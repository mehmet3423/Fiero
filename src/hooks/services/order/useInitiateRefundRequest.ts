import { HttpMethod } from "@/constants/enums/HttpMethods";
import { INITIATE_REFUND_REQUEST } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { toast } from "react-hot-toast";

export interface InitiateRefundRequestData {
  paymentTransactionId: string;
  reasonType: number;
  description: string;
}

export const useInitiateRefundRequest = () => {
  const { mutateAsync, isPending } = useMyMutation<any>();

  const initiateRefund = async (refundData: InitiateRefundRequestData) => {
    try {
      const response = await mutateAsync(
        {
          url: INITIATE_REFUND_REQUEST,
          method: HttpMethod.POST,
          data: [
            {
              paymentTransactionId: refundData.paymentTransactionId,
              reasonType: refundData.reasonType,
              description: refundData.description,
            },
          ],
        },
        {
          onSuccess: () => {
            toast.success("İade talebiniz başarıyla oluşturuldu");
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { initiateRefund, isPending };
};
