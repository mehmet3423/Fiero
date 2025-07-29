import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { CREATE_SUB_CATEGORY_SPECIFICATION } from '@/constants/links';
import { SubCategorySpecification } from '@/constants/models/SubCategorySpecification';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

// optionslar değerler isim olarak name
export const useAddSubCategorySpecification = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<SubCategorySpecification>();

    const addSubCategorySpecification = async (
        subCategoryId: string,
        name: string,
        options: string[],
    ) => {
        // Rebuild params to handle multiple Options values correctly
        const formattedParams = new URLSearchParams();
        formattedParams.append('SubCategoryId', subCategoryId);
        formattedParams.append('Name', name);
        options.forEach(option => {
            formattedParams.append('Options', option);
        });
        const params = formattedParams.toString();

        await mutateAsync({
            url: `${CREATE_SUB_CATEGORY_SPECIFICATION}?${params}`,
            method: HttpMethod.POST
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

    return { addSubCategorySpecification, isPending };
}; 