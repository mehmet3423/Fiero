import { HttpMethod } from "@/constants/enums/HttpMethods";
import {
  MAKE_PAYMENT,
  PAYMENT_FAILED_ABORT_ORDER,
  PAYMENT_SUCCESS_COMPLETE_ORDER,
} from "@/constants/links";
import { PaymentResponse, PaymentRequest } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useMakePayment = () => {
  const { mutateAsync, isPending } = useMyMutation<PaymentResponse>();
  const { mutateAsync: completeOrder, isPending: completeOrderPending } =
    useMyMutation<any>();

  const makePayment = async (paymentData: PaymentRequest) => {
    try {
      await mutateAsync(
        {
          url: MAKE_PAYMENT,
          method: HttpMethod.POST,
          data: paymentData,
        },
        {
          onSuccess: () => {
            completeOrder({
              url: `${PAYMENT_SUCCESS_COMPLETE_ORDER}?orderId=${paymentData.orderId}&affliateCollectionId=${paymentData.affliateCollectionId}`,
              method: HttpMethod.POST,
            });
          },
          onError: (error) => {
            completeOrder({
              url: `${PAYMENT_FAILED_ABORT_ORDER}?orderId=${paymentData.orderId}`,
              method: HttpMethod.POST,
            });
          },
        }
      );
      console.log("Payment request successful");
    } catch (error) {
      console.error("Error during payment request:", error);
      throw error;
    }
  };

  return { makePayment, isPending };
};

export default useMakePayment;
