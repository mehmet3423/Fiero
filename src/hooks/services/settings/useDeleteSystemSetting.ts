import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_SYSTEM_SETTING } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { HttpMethod } from "@/constants/enums/HttpMethods";

export const useDeleteSystemSetting = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<void>();

  const deleteSystemSetting = async (id: string) => {
    await mutateAsync(
      {
        url: DELETE_SYSTEM_SETTING,
        method: HttpMethod.DELETE,
        data: { id },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.SYSTEM_SETTINGS],
          });
        },
      }
    );
  };

  return { deleteSystemSetting, isPending };
};
