import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_SUB_CATEGORY } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateSubCategory = async (
    id: string,
    name: string,
    displayIndex: number,
    imageUrl?: string
  ) => {
    try {
      // Request body oluştur
      const requestBody: {
        id: string;
        name: string;
        displayIndex: number;
        imageUrl?: string;
      } = {
        id: id,
        name: name,
        displayIndex: displayIndex,
      };

      if (imageUrl) {
        requestBody.imageUrl = imageUrl;
      }

      await mutateAsync(
        {
          url: UPDATE_SUB_CATEGORY,
          method: HttpMethod.PUT,
          data: requestBody,
        },
        {
          onSuccess: () => {
            toast.success("Alt kategori başarıyla güncellendi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.MAIN_CATEGORY_LIST],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Alt kategori güncellenirken bir hata oluştu");
    }
  };

  return {
    updateSubCategory,
    isPending,
  };
};
