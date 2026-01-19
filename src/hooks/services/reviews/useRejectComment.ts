import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { REJECT_COMMENT } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRejectComment = () => {
  const { mutateAsync, isPending } = useMyMutation<string>();
  const queryClient = useQueryClient();

  const rejectComment = async (commentId: string) => {
    await mutateAsync(
      {
        url: `${REJECT_COMMENT}?commentId=${commentId}`,
        method: HttpMethod.POST,
      },
      {
        onSuccess: () => {
          toast.success("Yorum reddedildi");
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.COMMENT_LIST],
          });
        },
        // onError kaldırıldı - useMyMutation zaten backend mesajını gösteriyor
      }
    );
  };
  return { rejectComment, isPending };
};
