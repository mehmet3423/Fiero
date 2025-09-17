import { HttpMethod } from "@/constants/enums/HttpMethods";
import { SET_LABOR_COST } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { SetLaborCostRequest } from "@/constants/models/trendyol/SetLaborCostRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useSetLaborCost = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const setLaborCost = async (packageId: number, request: SetLaborCostRequest[]) => {
    try {
      const response = await mutateAsync({
        url: SET_LABOR_COST(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "İşçilik bedeli başarıyla belirlendi");
        return response.data;
      } else {
        toast.error(response.data.message || "İşçilik bedeli belirlenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("İşçilik bedeli belirlenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    setLaborCost,
    isPending,
  };
};