import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SYSTEM_SETTINGS } from "@/constants/links";
import { CreateSettingsRequest } from "@/constants/models/settings";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateSystemSetting = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<any>();

  const createSystemSetting = async (data: CreateSettingsRequest) => {
    try {
      await mutateAsync(
        {
          url: GET_SYSTEM_SETTINGS,
          method: HttpMethod.POST,
          data: data,
        },
        {
          onSuccess: () => {
            toast.success("Yeni sistem ayarı başarıyla oluşturuldu");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.SYSTEM_SETTINGS],
            });
          },
          onError: () => {
            toast.error("Sistem ayarı oluşturulurken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      console.error("Error creating system setting:", error);
      toast.error("Sistem ayarı oluşturulurken bir hata oluştu");
    }
  };

  return { createSystemSetting, isPending };
};
