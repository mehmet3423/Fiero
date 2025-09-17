import { HttpMethod } from "@/constants/enums/HttpMethods";
import { FILTER_TRENDYOL_PRODUCTS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { TrendyolFilterProductsRequest, TrendyolFilterProductsResponse } from "@/constants/models/trendyol/TrendyolFilterProductsRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useFilterTrendyolProducts = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<TrendyolFilterProductsResponse>>();

  const filterTrendyolProducts = async (request: TrendyolFilterProductsRequest) => {
    try {
      const response = await mutateAsync({
        url: FILTER_TRENDYOL_PRODUCTS,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Trendyol ürün filtreleme işlemi başarılı");
        return response.data;
      } else {
        toast.error(response.data.message || "Trendyol ürün filtreleme işlemi başarısız");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Trendyol ürün filtreleme işlemi başarısız");
      throw error;
    }
  };

  return {
    filterTrendyolProducts,
    isPending,
  };
};