import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_MAIN_CATEGORY } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useDeleteMainCategory = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const deleteMainCategory = async (id: string) => {
        try {
            await mutateAsync({
                url: `${DELETE_MAIN_CATEGORY}?Id=${id}`,
                method: HttpMethod.DELETE
            }, {
                onSuccess: () => {
                    toast.success('Ana kategori başarıyla silindi');
                    queryClient.invalidateQueries({ queryKey: [QueryKeys.MAIN_CATEGORY_LIST] });
                }
            });
        } catch (error) {
            toast.error('Ana kategori silinirken bir hata oluştu');
        }
    };

    return {
        deleteMainCategory,
        isPending
    };
}; 