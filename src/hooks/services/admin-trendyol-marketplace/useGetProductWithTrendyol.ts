import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_PRODUCT_WITH_TRENDYOL } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { ProductWithTrendyolResponse } from "@/constants/models/trendyol/ProductWithTrendyolResponse";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetProductWithTrendyol = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<ProductWithTrendyolResponse>>();

  const getProductWithTrendyol = async (productId: string) => {
    try {
      const response = await mutateAsync({
        url: `${GET_PRODUCT_WITH_TRENDYOL}/${productId}`,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(response.data.message || "Ürün bilgisi getirilemedi");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Ürün bilgisi getirilemedi");
      throw error;
    }
  };

  return {
    getProductWithTrendyol,
    isPending,
  };
};