import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UPDATE_BOX_INFO } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { UpdateBoxInfoRequest } from "@/constants/models/trendyol/UpdateBoxInfoRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useUpdateBoxInfo = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const updateBoxInfo = async (packageId: number, request: UpdateBoxInfoRequest) => {
    try {
      const response = await mutateAsync({
        url: UPDATE_BOX_INFO(packageId),
        method: HttpMethod.PUT,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "Koli bilgileri başarıyla güncellendi");
        return response.data;
      } else {
        toast.error(response.data.message || "Koli bilgileri güncellenirken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Koli bilgileri güncellenirken bir hata oluştu");
      throw error;
    }
  };

  return {
    updateBoxInfo,
    isPending,
  };
};