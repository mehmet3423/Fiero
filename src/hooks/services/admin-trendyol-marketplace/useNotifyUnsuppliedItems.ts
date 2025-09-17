import { HttpMethod } from "@/constants/enums/HttpMethods";
import { NOTIFY_UNSUPPLIED_ITEMS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { NotifyUnsuppliedItemsRequest } from "@/constants/models/trendyol/NotifyUnsuppliedItemsRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useNotifyUnsuppliedItems = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const notifyUnsuppliedItems = async (packageId: number, request: NotifyUnsuppliedItemsRequest): Promise<CommandResult> => {
    try {
      const response = await mutateAsync({
        url: NOTIFY_UNSUPPLIED_ITEMS(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
        showErrorToast: false, // Disable automatic error toast
      });

      return response.data;
    } catch (error: any) {
      return {
        isSucceed: false,
        message: error.response?.data?.message || error.message || "Tedarik edememe bildirimi gönderilirken bir hata oluştu"
      };
    }
  };

  return {
    notifyUnsuppliedItems,
    isPending,
  };
};