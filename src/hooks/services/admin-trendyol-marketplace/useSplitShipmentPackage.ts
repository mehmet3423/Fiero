import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SPLIT_SHIPMENT_PACKAGE } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SplitShipmentPackageRequest } from "@/constants/models/trendyol/SplitShipmentPackageRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSplitShipmentPackage = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const splitShipmentPackage = async (packageId: number, request: SplitShipmentPackageRequest) => {
    try {
      const response = await mutateAsync({
        url: SPLIT_SHIPMENT_PACKAGE(packageId),
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
        showErrorToast: false, // Hata mesajını burada handle ediyoruz
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Sipariş paketi başarıyla bölündü");
        return response.data;
      } else {
        toast.error(response.data.message || "Sipariş paketi bölünürken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      // Backend'den gelen hata mesajını göster
      const errorMessage = error.response?.data?.message || error.message || "Sipariş paketi bölünürken bir hata oluştu";
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    splitShipmentPackage,
    isPending,
  };
};