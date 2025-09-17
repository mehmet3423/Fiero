import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_GENERAL_CONTENTS_LIST } from "@/constants/links";
import {
  GeneralContentType,
  GeneralContentModel,
  GeneralContentApiResponse,
} from "@/constants/models/GeneralContent";
import useGetData from "@/hooks/useGetData";

//ŞİMDİLİK KULLANILMAYAN HOOK SONRADAN TÜM CONTENTLERİ ÇEKECEK AMA ENDPOİNT YOK
export const useGeneralContents = (type: GeneralContentType | null) => {
  const { data, isLoading, error, refetch } =
    useGetData<GeneralContentApiResponse>({
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

  return {
    contents: data?.data || [],
    isLoading,
    error,
    refetchContents: refetch,
  };
};
