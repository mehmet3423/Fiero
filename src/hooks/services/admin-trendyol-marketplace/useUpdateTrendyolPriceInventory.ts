import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_TRENDYOL_PRICE_INVENTORY } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { TrendyolUpdatePriceInventoryRequest, TrendyolUpdatePriceInventoryResponse } from "@/constants/models/trendyol/TrendyolUpdatePriceInventoryRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateTrendyolPriceInventory = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<TrendyolUpdatePriceInventoryResponse>>();

  const updateTrendyolPriceInventory = async (request: TrendyolUpdatePriceInventoryRequest) => {
    try {
      const response = await mutateAsync(
        {
          url: UPDATE_TRENDYOL_PRICE_INVENTORY,
          method: HttpMethod.PUT,
          data: request,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Trendyol ürün fiyat ve stok bilgileri başarıyla güncellendi");
      } else {
        toast.error(response.data.message || "Trendyol ürün fiyat ve stok bilgileri güncellenirken bir hata oluştu");
      }

    } catch (error) {
      toast.error("Trendyol ürün fiyat ve stok bilgileri güncellenirken bir hata oluştu");
    }
  };

  return {
    updateTrendyolPriceInventory,
    isPending,
  };
};