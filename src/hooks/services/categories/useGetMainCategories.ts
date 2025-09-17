import { useState, useEffect } from "react";
import axios from "axios";
import { GET_MAIN_CATEGORY_LOOKUP_LIST } from "@/constants/links";

export interface MainCategoryLookupDTO {
  id: string;
  name: string;
}

export const useGetMainCategories = () => {
  const [data, setData] = useState<MainCategoryLookupDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(GET_MAIN_CATEGORY_LOOKUP_LIST)
      .then((res) => {
        const items = res.data?.data || res.data;
        setData(items.map((item: any) => ({ id: item.id, name: item.name })));
      })
      .catch((err) => setError("Ana kategoriler alınamadı."))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
};
