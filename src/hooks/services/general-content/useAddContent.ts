import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_GENERAL_CONTENT } from "@/constants/links";
import {
  GeneralContentModel,
  GeneralContentType,
} from "@/constants/models/GeneralContent";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useAddContent = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<GeneralContentModel>();

  const addContent = async (
    title: string,
    content: string,
    contentUrl: string,
    imageUrl: string,
    order: number,
    generalContentType: GeneralContentType
  ) => {
    const params = new URLSearchParams({
      Order: order.toString(),
      Title: title || "",
      Content: content || "",
      ContentUrl: contentUrl || "",
      ImageUrl: imageUrl || "",
      WillRender: "true",
      GeneralContentType: generalContentType.toString(),
    }).toString();

    await mutateAsync(
      {
        url: `${CREATE_GENERAL_CONTENT}?${params}`,
        method: HttpMethod.POST,
        showErrorToast: false,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              QueryKeys.GENERAL_CONTENTS_LIST,
              generalContentType.toString(),
            ],
          });
        },
      }
    );
  };

  return { addContent, isPending };
};
