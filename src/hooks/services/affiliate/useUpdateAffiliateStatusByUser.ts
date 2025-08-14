import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_AFFILIATE_STATUS_BY_USER } from "@/constants/links";
import { UpdateAffiliateStatusByUserRequest } from "@/constants/models/Affiliate";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

export const useUpdateAffiliateStatusByUser = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<string>();

  const updateStatusByUser = async (
    statusData: UpdateAffiliateStatusByUserRequest
  ) => {
    try {
      await mutateAsync(
        {
          url: UPDATE_AFFILIATE_STATUS_BY_USER,
          data: statusData,
          method: HttpMethod.PUT,
        },
        {
          onSuccess: () => {
            toast.success(t("updateSuccess"));
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.AFFILIATE_COLLECTIONS],
            });
          },
          onError: (error: any) => {
            console.error("Collection update error:", error);
            toast.error(
              t("updateError")
            );
          },
        }
      );
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  };

  return {
    updateStatusByUser,
    isPending,
  };
};
