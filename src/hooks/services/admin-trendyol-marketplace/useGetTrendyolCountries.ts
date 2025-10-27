import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_COUNTRIES } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { CountryResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetTrendyolCountries = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<CountryResponse[]>>();

  const getTrendyolCountries = async () => {
    try {
      const response = await mutateAsync({
        url: GET_TRENDYOL_COUNTRIES,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Ülkeler getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Ülkeler getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getTrendyolCountries,
    isPending,
  };
};