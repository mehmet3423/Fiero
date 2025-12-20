import { HttpMethod } from "@/constants/enums/HttpMethods";
import { CREATE_CLAIM_ISSUE } from "@/constants/links";
import { CommandResult } from "@/constants/models/CommandResult";
import { CreateClaimIssueRequest } from "@/constants/models/trendyol/CreateClaimIssueRequest";
import useMyMutation from "@/hooks/useMyMutation";
import toast from "react-hot-toast";

export const useCreateClaimIssue = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResult>();

  const createClaimIssue = async (claimId: string, request: CreateClaimIssueRequest) => {
    try {
      // FormData oluştur çünkü file upload var
      const formData = new FormData();
      formData.append("claimIssueReasonId", request.claimIssueReasonId.toString());
      formData.append("description", request.description);

      // String olarak append et
      formData.append("claimItemIdList", request.claimItemIdList);

      if (request.file) {
        formData.append("file", request.file);
      }

      const response = await mutateAsync({
        url: CREATE_CLAIM_ISSUE(claimId),
        method: HttpMethod.POST,
        data: formData,
        headers: {
          // Content-Type'ı otomatik olarak multipart/form-data olarak ayarlayacak
        },
      });

      if (response.data.isSucceed) {
        toast.success(response.data.message || "İade ret talebi başarıyla oluşturuldu");
        return response.data;
      } else {
        toast.error(response.data.message || "İade ret talebi oluşturulurken bir hata oluştu");
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("İade ret talebi oluşturulurken bir hata oluştu");
      throw error;
    }
  };

  return {
    createClaimIssue,
    isPending,
  };
};
