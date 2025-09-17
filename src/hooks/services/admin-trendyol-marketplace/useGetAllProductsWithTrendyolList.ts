import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_ALL_PRODUCTS_WITH_TRENDYOL_LIST } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";
import { GetAllProductsWithTrendyolListRequest } from "./GetAllProductsWithTrendyolListRequest";
import { ProductWithTrendyolResponse } from "@/constants/models/trendyol/ProductWithTrendyolResponse";

export const useGetAllProductsWithTrendyolList = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<ProductWithTrendyolResponse>>();

  const getAllProductsWithTrendyolList = async (request: GetAllProductsWithTrendyolListRequest) => {
    try {
      const response = await mutateAsync({
        url: GET_ALL_PRODUCTS_WITH_TRENDYOL_LIST,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Trendyol ürün listesi başarıyla getirildi");
        return response.data;
      } else {
        toast.error(response.data.message || "Trendyol ürün listesi getirilemedi");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Trendyol ürün listesi getirilemedi");
      throw error;
    }
  };

  return {
    getAllProductsWithTrendyolList,
    isPending,
  };
};