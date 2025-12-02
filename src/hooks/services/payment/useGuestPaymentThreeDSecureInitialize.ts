import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GUEST_PAYMENT_THREE_D_SECURE_INITIALIZE } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import {
  PaymentThreeDSecureInitializeRequest,
  CreateThreedsPaymentInitializeResponseData,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGuestPaymentThreeDSecureInitialize = () => {
  const { mutateAsync, isPending } =
    useMyMutation<
      CommandResultWithData<CreateThreedsPaymentInitializeResponseData>
    >();

  const initializeGuestThreeDSecure = async (
    threeDSecureData: PaymentThreeDSecureInitializeRequest
  ): Promise<
    CommandResultWithData<CreateThreedsPaymentInitializeResponseData>
  > => {
    try {
      const response = await mutateAsync({
        url: GUEST_PAYMENT_THREE_D_SECURE_INITIALIZE,
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

  return { initializeGuestThreeDSecure, isPending };
};

export default useGuestPaymentThreeDSecureInitialize;
