import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CHECK_BIN } from "@/constants/links";
import { CheckBinRequest, BinNumberQueryResponseData } from "@/constants/models/Payment";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useCheckBin = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<BinNumberQueryResponseData>>();

  const checkBin = async (binData: Omit<CheckBinRequest, "locale">) => {
    try {
      const response = await mutateAsync({
        url: CHECK_BIN,
        method: HttpMethod.POST,
        data: {
          ...binData,
          locale: 0,
        },
      });

      // Check if the response is successful according to CommandResult structure
      if (!response.data.isSucceed || !response.data.data) {
        throw new Error(response.data.message || "Failed to check BIN");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { checkBin, isPending };
};

export default useCheckBin;
