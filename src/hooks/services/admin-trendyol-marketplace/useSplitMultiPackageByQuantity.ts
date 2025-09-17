import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SPLIT_MULTI_PACKAGE_BY_QUANTITY } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SplitMultiPackageByQuantityRequest } from "@/constants/models/trendyol/SplitMultiPackageByQuantityRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSplitMultiPackageByQuantity = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const splitMultiPackageByQuantity = async (packageId: number, request: SplitMultiPackageByQuantityRequest) => {
    try {
      const response = await mutateAsync({
        url: SPLIT_MULTI_PACKAGE_BY_QUANTITY(packageId),
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
        showErrorToast: false, // Hata mesajını burada handle ediyoruz
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Çoklu paket miktara göre başarıyla bölündü");
        return response.data;
      } else {
        toast.error(response.data.message || "Çoklu paket bölünürken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      // Backend'den gelen hata mesajını göster
      const errorMessage = error.response?.data?.message || error.message || "Çoklu paket bölünürken bir hata oluştu";
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    splitMultiPackageByQuantity,
    isPending,
  };
};