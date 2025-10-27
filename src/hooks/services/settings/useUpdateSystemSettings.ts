import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_SYSTEM_SETTINGS } from "@/constants/links";
import { UpdateSettingsRequest } from "@/constants/models/settings";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<any>();

  const updateSystemSettings = async (data: UpdateSettingsRequest) => {
    try {

      await mutateAsync(
        {
          url: UPDATE_SYSTEM_SETTINGS,
          method: HttpMethod.PUT,
          data: data,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.SYSTEM_SETTINGS],
            });
          },
        }
      );
    } catch (error) {
      // Error'ı yeniden throw et ki page component yakalayabilsin
      throw error;
    }
  };

  return { updateSystemSettings, isPending };
};
