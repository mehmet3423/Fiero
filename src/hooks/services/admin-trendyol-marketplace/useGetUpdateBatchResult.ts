import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_UPDATE_BATCH_RESULT } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { BatchUpdateResponse } from "@/constants/models/trendyol/BatchOnBoardingResponse";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetUpdateBatchResult = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<BatchUpdateResponse>>();

  const getUpdateBatchResult = async (batchRequestId: string) => {
    try {
      const response = await mutateAsync({
        url: `${GET_TRENDYOL_UPDATE_BATCH_RESULT}/${batchRequestId}`,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Update batch sonucu başarıyla getirildi");
        return response.data;
      } else {
        toast.error(response.data.message || "Update batch sonucu getirilemedi");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Update batch sonucu getirilemedi");
      throw error;
    }
  };

  return {
    getUpdateBatchResult,
    isPending,
  };
};