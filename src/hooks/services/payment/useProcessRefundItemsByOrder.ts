import { HttpMethod } from "@/constants/enums/HttpMethods";
import { PROCESS_REFUND_ITEMS_BY_ORDER } from "@/constants/links";
import {
  ProcessRefundItemsByOrderRequest,
  PaymentResponse,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useProcessRefundItemsByOrder = () => {
  const { mutateAsync, isPending } = useMyMutation<PaymentResponse>();

  const processRefundItemsByOrder = async (
    refundData: ProcessRefundItemsByOrderRequest
  ) => {
    try {
      const response = await mutateAsync({
        url: PROCESS_REFUND_ITEMS_BY_ORDER,
        method: HttpMethod.POST,
        data: refundData,
      });
      return response;
    } catch (error) {
      console.error("Error during process refund items by order:", error);
      throw error;
    }
  };

  return { processRefundItemsByOrder, isPending };
};

export default useProcessRefundItemsByOrder;
