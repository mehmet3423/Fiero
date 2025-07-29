import { QueryKeys } from "@/constants/enums/QueryKeys";
import { DELETE_DISCOUNT } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import { HttpMethod } from '@/constants/enums/HttpMethods';

export const useDeleteDiscount = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<void>();

    const deleteDiscount = async (id: string) => {
        await mutateAsync({
            url: `${DELETE_DISCOUNT}?id=${id}`,
            method: HttpMethod.DELETE
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QueryKeys.DISCOUNTS] });
            }
        });
    };

    return { deleteDiscount, isPending };
}; 