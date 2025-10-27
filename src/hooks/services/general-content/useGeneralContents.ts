import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_GENERAL_CONTENTS_LIST } from "@/constants/links";
import {
  GeneralContentListResponse,
  GeneralContentType,
  GeneralContentModel,
  GeneralContentApiResponse,
} from "@/constants/models/GeneralContent";
import useGetData from "@/hooks/useGetData";
import { useMemo } from "react";

export const useGeneralContents = (type: GeneralContentType | null) => {
  const { data, isLoading, error, refetch } = useGetData<
    | GeneralContentApiResponse
    | GeneralContentModel[]
    | GeneralContentListResponse
  >({
    url:
      type !== null
        ? `${GET_GENERAL_CONTENTS_LIST}?GeneralContentType=${type}`
        : undefined,
    queryKey: [QueryKeys.GENERAL_CONTENTS_LIST, type?.toString()],
    method: HttpMethod.GET,
  });

  // Handle different response formats
  const normalizeData = useMemo(() => {
    if (!data) return { $id: "0", items: [] };

    // If response is the new API format with data, isSucceed, message
    if ("data" in data && "isSucceed" in data && "message" in data) {
      return {
        $id: "0",
        items: data.data,
      };
    }

    // If response is a direct array (legacy format)
    if (Array.isArray(data)) {
      return {
        $id: "0",
        items: data,
      };
    }

    // If response is the old wrapped format
    return data;
  }, [data]);

  const normalizedData = normalizeData;

  return {
    contents: normalizedData,
    isLoading,
    error,
    refetchContents: refetch,
  };
};
