import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_SHIPMENT_PACKAGE_STATUS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { UpdateShipmentPackageStatusRequest } from "@/constants/models/trendyol/UpdateShipmentPackageStatusRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateShipmentPackageStatus = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const updateShipmentPackageStatus = async (packageId: number, request: UpdateShipmentPackageStatusRequest) => {
    try {
      const response = await mutateAsync({
        url: UPDATE_SHIPMENT_PACKAGE_STATUS(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Sipariş paketi durumu başarıyla güncellendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Sipariş paketi durumu güncellenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Sipariş paketi durumu güncellenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    updateShipmentPackageStatus,
    isPending,
  };
};