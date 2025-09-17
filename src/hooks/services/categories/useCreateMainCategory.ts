import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_MAIN_CATEGORY } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateMainCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const createMainCategory = async (
    name: string,
    displayIndex?: number,
    imageUrl?: string
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("Name", name);

      if (displayIndex !== undefined) {
        params.append("DisplayIndex", displayIndex.toString());
      }

      if (imageUrl) {
        params.append("ImageUrl", imageUrl);
      }

      await mutateAsync(
        {
          url: `${CREATE_MAIN_CATEGORY}?${params.toString()}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Ana kategori başarıyla oluşturuldu");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.MAIN_CATEGORY_LIST],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Ana kategori oluşturulurken bir hata oluştu");
    }
  };

  return {
    createMainCategory,
    isPending,
  };
};