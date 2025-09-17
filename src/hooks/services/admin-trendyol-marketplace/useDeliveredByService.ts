import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELIVERED_BY_SERVICE } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useDeliveredByService = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const deliveredByService = async (packageId: number) => {
    try {
      const response = await mutateAsync({
        url: DELIVERED_BY_SERVICE(packageId),
        method: HttpMethod.PUT,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Paket yetkili servis tarafından teslim edildi olarak işaretlendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Paket yetkili servis teslimatı işaretlenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Paket yetkili servis teslimatı işaretlenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    deliveredByService,
    isPending,
  };
};