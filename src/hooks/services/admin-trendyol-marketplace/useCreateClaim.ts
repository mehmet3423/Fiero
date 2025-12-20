import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_CLAIM } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { CreateClaimRequest } from "@/constants/models/trendyol/CreateClaimRequest";
import { CreateClaimResponse } from "@/constants/models/trendyol/CreateClaimResponse";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useCreateClaim = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const createClaim = async (request: CreateClaimRequest) => {
    try {
      const response = await mutateAsync({
        url: CREATE_CLAIM,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "İade talebi başarıyla oluşturuldu");
        return response.data;
      } else {
        toast.error(response.data.message || "İade talebi oluşturulurken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("İade talebi oluşturulurken bir hata oluştu");
      throw error;
    }
  };

  return {
    createClaim,
    isPending,
  };
};
