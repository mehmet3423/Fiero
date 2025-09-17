import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SEND_EMAIL } from "@/constants/links";
import toast from "react-hot-toast";
import useMyMutation from "../useMyMutation";

interface SendEmailConfirmationResponse {
  isSucceed: boolean;
  message: string;
}

export const useSendEmailConfirmation = () => {
  const { mutateAsync, isPending } =
    useMyMutation<SendEmailConfirmationResponse>();

  const handleSendEmailConfirmation = async (
    email: string,
    onSuccess?: () => void
  ) => {
    const params = new URLSearchParams({
      email: email,
    }).toString();

    await mutateAsync(
      {
        url: `${SEND_EMAIL}?${params}`,
        method: HttpMethod.POST,
      },
      {
        onSuccess: (res) => {

          // Check if response has isSucceed property
          if (res.data && typeof res.data.isSucceed === "boolean") {
            if (res.data.isSucceed) {
              toast.success("Onay e-postası başarıyla gönderildi!");
              onSuccess?.();
            } else {
              toast.error(res.data.message || "E-posta gönderilemedi!");
            }
          } else {
            // Some APIs just return 200 without isSucceed property
            toast.success("Onay e-postası başarıyla gönderildi!");
            onSuccess?.();
          }
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
            "E-posta gönderilirken bir hata oluştu!"
          );
        },
      }
    );
  };

  return {
    handleSendEmailConfirmation,
    isPending,
  };
};
