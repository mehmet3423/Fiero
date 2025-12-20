import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_GENERAL_CONTENTS_LIST } from "@/constants/links";
import {
  GeneralContentModel,
  GeneralContentType,
} from "@/constants/models/GeneralContent";
import useGetData from "@/hooks/useGetData";

export const useGeneralContents = (type: GeneralContentType | null) => {
  const { data, isLoading, error, refetch } = useGetData<any>({
    url:
      type !== null
        ? `${GET_GENERAL_CONTENTS_LIST}?GeneralContentType=${type}`
        : undefined,
    queryKey: [QueryKeys.GENERAL_CONTENTS_LIST, type?.toString()],
    method: HttpMethod.GET,
    onError: () => {
      return [];
    },
  });

  // Handle nested API response structure
  // API can return: { data: [items] } or { data: [{ data: [items] }] }
  let contents: GeneralContentModel[] = [];

  if (data?.data) {
    if (Array.isArray(data.data)) {
      // Check if first element has nested data structure
      const firstElement = data.data[0];
      if (
        firstElement &&
        typeof firstElement === "object" &&
        "data" in firstElement &&
        Array.isArray(firstElement.data)
      ) {
        // Nested structure: { data: [{ data: [items] }] }
        contents = firstElement.data as GeneralContentModel[];
      } else {
        // Direct structure: { data: [items] }
        contents = data.data as GeneralContentModel[];
      }
    }
  }

  return {
    contents,
    isLoading,
    error,
    refetchContents: refetch,
  };
};
