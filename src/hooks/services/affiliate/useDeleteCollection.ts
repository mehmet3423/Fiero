import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELETE_AFFILIATE_COLLECTION } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<void>();

  const deleteCollection = async (collectionId: string) => {
    try {
      await mutateAsync(
        {
          url: DELETE_AFFILIATE_COLLECTION,
          method: HttpMethod.DELETE,
          data: { id: collectionId }, // 🧠 Body içinde ID gönderiyoruz
        },
        {
          onSuccess: () => {
            toast.success("Koleksiyon başarıyla silindi.");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.AFFILIATE_COLLECTIONS],
            });
          },
          onError: () => {
            toast.error("Koleksiyon silinirken hata oluştu.");
          },
        }
      );
    } catch (error) {
      console.error("Koleksiyon silme hatası:", error);
    }
  };

  return {
    deleteCollection,
    isPending,
  };
};
