import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_AWAITING_SHIPMENT_PACKAGES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { GetShipmentPackagesRequest, GetShipmentPackagesResponse } from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetAwaitingShipmentPackages = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<GetShipmentPackagesResponse>>();

  const getAwaitingShipmentPackages = async (request: GetShipmentPackagesRequest) => {
    try {
      const response = await mutateAsync({
        url: GET_AWAITING_SHIPMENT_PACKAGES,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Bekleyen sipariş paketleri getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Bekleyen sipariş paketleri getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getAwaitingShipmentPackages,
    isPending,
  };
};