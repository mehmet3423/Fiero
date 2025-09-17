import { HttpMethod } from "@/constants/enums/HttpMethods";
import { NOTIFY_FRONTEND } from "@/constants/links";
import { NotifyFrontendRequest } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useNotifyFrontend = () => {
  const { mutateAsync, isPending } = useMyMutation<void>();

  const notifyFrontend = async (notificationData: NotifyFrontendRequest) => {
    try {
      await mutateAsync({
        url: NOTIFY_FRONTEND,
        method: HttpMethod.POST,
        data: notificationData,
      });

      toast.success("Frontend notification sent successfully");
    } catch (error) {
      toast.error("Failed to send frontend notification");
      throw error;
    }
  };

  return { notifyFrontend, isPending };
};

export default useNotifyFrontend;
