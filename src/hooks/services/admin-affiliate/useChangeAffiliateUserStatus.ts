import { UpdateableAffiliateStatus } from '@/constants/enums/affiliate/AffiliateApplicationStatus';
import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { CHANGE_AFFILIATE_USER_STATUS } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useChangeAffiliateUserStatus = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const changeAffiliateUserStatus = async (userId: string, status: UpdateableAffiliateStatus) => {
        try {
            await mutateAsync({
                url: `${CHANGE_AFFILIATE_USER_STATUS}`,
                data: {
                    id: userId,
                    status
                },
                method: HttpMethod.PUT
            }, {
                onSuccess: () => {
                    toast.success('Affiliate durumu başarıyla değiştirildi');
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.AFFILIATE_USER_LIST] });
                }
            });
        } catch (error) {
            toast.error('Affiliate durumu değiştirilirken bir hata oluştu');
        }
    };

    return {
        changeAffiliateUserStatus,
        isPending
    };
}; 