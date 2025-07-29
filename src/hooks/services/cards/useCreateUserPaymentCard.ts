import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { CREATE_USER_CARD } from '@/constants/links';
import { UserPaymentCard } from '@/constants/models/PaymentCard';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useCreateUserPaymentCard = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const createUserPaymentCard = async (card: UserPaymentCard) => {
        try {
            await mutateAsync({
                url: `${CREATE_USER_CARD}`,
                data: card,
                method: HttpMethod.POST
            }, {
                onSuccess: () => {
                    toast.success('Kart başarıyla oluşturuldu');
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_PAYMENT_CARD_LIST] });
                }
            });
        } catch (error) {
            toast.error('Kart oluşturulurken bir hata oluştu');
        }
    };

    return {
        createUserPaymentCard,
        isPending
    };
}; 