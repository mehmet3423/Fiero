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
                toast.error(res.data?.message || "E-posta onayı başarısız!");
                onComplete?.(false);
              }
            } else {
              toast.success("E-posta adresiniz başarıyla onaylandı!");
              onComplete?.(true);
            }
          },
          onError: (error) => {
            toast.error(
              error.response?.data?.detail ||
              error.response?.data?.message ||
              "E-posta onayı sırasında bir hata oluştu!"
            );
            onComplete?.(false);
          },
        }
      );
    } catch (error) {
      onComplete?.(false);
    }
  };

  return {
    handleConfirmEmail,
    isPending,
  };
};
