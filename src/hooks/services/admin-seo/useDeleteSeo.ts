import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELETE_SEO } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useDeleteSeo = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();

  const deleteSeo = async (id: string) => {
    const params = new URLSearchParams({
      Id: id,
    }).toString();

    try {
      await mutateAsync(
        {
          url: `${DELETE_SEO}?${params}`,
          method: HttpMethod.DELETE,
        },
        {
          onSuccess: () => {
            toast.success("SEO başarıyla silindi");
          },
        }
      );
    } catch (error) {
      toast.error("SEO silinirken bir hata oluştu");
    }
  };

  return {
    deleteSeo,
    isPending,
  };
};
