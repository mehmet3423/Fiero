import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_TRACKING_NUMBER } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { UpdateTrackingNumberRequest } from "@/constants/models/trendyol/UpdateTrackingNumberRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateTrackingNumber = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const updateTrackingNumber = async (packageId: number, request: UpdateTrackingNumberRequest) => {
    try {
      const response = await mutateAsync({
        url: UPDATE_TRACKING_NUMBER(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Kargo takip numarası başarıyla güncellendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Kargo takip numarası güncellenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Kargo takip numarası güncellenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    updateTrackingNumber,
    isPending,
  };
};