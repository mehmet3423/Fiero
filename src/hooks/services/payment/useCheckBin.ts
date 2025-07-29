import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CHECK_BIN } from "@/constants/links";
import { CheckBinRequest, CheckBinResponse } from "@/constants/models/Payment";
import useMyMutation from "@/hooks/useMyMutation";

export const useCheckBin = () => {
  const { mutateAsync, isPending } = useMyMutation<CheckBinResponse>();

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
      return response;
    } catch (error) {
      console.error("Error during check bin:", error);
      throw error;
    }
  };

  return { checkBin, isPending };
};

export default useCheckBin;
