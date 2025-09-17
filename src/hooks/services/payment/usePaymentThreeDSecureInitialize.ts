import { HttpMethod } from "@/constants/enums/HttpMethods";
import { PAYMENT_THREE_D_SECURE_INITIALIZE } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import {
  PaymentThreeDSecureInitializeRequest,
  CreateThreedsPaymentInitializeResponseData,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const usePaymentThreeDSecureInitialize = () => {
  const { mutateAsync, isPending } =
    useMyMutation<
      CommandResultWithData<CreateThreedsPaymentInitializeResponseData>
    >();

  const initializeThreeDSecure = async (
    threeDSecureData: PaymentThreeDSecureInitializeRequest
  ): Promise<
    CommandResultWithData<CreateThreedsPaymentInitializeResponseData>
  > => {
    try {
      const response = await mutateAsync({
        url: PAYMENT_THREE_D_SECURE_INITIALIZE,
        method: HttpMethod.POST,
        data: threeDSecureData,
      });
      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        throw new Error(response.data.message || "Ödeme başarısız.");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { initializeThreeDSecure, isPending };
};

export default usePaymentThreeDSecureInitialize;
