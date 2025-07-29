import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_SUB_CATEGORY_SPECIFICATION } from '@/constants/links';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteSubCategorySpecification = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const deleteSubCategorySpecification = async (subCategorySpecificationId: string, subCategoryId: string) => {
        const params = new URLSearchParams({
            Id: subCategorySpecificationId
        }).toString();

        await mutateAsync({
            url: `${DELETE_SUB_CATEGORY_SPECIFICATION}?${params}`,
            method: HttpMethod.DELETE
        }, {
            onSuccess: () => {
                // Spesifik alt kategori için sorguyu invalidate et
                queryClient.invalidateQueries({ queryKey: [QueryKeys.SUB_CATEGORY_SPECIFICATIONS_LIST, subCategoryId] });

                // Genel sorguyu da invalidate et
                queryClient.invalidateQueries({ queryKey: [QueryKeys.SUB_CATEGORY_SPECIFICATIONS_LIST] });

                // İlgili diğer sorguları da invalidate et
                queryClient.invalidateQueries({ queryKey: [QueryKeys.SUB_CATEGORY_LIST] });
            }
        });
    };

    return { deleteSubCategorySpecification, isPending };
}; 