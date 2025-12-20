import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { UPDATE_GENERAL_CONTENT } from '@/constants/links';
import { GeneralContentModel } from '@/constants/models/GeneralContent';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useUpdateContent = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<GeneralContentModel>();

    const updateContent = async (contentId: string, content: GeneralContentModel) => {
        const requestBody = {
            id: contentId,
            order: content.order,
            title: content.title || '',
            content: content.content || '',
            contentUrl: content.contentUrl || '',
            imageUrl: content.imageUrl || '',
            willRender: content.willRender,
            generalContentType: content.generalContentType,
            language: content.language
        };

        await mutateAsync({
            url: UPDATE_GENERAL_CONTENT,
            method: HttpMethod.PUT,
            data: requestBody
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QueryKeys.GENERAL_CONTENTS_LIST, content.generalContentType.toString()] });
            }
        });
    };

    return { updateContent, isPending };
}; 