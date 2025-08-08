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
      const params = new URLSearchParams();
      params.append("Id", id);
      params.append("Name", name);
      params.append("DisplayIndex", displayIndex.toString());

      if (imageUrl) {
        params.append("ImageUrl", imageUrl);
      }

      await mutateAsync(
        {
          url: `${UPDATE_SUB_CATEGORY}?${params.toString()}`,
          method: HttpMethod.PUT,
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
