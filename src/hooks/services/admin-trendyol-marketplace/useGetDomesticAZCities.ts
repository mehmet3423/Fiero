import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_DOMESTIC_AZ_CITIES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CityResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetDomesticAZCities = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<CityResponse[]>>();

  const getDomesticAZCities = async () => {
    try {
      const response = await mutateAsync({
        url: GET_DOMESTIC_AZ_CITIES,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Azerbaycan şehirleri getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Azerbaycan şehirleri getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getDomesticAZCities,
    isPending,
  };
};