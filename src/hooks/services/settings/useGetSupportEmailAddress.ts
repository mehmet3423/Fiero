import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUPPORT_EMAIL_ADDRESS } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

export interface SupportEmailAddressResponse {
  data: {
    id: string;
    key: number;
    value: string;
    description: string | null;
    createdOnValue: string;
    modifiedOnValue: string | null;
  };
  isSucceed: boolean;
  message: string;
}

export const useGetSupportEmailAddress = () => {
  const { data, isLoading, error, refetch } = useGetData<SupportEmailAddressResponse>({
    queryKey: QueryKeys.SUPPORT_EMAIL_ADDRESS,
    url: GET_SUPPORT_EMAIL_ADDRESS,
    method: HttpMethod.GET,
    enabled: true,
  });

  return {
    supportEmail: data?.data?.value || null,
    isLoading,
    error,
    refetch,
  };
};
