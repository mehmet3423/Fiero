import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_DISTRICTS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { DistrictResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetTrendyolDistricts = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<DistrictResponse[]>>();

  const getTrendyolDistricts = async (countryCode: string, cityId: number) => {
    try {
      const response = await mutateAsync({
        url: GET_TRENDYOL_DISTRICTS(countryCode, cityId),
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "İlçeler getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("İlçeler getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getTrendyolDistricts,
    isPending,
  };
};