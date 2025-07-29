import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { DELETE_GENERAL_CONTENT } from '@/constants/links';
import { GeneralContentType } from '@/constants/models/GeneralContent';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteContent = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<string>();

    const deleteContent = async (contentId: string, selectedContentType: GeneralContentType | null) => {
        const params = new URLSearchParams({
            Id: contentId
        }).toString();

        await mutateAsync({
            url: `${DELETE_GENERAL_CONTENT}?${params}`,
            method: HttpMethod.DELETE
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QueryKeys.GENERAL_CONTENTS_LIST, selectedContentType?.toString()] });
            }
        });
    };

    return { deleteContent, isPending };
}; 