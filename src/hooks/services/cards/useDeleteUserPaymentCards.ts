import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_USER_CARD } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteUserPaymentCards = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const deleteUserPaymentCard = async (id: string) => {
    try {
      await mutateAsync(
        {
          url: `${DELETE_USER_CARD}`,
          data: { id },
          method: HttpMethod.DELETE,
        },
        {
          onSuccess: () => {
            toast.success("Kart başarıyla silindi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.USER_PAYMENT_CARD_LIST],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Kart silinirken bir hata oluştu");
    }
  };

  return {
    deleteUserPaymentCard,
    isPending,
  };
};
