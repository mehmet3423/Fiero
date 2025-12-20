import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { GET_SUPPORT_TICKET_BY_ID } from "@/constants/links";
import useGetData from "@/hooks/useGetData";

interface GeneralSupportTicket {
  id: string;
  title: string;
  requestType: number;
  supportTicketStatus: number;
  description?: string;
  imageUrl?: string | null;
  createdOnValue: string;
  modifiedOnValue?: string | null;
  customerId: string;
  isDeleted?: boolean;
  email?: string;
  phoneNumber?: string;
}

interface GeneralSupportTicketByIdResponse {
  data: GeneralSupportTicket;
}

export const useGetGeneralSupportTicketById = (id: string) => {
  const { data, isLoading, error, refetch } =
    useGetData<GeneralSupportTicketByIdResponse>({
      url: `${GET_SUPPORT_TICKET_BY_ID}?id=${id}`,
      queryKey: [QueryKeys.GENERAL_SUPPORT_TICKET_BY_ID, id],
      method: HttpMethod.GET,
      enabled: !!id, // Sadece id varsa fetch et
    });

  return {
    ticket: data?.data,
    isLoading,
    error,
    refetch,
  };
};
