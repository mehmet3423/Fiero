import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { UPDATE_PRODUCT_SPECIFICATION } from '@/constants/links';
import { ProductSpecification } from '@/constants/models/ProductSpecification';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useUpdateProductSpecification = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<ProductSpecification>();

    const updateProductSpecification = async (
        id: string,
        name: string,
        value: string,
        productId?: string
    ) => {
        const params = new URLSearchParams({
            Id: id,
            Name: name,
            Value: value,
        }).toString();

        await mutateAsync({
            url: `${UPDATE_PRODUCT_SPECIFICATION}?${params}`,
            method: HttpMethod.PUT
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QueryKeys.PRODUCT_SPECIFICATIONS_LIST] });

                if (productId) {
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.PRODUCT_SPECIFICATIONS_LIST, productId]
                    });
                }
            }
        });
    };

    return { updateProductSpecification, isPending };
}; 