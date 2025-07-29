import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface UseReportPaginationProps {
  defaultPageSize?: number;
}

interface ReportFilters {
  [key: string]: any;
}

export const useReportPagination = <T extends ReportFilters>({
  defaultPageSize = 20,
}: UseReportPaginationProps = {}) => {
  const router = useRouter();
  const [displayPage, setDisplayPage] = useState<number>(1);
  const [filters, setFilters] = useState<T>({} as T);

  // URL'den state'i parse et
  useEffect(() => {
    const { page, ...urlFilters } = router.query;

    const pageFromUrl = page ? parseInt(page as string, 10) : 1;
    const parsedFilters = parseUrlFilters(urlFilters) as T;

    setDisplayPage(pageFromUrl);
    setFilters(parsedFilters);
  }, [router.query]);

  // URL'i güncelle
  const updateUrl = (newFilters: Partial<T>, newPage?: number) => {
    const query: any = { ...router.query };

    // Page parametresi
    if (newPage !== undefined) {
      query.page = newPage.toString();
    }

    // Filter parametreleri
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query[key] = value.toString();
      } else {
        delete query[key];
      }
    });

    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  // Sayfa değiştir
  const changePage = (newPage: number) => {
    setDisplayPage(newPage);
    updateUrl(filters, newPage);
  };

  // Filter'ları güncelle (sayfa 1'e reset)
  const updateFilters = (newFilters: Partial<T>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setDisplayPage(1);
    updateUrl(updatedFilters, 1);
  };

  // Filter'ları temizle
  const clearFilters = () => {
    const emptyFilters = {} as T;
    setFilters(emptyFilters);
    setDisplayPage(1);
    updateUrl(emptyFilters, 1);
  };

  // API için pagination parametreleri
  const getApiParams = () => ({
    ...filters,
    page: displayPage - 1, // 0-based indexing
    pageSize: defaultPageSize,
  });

  return {
    displayPage,
    pageSize: defaultPageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  };
};

// Utility function
const parseUrlFilters = (urlParams: any): Record<string, any> => {
  const parsed: Record<string, any> = {};

  Object.entries(urlParams).forEach(([key, value]) => {
    if (key === "page") return; // Skip page param

    if (value === "true" || value === "false") {
      parsed[key] = value === "true";
    } else if (typeof value === "string" && value) {
      parsed[key] = value;
    }
  });

  return parsed;
};
