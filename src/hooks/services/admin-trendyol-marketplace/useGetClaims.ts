import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_CLAIMS } from "@/constants/links";
import { GetClaimsRequest } from "@/constants/models/trendyol/GetClaimsRequest";
import { GetClaimsResponse } from "@/constants/models/trendyol/GetClaimsResponse";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import useGetData from "@/hooks/useGetData";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const useGetClaims = (request: GetClaimsRequest) => {
  const { data, isLoading, error } = useGetData<CommandResultWithData<GetClaimsResponse>>({
    url: GET_CLAIMS,
    queryKey: [QueryKeys.TRENDYOL_CLAIMS, JSON.stringify(request)],
    method: HttpMethod.POST,
    enabled: true,
    data: request,
    onError(err) {
      console.error("Error fetching claims:", err);
    },
  });

  // Check if data is loaded but no claims found
  useEffect(() => {
    if (!isLoading && !error && data?.data && (!data.data.content || data.data.content.length === 0)) {
      toast.error("Belirtilen kriterlere uygun iade kaydı bulunamadı.");
    }
  }, [data, isLoading, error]);

  return {
    claims: data?.data || null,
    isLoading,
    error,
  };
};
