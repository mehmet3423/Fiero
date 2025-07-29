import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_AFFILIATE_USER_BY_AFFILIATE_USER_ID } from "@/constants/links";
import { AffiliateUserDetail } from "@/constants/models/affiliate/AffiliateUser";
import useGetData from "@/hooks/useGetData";

export interface UserPaymentCard {
    id: string;
    name: string;
}

export const useGetAffiliateUserByAffiliateUserId = (userId: string) => {

    const { data, isLoading, error } = useGetData<AffiliateUserDetail>({
        url: GET_AFFILIATE_USER_BY_AFFILIATE_USER_ID + "/" + userId,
        queryKey: QueryKeys.AFFILIATE_USER_BY_ID,
        method: HttpMethod.GET,
        onError(err) {
            console.log(err);
        },
    });

    return {
        affiliateUser: data,
        isLoading,
        error,
    };
};
