import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_CITIES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CityResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetTrendyolCities = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<CityResponse[]>>();

  const getTrendyolCities = async (countryCode: string) => {
    try {
      const response = await mutateAsync({
        url: GET_TRENDYOL_CITIES(countryCode),
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Şehirler getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Şehirler getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getTrendyolCities,
    isPending,
  };
};