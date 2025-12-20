import { HttpMethod } from "@/constants/enums/HttpMethods";
import { INITIATE_REFUND_REQUEST_FOR_ORDER } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { toast } from "react-hot-toast";

interface InitiateOrderRefundRequestData {
  orderId: string;
  reasonType: number;
  description: string;
}

export const useInitiateOrderRefundRequest = () => {
  const { mutateAsync, isPending } = useMyMutation<any>();

  const initiateOrderRefund = async (data: InitiateOrderRefundRequestData) => {
    try {
      const response = await mutateAsync(
        {
          url: INITIATE_REFUND_REQUEST_FOR_ORDER,
          method: HttpMethod.POST,
          data,
        },
        {
          onSuccess: () => {
            toast.success("Siparişiniz için iade talebi oluşturuldu");
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { initiateOrderRefund, isPending };
};
