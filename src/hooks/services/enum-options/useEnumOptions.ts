import { useQuery } from "@tanstack/react-query";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { EnumOption } from "@/constants/models/EnumOption";
import axios from "axios";
import { getToken } from "@/helpers/tokenUtils";

interface UseEnumOptionsConfig {
  url: string;
  queryKey: string;
  enabled?: boolean;
  staleTime?: number;
}

const fetchEnumOptions = async (url: string): Promise<CommandResultWithData<EnumOption[]>> => {
  const token = getToken();
  const response = await axios.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const useEnumOptions = ({
  url,
  queryKey,
  enabled = false,
  staleTime = 30 * 60 * 1000, // 30 minutes default
}: UseEnumOptionsConfig) => {
  return useQuery<CommandResultWithData<EnumOption[]>, Error, EnumOption[]>({
    queryKey: [queryKey],
    queryFn: () => fetchEnumOptions(url),
    staleTime,
    select: (data) => data.data || [],
    enabled,
  });
};