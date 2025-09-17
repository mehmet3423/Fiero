import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_USER_CARD_LIST } from "@/constants/links";
import { UserPaymentCardListResponse } from "@/constants/models/PaymentCard";
import useGetData from "@/hooks/useGetData";

export interface UserPaymentCard {
  id: string;
  name: string;
}

export const useGetUserPaymentCards = () => {
  const { data, isLoading, error } = useGetData<UserPaymentCardListResponse>({
    url: GET_USER_CARD_LIST,
    queryKey: QueryKeys.USER_PAYMENT_CARD_LIST,
    method: HttpMethod.GET,
    onError(err) {
    },
  });

  return {
    userPaymentCards: data?.data || [],
    isLoading,
    error,
  };
};
