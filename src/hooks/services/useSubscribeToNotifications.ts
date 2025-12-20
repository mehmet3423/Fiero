import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SUBSCRIBE_TO_NOTIFICATIONS } from "@/constants/links";
import useMyMutation from "../useMyMutation";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

interface SubscribeToNotificationsParams {
  userMail: string;
  phoneNumber?: string;
  localeType: number; // 0 = Turkish, 1 = English
}

export const useSubscribeToNotifications = () => {
  const { mutateAsync, isPending } = useMyMutation();
  const { t } = useLanguage();

  const subscribe = async (
    params: SubscribeToNotificationsParams,
    onSuccess?: () => void
  ) => {
    const queryParams = new URLSearchParams({
      UserMail: params.userMail,
      LocaleType: params.localeType.toString(),
    });

    // PhoneNumber varsa ekle
    if (params.phoneNumber) {
      queryParams.append("PhoneNumber", params.phoneNumber);
    }

    await mutateAsync(
      {
        url: `${SUBSCRIBE_TO_NOTIFICATIONS}?${queryParams.toString()}`,
        method: HttpMethod.POST,
        showErrorToast: true,
      },
      {
        onSuccess: () => {
          toast.success(
            t("footer.subscribeSuccess") || "Successfully subscribed!"
          );
          onSuccess?.();
        },
      }
    );
  };

  return {
    subscribe,
    isPending,
  };
};
