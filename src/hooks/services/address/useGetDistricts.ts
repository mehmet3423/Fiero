import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_DISTRICTS } from "@/constants/links";
import { District } from "@/constants/models/Province";
import useGetData from "@/hooks/useGetData";

export const useGetDistricts = (provinceId: string) => {
  const { data, isLoading, error, refetch } = useGetData<District[]>({
    url: GET_DISTRICTS(provinceId),
    queryKey: [QueryKeys.DISTRICTS, provinceId],
    method: HttpMethod.GET,
    enabled: !!provinceId,
    onError: (error) => {
      return {
        $id: "0",
        $values: [],
      };
    },
  });

  const districts = error ? [] : data || [];

  return {
    districts,
    isLoading,
    error,
    refetchDistricts: refetch,
  };
};
