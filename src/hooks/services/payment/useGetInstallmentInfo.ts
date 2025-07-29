import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_INSTALLMENT_INFO } from "@/constants/links";
import {
  GetInstallmentInfoRequest,
  GetInstallmentInfoResponse,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useGetInstallmentInfo = () => {
  const { mutateAsync, isPending } =
    useMyMutation<GetInstallmentInfoResponse>();

  const getInstallmentInfo = async (
    installmentData: Omit<GetInstallmentInfoRequest, "locale">
  ) => {
    try {
      const params = new URLSearchParams({
        price: installmentData.price,
        userPaymentCardId: installmentData.userPaymentCardId,
        conversationId: installmentData.conversationId,
        locale: "0",
      });

      const response = await mutateAsync({
        url: `${GET_INSTALLMENT_INFO}?${params}`,
        method: HttpMethod.POST,
      });
      return response;
    } catch (error) {
      console.error("Error during get installment info:", error);
      throw error;
    }
  };

  return { getInstallmentInfo, isPending };
};

export default useGetInstallmentInfo;
