import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_TRENDYOL_PRODUCTS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { TrendyolCreateProductRequest } from "@/constants/models/trendyol/TrendyolMarketplace";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useCreateTrendyolProducts = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const createTrendyolProducts = async (request: TrendyolCreateProductRequest) => {
    try {
      const response = await mutateAsync(
        {
          url: CREATE_TRENDYOL_PRODUCTS,
          method: HttpMethod.POST,
          data: request,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Trendyol ürünleri başarıyla oluşturuldu");
      } else {
        toast.error(response.data.message || "Trendyol ürünleri oluşturulurken bir hata oluştu");
      }

    } catch (error) {
      toast.error("Trendyol ürünleri oluşturulurken bir hata oluştu");
    }
  };

  return {
    createTrendyolProducts,
    isPending,
  };
};