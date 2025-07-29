import { useState } from "react";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_SUPPORT_TICKET } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { toast } from "react-hot-toast";

interface GeneralSupportFormData {
  title: string;
  requestType: number;
  description: string;
  attachments: File[];
}

export const useGeneralSupport = () => {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMyMutation();

  const handleSubmitTicket = async (formData: GeneralSupportFormData) => {
    setIsPending(true);
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append("Title", formData.title);
      formDataToSend.append("RequestType", formData.requestType.toString());
      formDataToSend.append("Description", formData.description);
      
      // Dosyaları ekle
      if (formData.attachments.length > 0) {
        formData.attachments.forEach((file) => {
          formDataToSend.append("Attachments", file.name);
        });
      }

      const response = await mutation.mutateAsync({
        url: CREATE_SUPPORT_TICKET+"?"+formDataToSend,
        method: HttpMethod.POST,
        data: formDataToSend,
        headers: {  
        }
      });

      toast.success("Destek talebiniz başarıyla oluşturuldu.");
      
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data
      });
      
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => toast.error(`${field}: ${msg}`));
          }
        });
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return { 
    handleSubmitTicket, 
    isPending: isPending || mutation.isPending 
  };
};