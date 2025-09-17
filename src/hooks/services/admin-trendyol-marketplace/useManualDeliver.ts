import { HttpMethod } from "@/constants/enums/HttpMethods";
import { MANUAL_DELIVER } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useManualDeliver = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const manualDeliver = async (cargoTrackingNumber: string) => {
    try {
      const response = await mutateAsync({
        url: MANUAL_DELIVER(cargoTrackingNumber),
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Manuel teslimat başarıyla tamamlandı");
        return response.data;
      } else {
        toast.error(response.data.message || "Manuel teslimat tamamlanırken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Manuel teslimat tamamlanırken bir hata oluştu");
      throw error;
    }
  };

  return {
    manualDeliver,
    isPending,
  };
};