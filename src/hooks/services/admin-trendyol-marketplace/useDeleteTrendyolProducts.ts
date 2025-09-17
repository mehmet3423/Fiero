import { HttpMethod } from "@/constants/enums/HttpMethods";
import { DELETE_TRENDYOL_PRODUCTS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { TrendyolDeleteProductRequest } from "@/constants/models/trendyol/TrendyolDeleteProductRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useDeleteTrendyolProducts = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const deleteTrendyolProducts = async (request: TrendyolDeleteProductRequest) => {
    try {
      const response = await mutateAsync({
        url: DELETE_TRENDYOL_PRODUCTS,
        method: HttpMethod.DELETE,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Trendyol ürünleri başarıyla silindi");
      } else {
        toast.error(response.data.message || "Trendyol ürünleri silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Trendyol ürünleri silinirken bir hata oluştu");
    }
  };

  return {
    deleteTrendyolProducts,
    isPending,
  };
};