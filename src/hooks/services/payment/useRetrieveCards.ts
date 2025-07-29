import { HttpMethod } from "@/constants/enums/HttpMethods";
import { RETRIEVE_CARDS } from "@/constants/links";
import { RetrieveCardsRequest } from "@/constants/models/Payment";
import { UserPaymentCard } from "@/constants/models/PaymentCard";
import useMyMutation from "@/hooks/useMyMutation";

export const useRetrieveCards = () => {
  const { mutateAsync, isPending } = useMyMutation<UserPaymentCard[]>();

  const retrieveCards = async (
    cardData: Omit<RetrieveCardsRequest, "locale">
  ) => {
    try {
      const response = await mutateAsync({
        url: RETRIEVE_CARDS,
        method: HttpMethod.POST,
        data: {
          ...cardData,
          locale: 0,
        },
      });
      return response;
    } catch (error) {
      console.error("Error during retrieve cards:", error);
      throw error;
    }
  };

  return { retrieveCards, isPending };
};

export default useRetrieveCards;
