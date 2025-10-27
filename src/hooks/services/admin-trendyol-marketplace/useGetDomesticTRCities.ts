import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_DOMESTIC_TR_CITIES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CityResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetDomesticTRCities = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<CityResponse[]>>();

  const getDomesticTRCities = async () => {
    try {
      const response = await mutateAsync({
        url: GET_DOMESTIC_TR_CITIES,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Türkiye şehirleri getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Türkiye şehirleri getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getDomesticTRCities,
    isPending,
  };
};