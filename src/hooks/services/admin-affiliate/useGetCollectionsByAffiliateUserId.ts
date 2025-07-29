import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateCollectionType";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID } from "@/constants/links";
import { AffiliateCollection } from "@/constants/models/affiliate/Collection";
import useGetData from "@/hooks/useGetData";

export const useGetCollectionsByAffiliateUserId = (userId: string, type: AffiliateCollectionType | null) => {
    const { data, isLoading, error } = useGetData<AffiliateCollection[]>({
        url: type
            ? `${GET_AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID(userId)}?earningType=${Number(type)}`
            : `${GET_AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID(userId)}`,
        queryKey: [QueryKeys.AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID, type?.toString() || 'all'],
        method: HttpMethod.GET,
        onError(err) {
            console.log(err);
        },
    });

    return {
        affiliateCollections: data,
        isLoading,
        error,
    };
};
