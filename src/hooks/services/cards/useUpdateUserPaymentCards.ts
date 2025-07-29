import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_USER_CARD } from "@/constants/links";
import { UserPaymentCard } from "@/constants/models/PaymentCard";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateUserPaymentCards = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateUserPaymentCard = async (card: UserPaymentCard) => {
    try {
      await mutateAsync(
        {
          url: `${UPDATE_USER_CARD}`,
          data: card,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Kart başarıyla güncellendi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.USER_PAYMENT_CARD_LIST],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Kart güncellenirken bir hata oluştu");
    }
  };

  return {
    updateUserPaymentCard,
    isPending,
  };
};
