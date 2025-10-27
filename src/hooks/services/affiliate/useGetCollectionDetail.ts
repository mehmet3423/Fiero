import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_AFFILIATE_COLLECTION_BY_ID } from "@/constants/links";
import { AffiliateCollection } from "@/constants/models/affiliate/Collection";
import useGetData from "@/hooks/useGetData";

export const useGetCollectionDetail = (collectionId: string) => {
  const { data, isLoading, error, refetch } = useGetData<AffiliateCollection>({
    url: `${GET_AFFILIATE_COLLECTION_BY_ID}/${collectionId}`,
    queryKey: [QueryKeys.AFFILIATE_COLLECTIONS, collectionId],
    method: HttpMethod.GET,
    onError: (err: any) => {
      // 400 veya 404 hatası normal durumlar (koleksiyon bulunamadı)
      if (err?.response?.status !== 400 && err?.response?.status !== 404) {
      }
    },
  });

  return {
    collectionDetail: data,
    isLoading,
    error,
    refetchCollectionDetail: refetch,
    hasNoRecord: (error as any)?.response?.status === 404,
    hasExistingRecord: (error as any)?.response?.status === 400,
  };
};
