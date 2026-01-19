import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys"; // QueryKeys import ediyorum
import { UPDATE_REVIEW } from "@/constants/links"; // Update review link
import { DtoReview } from "@/constants/models/Review";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query"; // QueryClient import ediyorum
import toast from "react-hot-toast";

export const useUpdateReview = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const queryClient = useQueryClient(); // QueryClient'ı ekliyorum

  const updateReview = async (review: DtoReview) => {
    const params = new URLSearchParams({
      Id: review.id,
      Title: review.title,
      Content: review.content,
      Rating: review.rating.toString(),
      ImageUrl: review.imageUrl || "",
      ProductId: review.productId,
      ReviewId: review.id,
    }).toString();

    await mutateAsync(
      {
        url: `${UPDATE_REVIEW}?${params}`,
        method: HttpMethod.PUT,
      },
      {
        onSuccess: () => {
          toast.success("Yorum başarıyla güncellendi");

          // İlgili ürünün yorumlarını invalidate et
          queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS, review.productId] });

          // Kullanıcının yorumlarını da invalidate et
          queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_REVIEWS] });
        },
        // onError kaldırıldı - useMyMutation zaten backend mesajını gösteriyor
      }
    );
  };

  return {
    updateReview,
    isPending,
  };
};
