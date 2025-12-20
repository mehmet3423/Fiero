import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_PRODUCT_SPECIFICATION } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteProductSpecification = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const deleteProductSpecification = async (productSpecificationId: string, productId?: string) => {
        const params = new URLSearchParams({
            Id: productSpecificationId
        }).toString();

        await mutateAsync({
            url: `${DELETE_PRODUCT_SPECIFICATION}?${params}`,
            method: HttpMethod.DELETE
        }, {
            onSuccess: () => {
                // Invalidate the general query
                queryClient.invalidateQueries({ queryKey: [QueryKeys.PRODUCT_SPECIFICATIONS_LIST] });

                // If productId is provided, also invalidate the specific product query
                if (productId) {
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.PRODUCT_SPECIFICATIONS_LIST, productId.toString()]
                    });
                }
            }
        });
    };

    return { deleteProductSpecification, isPending };
}; 