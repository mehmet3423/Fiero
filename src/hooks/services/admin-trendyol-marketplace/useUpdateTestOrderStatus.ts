import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_TEST_ORDER_STATUS } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { UpdateTestOrderStatusRequest } from "@/constants/models/trendyol/UpdateTestOrderStatusRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateTestOrderStatus = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const updateTestOrderStatus = async (packageId: number, request: UpdateTestOrderStatusRequest) => {
    try {
      const response = await mutateAsync({
        url: UPDATE_TEST_ORDER_STATUS(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Test sipariş durumu başarıyla güncellendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Test sipariş durumu güncellenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Test sipariş durumu güncellenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    updateTestOrderStatus,
    isPending,
  };
};