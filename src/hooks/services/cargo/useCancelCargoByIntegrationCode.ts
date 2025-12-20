import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CANCEL_CARGO_BY_INTEGRATION_CODE } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

/**
 * Kargo iptal endpoint'i için mutation hook
 * Integration code ile kargo iptal etme işlemi için kullanılır
 */
export const useCancelCargoByIntegrationCode = () => {
  const mutation = useMyMutation<any>();

  const cancelCargo = async (integrationCode: string) => {
    try {
      // API sadece JSON string bekliyor (örn: "TX6195021007621")
      // Swagger'a göre request body formatı: "string" (JSON string)
      // Axios string gönderince JSON serialize etmiyor, bu yüzden manuel serialize ediyoruz
      const response = await mutation.mutateAsync({
        url: CANCEL_CARGO_BY_INTEGRATION_CODE,
        method: HttpMethod.POST,
        data: JSON.stringify(integrationCode), // JSON string formatında gönder
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Kargo başarıyla iptal edildi");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Kargo iptal edilirken bir hata oluştu";
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    cancelCargo,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
};
