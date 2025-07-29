import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_PAYMENT_DETAIL } from "@/constants/links";
import {
  GetPaymentDetailRequest,
  PaymentResponse,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useGetPaymentDetail = () => {
  const { mutateAsync, isPending } = useMyMutation<any>();

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
      return response;
    } catch (error) {
      console.error("Error during get payment detail:", error);
      throw error;
    }
  };

  return { getPaymentDetail, isPending };
};

export default useGetPaymentDetail;
