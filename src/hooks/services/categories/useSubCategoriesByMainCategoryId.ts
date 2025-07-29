import { useEffect, useState } from "react";
import axios from "axios";
import { GET_SUB_CATEGORY_LOOKUP_LIST } from "@/constants/links";

export interface SubCategoryLookupDTO {
  id: string;
  name: string;
}

export const useSubCategoriesByMainCategoryId = (mainCategoryId: string | null) => {
  const [data, setData] = useState<SubCategoryLookupDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mainCategoryId) {
      setData([]);
      return;
    }
    setIsLoading(true);
    axios
      .get(GET_SUB_CATEGORY_LOOKUP_LIST, {
        params: { mainCategoryId },
      })
      .then((res) => {
        const items = res.data?.data || res.data;
        setData(items.map((item: any) => ({ id: item.id, name: item.name })));
      })
      .catch((err) => setError("Alt kategoriler alınamadı."))
      .finally(() => setIsLoading(false));
  }, [mainCategoryId]);

  return { data, isLoading, error };
}; 