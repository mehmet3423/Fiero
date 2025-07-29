import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_AFFILIATE_COLLECTION } from "@/constants/links";
import { UpdateAffiliateCollectionRequest } from "@/constants/models/Affiliate";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateAffiliateCollection = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateCollection = async (
    collectionData: UpdateAffiliateCollectionRequest
  ) => {
    try {
      await mutateAsync(
        {
          url: UPDATE_AFFILIATE_COLLECTION,
          data: collectionData,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Koleksiyon başarıyla güncellendi!");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.AFFILIATE_COLLECTIONS],
            });
          },
          onError: (error: any) => {
            console.error("Collection update error:", error);
            toast.error(
              "Koleksiyon güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
            );
          },
        }
      );
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  };

  return {
    updateCollection,
    isPending,
  };
};
