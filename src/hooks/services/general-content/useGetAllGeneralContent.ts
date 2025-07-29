import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { GET_GENERAL_CONTENTS_LIST } from '@/constants/links';
import { GeneralContentListResponse, GeneralContentType } from '@/constants/models/GeneralContent';
import useGetData from '@/hooks/useGetData';

//ŞİMDİLİK KULLANILMAYAN HOOK SONRADAN TÜM CONTENTLERİ ÇEKECEK AMA ENDPOİNT YOK
export const useGeneralContents = (type: GeneralContentType | null) => {
    const { data, isLoading, error, refetch } = useGetData<GeneralContentListResponse>({
        url: type !== null ? `${GET_GENERAL_CONTENTS_LIST}?GeneralContentType=${type}` : undefined,
        queryKey: [QueryKeys.GENERAL_CONTENTS_LIST, type?.toString()],
        method: HttpMethod.GET,
        onError: () => {
            return {
                $id: "0",
                items: {
                    $id: "1",
                    $values: []
                }
            };
        }
    });

    return {
        contents: data,
        isLoading,
        error,
        refetchContents: refetch
    };
}; 