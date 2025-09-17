import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_UNSUPPLIED_REASONS } from "@/constants/links";
import { CommandResult, CommandResultWithData } from "@/constants/models/CommandResult";
import { UnSuppliedReasonResponse } from "@/constants/models/trendyol/UnSuppliedReasonResponse";
import useMyMutation from "@/hooks/useMyMutation";

export const useGetUnsuppliedReasons = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<UnSuppliedReasonResponse[]>>();

  const getUnsuppliedReasons = async () => {
    try {
      const response = await mutateAsync({
        url: GET_UNSUPPLIED_REASONS,
        method: HttpMethod.GET,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data?.isSucceed) {
        return response.data.data || [];
      } else {
        throw new Error(response.data?.message || "Bir hata oluştu");
      }
    } catch (error) {
      return [];
    }
  };

  return {
    getUnsuppliedReasons,
    isPending,
  };
};