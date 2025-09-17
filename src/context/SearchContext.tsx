import { Product } from "@/constants/models/Product";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Product[];
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType>({
  searchTerm: "",
  setSearchTerm: () => { },
  searchResults: [],
  isSearching: false,
});

export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Only search when we have at least 3 characters
  const shouldSearch = debouncedSearchTerm.length >= 3;

  const { data: productsData, isLoading } = useGetAllProducts({
    search: shouldSearch ? debouncedSearchTerm : undefined,
    pageSize: 10, // Limit results for dropdown
    enabled: shouldSearch,
  });

  const searchResults = React.useMemo(() => {
    if (!shouldSearch) {
      return [];
    }
    return productsData?.items || [];
  }, [shouldSearch, productsData]);

  // Update searching state based on API loading state
  useEffect(() => {
    setIsSearching(isLoading && shouldSearch);
  }, [isLoading, shouldSearch]);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, searchResults, isSearching }}
    >
      {children}
    </SearchContext.Provider>
  );
}
