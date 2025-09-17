import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_BRAND_BY_NAME } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

// Brand response tipini tanımlayın
export interface TrendyolBrand {
  id: number;
  name: string;
  // Diğer brand alanları...
}

export const useGetBrandByName = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<TrendyolBrand[]>>();

  const getBrandByName = async (brandName: string) => {
    try {
      const response = await mutateAsync({
        url: `${GET_TRENDYOL_BRAND_BY_NAME}?brandName=${encodeURIComponent(brandName)}`,
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Trendyol marka listesi getirilemedi");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Trendyol marka listesi getirilemedi");
      throw error;
    }
  };

  return {
    getBrandByName,
    isPending,
  };
};