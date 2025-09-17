import { HttpMethod } from "@/constants/enums/HttpMethods";
import { PROCESS_ALTERNATIVE_DELIVERY } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { ProcessAlternativeDeliveryRequest } from "@/constants/models/trendyol/ProcessAlternativeDeliveryRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useProcessAlternativeDelivery = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const processAlternativeDelivery = async (packageId: number, request: ProcessAlternativeDeliveryRequest) => {
    try {
      const response = await mutateAsync({
        url: PROCESS_ALTERNATIVE_DELIVERY(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Alternatif teslimat başarıyla işlendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Alternatif teslimat işlenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Alternatif teslimat işlenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    processAlternativeDelivery,
    isPending,
  };
};