import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_AVAILABLE_PACKAGE_STATUSES } from "@/constants/links";
import { CommandResult, CommandResultWithData } from "@/constants/models/CommandResult";
import { PackageStatusResponse } from "@/constants/models/trendyol/PackageStatusResponse";
import useMyMutation from "@/hooks/useMyMutation";

export const useGetAvailablePackageStatuses = () => {
  const { mutateAsync, isPending } = useMyMutation<CommandResultWithData<PackageStatusResponse[]>>();

  const getAvailablePackageStatuses = async () => {
    try {
      const response = await mutateAsync({
        url: GET_AVAILABLE_PACKAGE_STATUSES,
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
    getAvailablePackageStatuses,
    isPending,
  };
};