import { useState } from "react";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_SUPPORT_TICKET } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { toast } from "react-hot-toast";

interface GeneralSupportFormData {
  title: string;
  requestType: number;
  description: string;
  imageUrl: string;
}

export const useGeneralSupport = () => {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMyMutation();

  const handleSubmitTicket = async (formData: GeneralSupportFormData) => {
    setIsPending(true);

    try {
      // Query parametreleri olarak URL'e ekle
      const queryParams = new URLSearchParams({
        RequestType: formData.requestType.toString(),
        Title: formData.title,
        Description: formData.description,
      });

      // ImageUrl sadece varsa ekle
      if (formData.imageUrl) {
        queryParams.append("ImageUrl", formData.imageUrl);
      }

      const response = await mutation.mutateAsync({
        url: `${CREATE_SUPPORT_TICKET}?${queryParams.toString()}`,
        method: HttpMethod.POST,
        // Body boş bırakıyoruz çünkü tüm veriler query string'de
      });

      toast.success("Destek talebiniz başarıyla oluşturuldu.");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => toast.error(`${field}: ${msg}`));
            }
          }
        );
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    handleSubmitTicket,
    isPending: isPending || mutation.isPending,
  };
};
