import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_SYSTEM_SETTINGS } from "@/constants/links";
import { UpdateSettingsRequest } from "@/constants/models/settings";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<any>();

  const updateSystemSettings = async (data: UpdateSettingsRequest) => {
    try {
      console.log("Sending update request:", data);

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
          onError: () => {
            toast.error("Sistem ayarları güncellenirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      console.error("Error updating system settings:", error);
      toast.error("Sistem ayarları güncellenirken bir hata oluştu");
    }
  };

  return { updateSystemSettings, isPending };
};
