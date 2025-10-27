import { HttpMethod } from "@/constants/enums/HttpMethods";
import { COMPLETE_THREE_D_SECURE_PAYMENT } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import {
  CompleteThreeDSecurePaymentRequest,
  CompleteThreedsPaymentResponseData,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useCompleteThreeDSecurePayment = () => {
  const { mutateAsync, isPending } =
    useMyMutation<CommandResultWithData<CompleteThreedsPaymentResponseData>>();

  const completeThreeDSecurePayment = async (
    completeData: CompleteThreeDSecurePaymentRequest
  ): Promise<CommandResultWithData<CompleteThreedsPaymentResponseData>> => {
    try {
      const response = await mutateAsync({
        url: COMPLETE_THREE_D_SECURE_PAYMENT,
        method: HttpMethod.POST,
        data: completeData,
      });

      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        toast.error(response.data.message || "3DS payment completion failed");
        throw new Error(
          response.data.message || "3DS payment completion failed"
        );
      }

      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  return { completeThreeDSecurePayment, isPending };
};

export default useCompleteThreeDSecurePayment;
