import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_USER_ADDRESS } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<any>();

    const deleteAddress = async (addressId: string) => {
        const params = new URLSearchParams({
            Id: addressId
        }).toString();

        await mutateAsync({
            url: `${DELETE_USER_ADDRESS}?${params}`,
            method: HttpMethod.DELETE
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_ADDRESS_LIST] });
            }
        });
    };

    return { deleteAddress, isPending };
};
