import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_BASE_PRODUCT } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteBaseProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const deleteBaseProduct = async (id: string) => {
    try {
      await mutateAsync(
        {
          url: DELETE_BASE_PRODUCT,
          method: HttpMethod.DELETE,
          data: { id },
        },
        {
          onSuccess: () => {
            toast.success("Base product başarıyla silindi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASE_PRODUCTS],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASE_PRODUCT_BY_ID, id],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASE_PRODUCT_VARIANTS, id],
            });
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.BASIC_PRODUCT_LIST],
            });
          },
          onError: () => {
            toast.error("Base product silinirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      throw error;
    }
  };

  return {
    deleteBaseProduct,
    isPending,
  };
};

