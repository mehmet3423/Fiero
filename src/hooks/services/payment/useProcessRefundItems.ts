import { HttpMethod } from "@/constants/enums/HttpMethods";
import { PROCESS_REFUND_ITEMS } from "@/constants/links";
import {
  ProcessRefundItemsRequest,
  PaymentResponse,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useProcessRefundItems = () => {
  const { mutateAsync, isPending } = useMyMutation<PaymentResponse>();

  const processRefundItems = async (refundData: ProcessRefundItemsRequest) => {
    try {
      const response = await mutateAsync({
        url: PROCESS_REFUND_ITEMS,
        method: HttpMethod.POST,
        data: refundData,
      });
      return response;
    } catch (error) {
      console.error("Error during process refund items:", error);
      throw error;
    }
  };

  return { processRefundItems, isPending };
};

export default useProcessRefundItems;
