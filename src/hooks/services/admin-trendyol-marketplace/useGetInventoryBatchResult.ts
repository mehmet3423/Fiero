import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_INVENTORY_BATCH_RESULT } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { BatchInventoryUpdateResponse } from "@/constants/models/trendyol/BatchOnBoardingResponse";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetInventoryBatchResult = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<BatchInventoryUpdateResponse>>();

  const getInventoryBatchResult = async (batchRequestId: string) => {
    try {
      const response = await mutateAsync({
        url: `${GET_TRENDYOL_INVENTORY_BATCH_RESULT}/${batchRequestId}`,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Inventory batch sonucu başarıyla getirildi");
        return response.data;
      } else {
        toast.error(response.data.message || "Inventory batch sonucu getirilemedi");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Inventory batch sonucu getirilemedi");
      throw error;
    }
  };

  return {
    getInventoryBatchResult,
    isPending,
  };
};