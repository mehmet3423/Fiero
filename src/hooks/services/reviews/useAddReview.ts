import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys"; // QueryKeys import ediyorum
import { ADD_REVIEW } from "@/constants/links"; // Yorum ekleme linki
import { DtoReview } from "@/constants/models/Review";
import useMyMutation from "@/hooks/useMyMutation"; // Custom mutation hook
import { useQueryClient } from "@tanstack/react-query"; // QueryClient import ediyorum
import toast from "react-hot-toast";

export const useAddReview = () => {
  const queryClient = useQueryClient(); // QueryClient'ı ekliyorum
  const { mutateAsync, isPending } = useMyMutation<string>(); // Geriye string dönecek şekilde tip verdim

  const addReview = async (review: DtoReview) => {
    try {
      // URLSearchParams kullanılarak parametreler oluşturuluyor
      const params = new URLSearchParams();

      // Required parameters
      params.append("Title", review.title);
      params.append("Content", review.content);

      // Optional parameters
      if (review.rating !== undefined) {
        params.append("Rating", review.rating.toString());
      }
      if (review.imageUrl) {
        params.append("ImageUrl", review.imageUrl);
      }
      if (review.productId) {
        params.append("ProductId", review.productId);
      }

      // Mutasyon işlemi
      await mutateAsync(
        {
          url: `${ADD_REVIEW}?${params.toString()}`, // Parametrelerin URL'ye eklenmesi.
          method: HttpMethod.POST, // HTTP POST yöntemi
        },
        {
          onSuccess: () => {
            toast.success("Yorum başarıyla eklendi"); // Başarı durumunda toast

            // İlgili ürünün yorumlarını invalidate et
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.REVIEWS, review.productId],
            });
          },
          onError: () => {
            toast.error("Yorum eklenirken bir hata oluştu"); // Hata durumunda toast
          },
        }
      );
    } catch (error) {
      toast.error("Yorum eklenirken bir hata oluştu"); // Hata toast'ı
    }
  };

  return {
    addReview,
    isPending,
  };
};
