import { HttpMethod } from '@/constants/enums/HttpMethods';
import { QueryKeys } from '@/constants/enums/QueryKeys';
import { CREATE_GENERAL_CONTENT } from '@/constants/links';
import { GeneralContentModel, GeneralContentType } from '@/constants/models/GeneralContent';
import useMyMutation from '@/hooks/useMyMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useAddContent = () => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMyMutation<GeneralContentModel>();

    const addContent = async (
        title: string,
        content: string,
        contentUrl: string,
        imageUrl: string,
        order: number,
        generalContentType: GeneralContentType,
        language: number
    ) => {
        const requestBody = {
            order: order,
            title: title || '',
            content: content || '',
            contentUrl: contentUrl || '',
            imageUrl: imageUrl || '',
            willRender: true,
            generalContentType: generalContentType,
            language: language
        };

        await mutateAsync({
            url: CREATE_GENERAL_CONTENT,
            method: HttpMethod.POST,
            data: requestBody
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QueryKeys.GENERAL_CONTENTS_LIST, generalContentType.toString()] });
            }
        });
    };

    return { addContent, isPending };
}; 