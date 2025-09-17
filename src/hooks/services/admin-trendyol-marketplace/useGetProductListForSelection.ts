import { useQuery } from "@tanstack/react-query";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import { GET_ALL_PRODUCTS_WITH_TRENDYOL_LIST } from "@/constants/links";
import axios from "axios";
import { getToken } from "@/helpers/tokenUtils";

interface ProductForSelection {
  id: string;
  name: string;
  mainId?: string;
}

interface ProductListRequest {
  page: number;
  pageSize: number;
  search?: string;
}

const fetchProductListForSelection = async (request: ProductListRequest): Promise<CommandResultWithData<ProductForSelection[]>> => {
  const token = getToken();
  const response = await axios.post(GET_ALL_PRODUCTS_WITH_TRENDYOL_LIST, {
    ...request,
    pageSize: 50, // Ürün seçimi için daha az veri
  }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const useGetProductListForSelection = (searchTerm: string = "") => {
  return useQuery<CommandResultWithData<ProductForSelection[]>, Error, ProductForSelection[]>({
    queryKey: ["product-list-for-selection", searchTerm],
    queryFn: () => fetchProductListForSelection({
      page: 0,
      pageSize: 50,
      search: searchTerm || undefined,
    }),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data || [],
    enabled: searchTerm.length >= 2 || searchTerm.length === 0, // En az 2 karakter veya boş
  });
}; 