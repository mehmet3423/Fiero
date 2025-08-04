import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_MAIN_CATEGORY } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateMainCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateMainCategory = async (
    id: string,
    name: string,
    displayIndex: number
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("Id", id);
      params.append("Name", name);
      params.append("DisplayIndex", displayIndex.toString());
      await mutateAsync(
        {
          url: `${UPDATE_MAIN_CATEGORY}?${params.toString()}`,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success("Ana kategori başarıyla güncellendi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.MAIN_CATEGORY_LIST],
            });
          },
        }
      );
    } catch (error) {
      toast.error("Ana kategori güncellenirken bir hata oluştu");
    }
  };

  return {
    updateMainCategory,
    isPending,
  };
};
