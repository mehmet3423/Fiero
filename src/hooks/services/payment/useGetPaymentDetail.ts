import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_PAYMENT_DETAIL } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import {
  GetPaymentDetailRequest,
  PaymentDetailResponseData,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetPaymentDetail = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<PaymentDetailResponseData>>();

  const getPaymentDetail = async (
    paymentDetailData: Omit<GetPaymentDetailRequest, "locale">
  ) => {
    try {
      const response = await mutateAsync({
        url: GET_PAYMENT_DETAIL,
        method: HttpMethod.POST,
        data: {
          ...paymentDetailData,
          locale: 0,
        },
      });

      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        toast.error(response.data.message || "Failed to get payment detail");
        throw new Error(response.data.message || "Failed to get payment detail");
      }

      toast.success("Payment detail retrieved successfully");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { getPaymentDetail, isPending };
};

export default useGetPaymentDetail;
