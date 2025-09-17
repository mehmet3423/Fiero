import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SPLIT_SHIPMENT_PACKAGE_BY_QUANTITY } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SplitShipmentPackageByQuantityRequest } from "@/constants/models/trendyol/SplitShipmentPackageByQuantityRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSplitShipmentPackageByQuantity = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const splitShipmentPackageByQuantity = async (packageId: number, request: SplitShipmentPackageByQuantityRequest) => {
    try {
      const response = await mutateAsync({
        url: SPLIT_SHIPMENT_PACKAGE_BY_QUANTITY(packageId),
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
        showErrorToast: false, // Hata mesajını burada handle ediyoruz
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Sipariş paketi miktara göre başarıyla bölündü");
        return response.data;
      } else {
        toast.error(response.data.message || "Sipariş paketi miktara göre bölünürken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      // Backend'den gelen hata mesajını göster
      const errorMessage = error.response?.data?.message || error.message || "Sipariş paketi miktara göre bölünürken bir hata oluştu";
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    splitShipmentPackageByQuantity,
    isPending,
  };
};