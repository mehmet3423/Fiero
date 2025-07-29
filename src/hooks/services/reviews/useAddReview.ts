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
      const params = new URLSearchParams({
        Id: review.id,
        Title: review.title,
        Content: review.content,
        Rating: review.rating.toString(),
        ImageUrl: review.imageUrl || "", // Eğer resim yoksa boş bırakılabilir
        ProductId: review.productId,
        CustomerId: review.customerId,
        CustomerName: review.customerName,
        ModifiedValue: review.modifiedValue,
      }).toString(); // Parametreleri URL'ye uygun hale getiriyor

      // Mutasyon işlemi
      await mutateAsync(
        {
          url: `${ADD_REVIEW}?${params}`, // Parametrelerin URL'ye eklenmesi.
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
      console.error("Add review error:", error); // Hata loglama
      toast.error("Yorum eklenirken bir hata oluştu"); // Hata toast'ı
    }
  };

  return {
    addReview,
    isPending,
  };
};
