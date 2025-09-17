import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELETE_SEO } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useDeleteSeo = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const deleteSeo = async (id: string) => {
    const params = new URLSearchParams({
      Id: id,
    }).toString();

    try {
      const response = await mutateAsync(
        {
          url: `${DELETE_SEO}?${params}`,
          method: HttpMethod.DELETE,
        }
      );

      // Check if the response is successful according to CommandResult structure
      if (response.data.isSucceed) {
        toast.success(response.data.message || "SEO başarıyla silindi");
      } else {
        toast.error(response.data.message || "SEO silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("SEO silinirken bir hata oluştu");
    }
  };

  return {
    deleteSeo,
    isPending,
  };
};
