import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_SUB_CATEGORY } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeleteSubCategory = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const deleteSubCategory = async (id: string) => {
        try {
            await mutateAsync({
                url: `${DELETE_SUB_CATEGORY}?Id=${id}`,
                method: HttpMethod.DELETE
            }, {
                onSuccess: () => {
                    toast.success('Alt kategori başarıyla silindi');
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.MAIN_CATEGORY_LIST] });
                }
            });
        } catch (error) {
            toast.error('Alt kategori silinirken bir hata oluştu');
        }
    };

    return {
        deleteSubCategory,
        isPending
    };
}; 