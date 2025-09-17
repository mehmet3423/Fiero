import { HttpMethod } from "@/constants/enums/HttpMethods";
import {
  MAKE_PAYMENT,
  PAYMENT_FAILED_ABORT_ORDER
} from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { PaymentRequest, CreateNonThreedsPaymentAuthResponseData } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useMakePayment = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<CreateNonThreedsPaymentAuthResponseData>>();
  const { mutateAsync: completeOrder, isPending: completeOrderPending } =
    useMyMutation<any>();

  const makePayment = async (
    paymentData: PaymentRequest
  ): Promise<CommandResultWithData<CreateNonThreedsPaymentAuthResponseData>> => {
    try {
      const response = await mutateAsync({
        url: MAKE_PAYMENT,
        method: HttpMethod.POST,
        data: paymentData,
      });


      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        toast.error(response.data.message || "Payment failed");
        throw new Error(response.data.message || "Payment failed");
      }

      toast.success("Payment request successful");
      return response.data;
    } catch (error) {

      // Hata durumunda abort order isteği at
      try {
        await completeOrder({
          url: PAYMENT_FAILED_ABORT_ORDER,
          method: HttpMethod.POST,
          data: {
            orderId: paymentData.orderId,
          },
        });
      } catch (completeOrderError) {
        // Silent fail for abort order
      }

      throw error;
    }
  };

  return { makePayment, isPending };
};

export default useMakePayment;
