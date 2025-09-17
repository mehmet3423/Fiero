import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_TRENDYOL_PRODUCTS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { TrendyolUpdateProductRequest } from "@/constants/models/trendyol/TrendyolUpdateProductRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateTrendyolProducts = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const updateTrendyolProducts = async (request: TrendyolUpdateProductRequest) => {
    try {
      const response = await mutateAsync(
        {
          url: UPDATE_TRENDYOL_PRODUCTS,
          method: HttpMethod.PUT,
          data: request,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Trendyol ürünleri başarıyla güncellendi");
      } else {
        toast.error(response.data.message || "Trendyol ürünleri güncellenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Trendyol ürünleri güncellenirken bir hata oluştu");
    }
  };

  return {
    updateTrendyolProducts,
    isPending,
  };
};