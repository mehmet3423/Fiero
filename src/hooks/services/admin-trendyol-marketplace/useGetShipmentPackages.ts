import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_SHIPMENT_PACKAGES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { GetShipmentPackagesRequest, GetShipmentPackagesResponse } from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetShipmentPackages = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<GetShipmentPackagesResponse>>();

  const getShipmentPackages = async (request: GetShipmentPackagesRequest) => {
    try {
      const response = await mutateAsync({
        url: GET_SHIPMENT_PACKAGES,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Sipariş paketleri getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Sipariş paketleri getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getShipmentPackages,
    isPending,
  };
};