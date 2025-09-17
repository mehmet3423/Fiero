import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_DOMESTIC_TR_NEIGHBORHOODS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { NeighborhoodResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetDomesticTRNeighborhoods = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<NeighborhoodResponse[]>>();

  const getDomesticTRNeighborhoods = async (cityId: number, districtId: number) => {
    try {
      const response = await mutateAsync({
        url: GET_DOMESTIC_TR_NEIGHBORHOODS(cityId, districtId),
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Türkiye mahalleleri getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Türkiye mahalleleri getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getDomesticTRNeighborhoods,
    isPending,
  };
};