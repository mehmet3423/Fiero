import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SPLIT_SHIPMENT_PACKAGE_MULTI_GROUP } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SplitShipmentPackageMultiGroupRequest } from "@/constants/models/trendyol/SplitShipmentPackageMultiGroupRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSplitShipmentPackageMultiGroup = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const splitShipmentPackageMultiGroup = async (packageId: number, request: SplitShipmentPackageMultiGroupRequest) => {
    try {
      const response = await mutateAsync({
        url: SPLIT_SHIPMENT_PACKAGE_MULTI_GROUP(packageId),
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/jso n",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Sipariş paketi çoklu gruplara başarıyla bölündü");
        return response.data;
      } else {
        toast.error(response.data.message || "Sipariş paketi çoklu gruplara bölünürken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Sipariş paketi çoklu gruplara bölünürken bir hata oluştu");
      throw error;
    }
  };

  return {
    splitShipmentPackageMultiGroup,
    isPending,
  };
};