import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_GENERAL_CONTENT } from "@/constants/links";
import { GeneralContentModel } from "@/constants/models/GeneralContent";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<GeneralContentModel>();

  const updateContent = async (
    contentId: string,
    content: GeneralContentModel
  ) => {
    // Data will be sent in the body instead of URL parameters
    const body = {
      Id: contentId,
      Order: content.order,
      Title: content.title || "",
      Content: content.content || "",
      ContentUrl: content.contentUrl || "",
      ImageUrl: content.imageUrl || "",
      WillRender: content.willRender,
      GeneralContentType: content.generalContentType,
    };

    await mutateAsync(
      {
        url: UPDATE_GENERAL_CONTENT,
        method: HttpMethod.PUT,
        data: body,
        showErrorToast: false,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              QueryKeys.GENERAL_CONTENTS_LIST,
              content.generalContentType.toString(),
            ],
          });
        },
      }
    );
  };

  return { updateContent, isPending };
};
