import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_PRODUCT } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const deleteProduct = async (productId: string) => {
        try {
            await mutateAsync({
                url: `${DELETE_PRODUCT}?Id=${productId}`,
                method: HttpMethod.DELETE
            }, {
                onSuccess: () => {
                    toast.success('Ürün başarıyla silindi');
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.ALL_PRODUCTS] });
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.PRODUCT_LIST] });
                    queryClient.invalidateQueries({
                        predicate: (query) => {
                            const queryKey = query.queryKey;
                            return Array.isArray(queryKey) &&
                                queryKey[0] === QueryKeys.PRODUCT_LIST &&
                                queryKey.length > 1;
                        }
                    });
                },
                onError: () => {
                    toast.error('Ürün silinirken bir hata oluştu');
                }
            });
        } catch (error) {
            console.error('Delete product error:', error);
            toast.error('Ürün silinirken bir hata oluştu');
        }
    };

    return {
        deleteProduct,
        isPending
    };
}; 