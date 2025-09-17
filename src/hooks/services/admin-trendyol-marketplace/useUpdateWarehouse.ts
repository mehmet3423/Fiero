import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_WAREHOUSE } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { UpdateWarehouseRequest } from "@/constants/models/trendyol/UpdateWarehouseRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateWarehouse = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const updateWarehouse = async (packageId: number, request: UpdateWarehouseRequest) => {
    try {
      const response = await mutateAsync({
        url: UPDATE_WAREHOUSE(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Depo bilgisi başarıyla güncellendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Depo bilgisi güncellenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Depo bilgisi güncellenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    updateWarehouse,
    isPending,
  };
};