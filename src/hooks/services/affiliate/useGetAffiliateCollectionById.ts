import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { BASE_URL } from "@/constants/links";
import { AffiliateCollection } from "@/constants/models/Affiliate";
import useGetData from "@/hooks/useGetData";
import toast from "react-hot-toast";

interface AffiliateCollectionResponse {
  data: AffiliateCollection;
  isSucceed: boolean;
  message: string;
}

export const useGetAffiliateCollectionById = (collectionId: string) => {
  const url = `${BASE_URL}api/AffiliateCollections/${collectionId}`;

  const { data, isLoading, error, refetch } =
    useGetData<AffiliateCollectionResponse>({
      url,
      queryKey: [QueryKeys.AFFILIATE_COLLECTION_DETAIL, collectionId],
      method: HttpMethod.GET,
      enabled: !!collectionId,
      onError: (err: any) => {
        // Check if this might be an inactive collection access attempt
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          toast.error("Koleksiyon bulunamadı veya erişim yetkiniz bulunmuyor");
        }
      },
      onSuccess: (data: AffiliateCollectionResponse) => {
        // Additional check for inactive collections that might pass through API
        if (data?.data && !data.data.isActive) {
          // Note: We handle the actual blocking in the component to avoid
          // interfering with admin/owner access who might need to edit
        }
      },
    });

  return {
    collection: data?.data,
    isLoading,
    error,
    refetch,
  };
};
