import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_PROVİNCES } from "@/constants/links";
import { Province } from "@/constants/models/Address";
import useGetData from "@/hooks/useGetData";

export const useGetProvinces = () => {
  const { data, isLoading, error, refetch } = useGetData<Province[]>({
    url: GET_PROVİNCES,
    queryKey: [QueryKeys.PROVINCES],
    method: HttpMethod.GET,
    onError: (error) => {
      console.error("İl listesi alınırken hata oluştu:", error);
    },
  });

  const provinces = error ? [] : data || [];

  return {
    provinces,
    isLoading,
    error,
    refetchProvinces: refetch,
  };
};
