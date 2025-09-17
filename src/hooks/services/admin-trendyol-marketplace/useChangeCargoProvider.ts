import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CHANGE_CARGO_PROVIDER } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { ChangeCargoProviderRequest } from "@/constants/models/trendyol/ChangeCargoProviderRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useChangeCargoProvider = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const changeCargoProvider = async (packageId: number, request: ChangeCargoProviderRequest) => {
    try {
      const response = await mutateAsync({
        url: CHANGE_CARGO_PROVIDER(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Kargo sağlayıcısı başarıyla değiştirildi");
        return response.data;
      } else {
        toast.error(response.data.message || "Kargo sağlayıcısı değiştirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Kargo sağlayıcısı değiştirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    changeCargoProvider,
    isPending,
  };
};