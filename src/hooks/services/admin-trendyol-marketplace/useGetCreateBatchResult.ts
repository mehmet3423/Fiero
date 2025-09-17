import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_CREATE_BATCH_RESULT } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { BatchOnBoardingResponse } from "@/constants/models/trendyol/BatchOnBoardingResponse";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useGetCreateBatchResult = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<BatchOnBoardingResponse>>();

  const getCreateBatchResult = async (batchRequestId: string) => {
    try {
      const response = await mutateAsync({
        url: `${GET_TRENDYOL_CREATE_BATCH_RESULT}/${batchRequestId}`,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Batch sonucu başarıyla getirildi");
        return response.data;
      } else {
        toast.error(response.data.message || "Batch sonucu getirilemedi");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Batch sonucu getirilemedi");
      throw error;
    }
  };

  return {
    getCreateBatchResult,
    isPending,
  };
};