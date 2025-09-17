import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_INSTALLMENT_INFO } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import {
  GetInstallmentInfoRequest,
  InstallmentInfoResponseData,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetInstallmentInfo = () => {
  const { mutateAsync, isPending } =
    useMyMutation<CommandResultWithData<InstallmentInfoResponseData>>();

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

      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        toast.error(response.data.message || "Failed to get installment info");
        throw new Error(response.data.message || "Failed to get installment info");
      }

      toast.success("Installment info retrieved successfully");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { getInstallmentInfo, isPending };
};

export default useGetInstallmentInfo;
