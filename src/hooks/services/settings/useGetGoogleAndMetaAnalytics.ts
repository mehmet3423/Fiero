import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_GOOGLE_AND_META_ANALYTICS } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

export interface GoogleAndMetaAnalyticsResponse {
  googleAnalyticsCode?: string | null;
  metaAnalyticsCode?: string | null;
}

export const useGetGoogleAndMetaAnalytics = () => {
  const { data, isLoading, error, refetch } = useGetData<GoogleAndMetaAnalyticsResponse>({
    queryKey: QueryKeys.GOOGLE_AND_META_ANALYTICS,
    url: GET_GOOGLE_AND_META_ANALYTICS,
    method: HttpMethod.GET,
    enabled: true,
  });

  return {
    googleAnalyticsCode: data?.googleAnalyticsCode || null,
    metaAnalyticsCode: data?.metaAnalyticsCode || null,
    isLoading,
    error,
    refetch,
  };
};
