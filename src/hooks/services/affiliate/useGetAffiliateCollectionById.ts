import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { BASE_URL } from "@/constants/links";
import { AffiliateCollection } from "@/constants/models/Affiliate";
import useGetData from "@/hooks/useGetData";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

export const useGetAffiliateCollectionById = (collectionId: string) => {
  const url = `${BASE_URL}AffiliateCollections/${collectionId}`;
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useGetData<AffiliateCollection>({
    url,
    queryKey: [QueryKeys.AFFILIATE_COLLECTION_DETAIL, collectionId],
    method: HttpMethod.GET,
    enabled: !!collectionId,
    onError: (err: any) => {
      console.error("Affiliate collection detail error:", err);
      // Check if this might be an inactive collection access attempt
      if (err?.response?.status === 403 || err?.response?.status === 404) {
        toast.error(t("affiliateCollections.collectionNotAccessible"));
      }
    },
    onSuccess: (data: AffiliateCollection) => {
      // Additional check for inactive collections that might pass through API
      if (data && !data.isActive) {
        console.warn("Inactive collection accessed:", data.id);
        // Note: We handle the actual blocking in the component to avoid
        // interfering with admin/owner access who might need to edit
      }
    },
  });

  return {
    collection: data,
    isLoading,
    error,
    refetch,
  };
};
