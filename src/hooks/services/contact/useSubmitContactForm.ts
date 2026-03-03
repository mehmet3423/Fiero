import { CONTACT_FORM_SUBMISSION_API } from "@/constants/links";
import { useMutation } from "@tanstack/react-query";

export interface ContactFormSubmissionPayload {
  projectName: string;
  email: string;
  firstName: string;
  surname: string | null;
  title: string;
  body: string;
}

const CONTACT_FORM_PROJECT_NAME =
  process.env.NEXT_PUBLIC_CONTACT_FORM_PROJECT_NAME ?? "DesaDeri";

async function submitContactForm(
  payload: ContactFormSubmissionPayload
): Promise<Response> {
  const response = await fetch(CONTACT_FORM_SUBMISSION_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return response;
}

export function useSubmitContactForm() {
  const mutation = useMutation({
    mutationFn: submitContactForm,
  });

  const submit = async (params: {
    firstName: string;
    surname?: string | null;
    email: string;
    title: string;
    body: string;
  }) => {
    const payload: ContactFormSubmissionPayload = {
      projectName: CONTACT_FORM_PROJECT_NAME,
      email: params.email,
      firstName: params.firstName,
      surname: params.surname ?? null,
      title: params.title,
      body: params.body,
    };
    return mutation.mutateAsync(payload);
  };

  return {
    submit,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
