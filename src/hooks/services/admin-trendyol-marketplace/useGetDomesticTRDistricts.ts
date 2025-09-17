import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_DOMESTIC_TR_DISTRICTS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { DistrictResponse } from "@/constants/models/trendyol/LocationResponses";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetDomesticTRDistricts = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<DistrictResponse[]>>();

  const getDomesticTRDistricts = async (cityId: number) => {
    try {
      const response = await mutateAsync({
        url: GET_DOMESTIC_TR_DISTRICTS(cityId),
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Türkiye ilçeleri getirilirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Türkiye ilçeleri getirilirken bir hata oluştu");
      throw error;
    }
  };

  return {
    getDomesticTRDistricts,
    isPending,
  };
};