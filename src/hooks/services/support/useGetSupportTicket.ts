import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_SUPPORT_TICKETS } from "@/constants/links";
import { SupportTicketResponse } from "@/constants/models/SupportTicket";
import useGetData from "@/hooks/useGetData";

interface UseGetSupportTicketsProps {
  page?: number;
  pageSize?: number;
  requestType?: number;
  title?: string;
  from?: string;
}

export const useGetSupportTickets = ({
  page = 1,
  pageSize = 10,
  requestType,
  title,
  from,
}: UseGetSupportTicketsProps = {}) => {
  const params = {
    Page: page,
    PageSize: pageSize,
    ...(requestType !== undefined && { RequestType: requestType }),
    ...(title && { Title: title }),
    ...(from !== undefined && { From: from }),
  };

  const { data, isLoading, error, refetch } = useGetData<{
    data: SupportTicketResponse;
  }>({
    url: GET_SUPPORT_TICKETS,
    params,
    queryKey: [
      "supportTickets",
      String(page),
      String(pageSize),
      requestType !== undefined ? String(requestType) : undefined,
      title,
      from,
    ],
    method: HttpMethod.GET,
  });

  return {
    tickets: data?.data?.items || [],
    totalCount: data?.data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};
