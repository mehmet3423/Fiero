import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_REVIEW } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteReview = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const queryClient = useQueryClient();

  const deleteReview = async (reviewId: string, productId: string) => {
    await mutateAsync(
      {
        url: `${DELETE_REVIEW}?id=${reviewId}`,
        method: HttpMethod.DELETE,
      },
      {
        onSuccess: () => {
          toast.success("Yorum başarıyla silindi");

          // İlgili ürünün yorumlarını invalidate et
          queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS, productId] });

          // Kullanıcının yorumlarını da invalidate et
          queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_REVIEWS] });
        },
        // onError kaldırıldı - useMyMutation zaten backend mesajını gösteriyor
      }
    );
  };

  return {
    deleteReview,
    isPending,
  };
};
