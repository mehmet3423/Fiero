import { HttpMethod } from "@/constants/enums/HttpMethods";
import { MANUAL_RETURN } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useManualReturn = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const manualReturn = async (cargoTrackingNumber: string) => {
    try {
      const response = await mutateAsync({
        url: MANUAL_RETURN(cargoTrackingNumber),
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Manuel iade başarıyla tamamlandı");
        return response.data;
      } else {
        toast.error(response.data.message || "Manuel iade tamamlanırken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Manuel iade tamamlanırken bir hata oluştu");
      throw error;
    }
  };

  return {
    manualReturn,
    isPending,
  };
};