import { HttpMethod } from "@/constants/enums/HttpMethods";
import { EXTEND_AGREED_DELIVERY_DATE } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { ExtendAgreedDeliveryDateRequest } from "@/constants/models/trendyol/ExtendAgreedDeliveryDateRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useExtendAgreedDeliveryDate = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const extendAgreedDeliveryDate = async (packageId: number, request: ExtendAgreedDeliveryDateRequest) => {
    try {
      const response = await mutateAsync({
        url: EXTEND_AGREED_DELIVERY_DATE(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Teslimat tarihi başarıyla uzatıldı");
        return response.data;
      } else {
        toast.error(response.data.message || "Teslimat tarihi uzatılırken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Teslimat tarihi uzatılırken bir hata oluştu");
      throw error;
    }
  };

  return {
    extendAgreedDeliveryDate,
    isPending,
  };
};