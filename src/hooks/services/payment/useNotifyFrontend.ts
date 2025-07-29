import { HttpMethod } from "@/constants/enums/HttpMethods";
import { NOTIFY_FRONTEND } from "@/constants/links";
import {
  NotifyFrontendRequest,
  PaymentResponse,
} from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useNotifyFrontend = () => {
  const { mutateAsync, isPending } = useMyMutation<PaymentResponse>();

  const notifyFrontend = async (notificationData: NotifyFrontendRequest) => {
    try {
      const response = await mutateAsync({
        url: NOTIFY_FRONTEND,
        method: HttpMethod.POST,
        data: notificationData,
      });
      return response;
    } catch (error) {
      console.error("Error during notify frontend:", error);
      throw error;
    }
  };

  return { notifyFrontend, isPending };
};

export default useNotifyFrontend;
