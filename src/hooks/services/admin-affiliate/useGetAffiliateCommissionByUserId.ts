import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_AFFILIATE_COMMISSION_BY_AFFILIATE_USER_ID } from "@/constants/links";
import { AffiliateUser } from "@/constants/models/Affiliate";
import useGetData from "@/hooks/useGetData";

export interface UserPaymentCard {
    id: string;
    name: string;
}

export const useGetAffiliateCommissionByUserId = (userId: string) => {

    const { data, isLoading, error } = useGetData<AffiliateUser>({
        url: GET_AFFILIATE_COMMISSION_BY_AFFILIATE_USER_ID + "/" + userId,
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
