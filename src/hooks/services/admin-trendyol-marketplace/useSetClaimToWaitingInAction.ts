import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SET_CLAIM_TO_WAITING_IN_ACTION } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SetClaimToWaitingInActionRequest } from "@/constants/models/trendyol/SetClaimToWaitingInActionRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSetClaimToWaitingInAction = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const setClaimToWaitingInAction = async (request: SetClaimToWaitingInActionRequest) => {
    try {
      const response = await mutateAsync({
        url: SET_CLAIM_TO_WAITING_IN_ACTION,
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Şikayet bekleme durumuna başarıyla alındı");
        return response.data;
      } else {
        toast.error(response.data.message || "Şikayet bekleme durumuna alınırken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Şikayet bekleme durumuna alınırken bir hata oluştu");
      throw error;
    }
  };

  return {
    setClaimToWaitingInAction,
    isPending,
  };
};