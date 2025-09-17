import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { APPROVE_COMMENT } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useApproveComment = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const queryClient = useQueryClient();

  const approveComment = async (commentId: string) => {
    try {
      await mutateAsync(
        {
          url: `${APPROVE_COMMENT}?commentId=${commentId}`,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            toast.success("Yorum onaylandı");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.COMMENT_LIST],
            });
          },
          onError: () => {
            toast.error("Yorum onaylanırken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      console.error("Approve comment error:", error);
      toast.error("Yorum onaylanırken bir hata oluştu");
    }
  };
  return { approveComment, isPending };
};
