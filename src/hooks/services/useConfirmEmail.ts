import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CONFIRM_EMAIL } from "@/constants/links";
import toast from "react-hot-toast";
import useMyMutation from "../useMyMutation";

interface ConfirmEmailResponse {
  isSucceed: boolean;
  message: string;
}

export const useConfirmEmail = () => {
  const { mutateAsync, isPending } = useMyMutation<ConfirmEmailResponse>();

  const handleConfirmEmail = async (
    userId: string,
    token: string,
    onComplete?: (isSuccess: boolean) => void
  ) => {
    const params = new URLSearchParams({
      userId: userId,
      token: token,
    }).toString();

    try {
      await mutateAsync(
        {
          url: `${CONFIRM_EMAIL}?${params}`,
          method: HttpMethod.GET,
        },
        {
          onSuccess: (res) => {
            // Check if response has isSucceed property
            if (res.data && typeof res.data.isSucceed === "boolean") {
              if (res.data.isSucceed) {
                toast.success("E-posta adresiniz başarıyla onaylandı!");
                onComplete?.(true);
              } else {
                console.error(
                  "Email confirmation failed - isSucceed false:",
                  res.data
                );
                toast.error(res.data?.message || "E-posta onayı başarısız!");
                onComplete?.(false);
              }
            } else {
              // Backend doesn't use isSucceed field, check by HTTP status and message
              toast.success("E-posta adresiniz başarıyla onaylandı!");
              onComplete?.(true);
            }
          },
          onError: (error) => {
            // Sadece backend mesajını göster
            const errorMessage =
              error.response?.data?.detail || error.response?.data?.message;
            if (errorMessage) {
              toast.error(errorMessage);
            }
            onComplete?.(false);
          },
        }
      );
    } catch (error) {
      console.error("Email confirmation catch error:", error);
      onComplete?.(false);
    }
  };

  return {
    handleConfirmEmail,
    isPending,
  };
};
