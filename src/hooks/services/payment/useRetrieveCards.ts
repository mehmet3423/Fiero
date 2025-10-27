import { HttpMethod } from "@/constants/enums/HttpMethods";
import { RETRIEVE_CARDS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { RetrieveCardsRequest, RetrieveCardsResponse } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useRetrieveCards = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<RetrieveCardsResponse>>();

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

      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        toast.error(response.data.message || "Failed to retrieve cards");
        throw new Error(response.data.message || "Failed to retrieve cards");
      }

      toast.success("Cards retrieved successfully");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { retrieveCards, isPending };
};

export default useRetrieveCards;
