import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GET_TRENDYOL_BRANDS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import {
  BrandListRequest,
  BrandListResponse,
  BrandItem,
} from "@/constants/models/trendyol/BrandListRequest";
import useMyMutation from "@/hooks/useMyMutation";
import { useState, useCallback, useRef, useEffect } from "react";
import { useGetBrandByName } from "./useGetBrandByName";
import toast from "react-hot-toast";

export const useGetTrendyolBrands = () => {
  const { mutateAsync, isPending } =
    useMyMutation<CommandResultWithData<BrandListResponse>>();

  const getTrendyolBrands = async (request: BrandListRequest) => {
    try {
      const response = await mutateAsync({
        url: GET_TRENDYOL_BRANDS,
        method: HttpMethod.POST,
        data: request,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.isSucceed) {
        return response.data;
      } else {
        toast.error(
          response.data.message || "Trendyol marka listesi alınamadı"
        );
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Trendyol marka listesi alınırken bir hata oluştu");
      throw error;
    }
  };

  return {
    getTrendyolBrands,
    isPending,
  };
};

export const useGetTrendyolBrandsHybrid = (
  selectedBrandId?: number,
  selectedBrandName?: string
) => {
  const { getTrendyolBrands, isPending } = useGetTrendyolBrands();
  const { getBrandByName, isPending: searchPending } = useGetBrandByName();
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BrandItem[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const loadingRef = useRef(false);
  const searchRef = useRef(false);

  // Initialize with selected brand only
  useEffect(() => {
    if (
      selectedBrandId !== undefined &&
      selectedBrandId > 0 &&
      selectedBrandName &&
      brands.length === 0
    ) {
      setBrands([{ id: selectedBrandId, name: selectedBrandName }]);
    }
  }, [selectedBrandId, selectedBrandName, brands.length]);

  const loadPage = useCallback(
    async (page: number, pageSize = 1000) => {
      // Reduced from 1000 to 100
      if (loadingRef.current) return [];

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const request: BrandListRequest = { page, size: pageSize };
        const response = await getTrendyolBrands(request);

        if (response?.data?.brands) {
          const newBrands = response.data.brands;

          if (newBrands.length === 0) {
            setHasMore(false);
          } else if (newBrands.length < pageSize) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          return newBrands;
        }

        setHasMore(false);
        return [];
      } catch (error) {
        setHasMore(false);
        return [];
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [getTrendyolBrands]
  );

  const loadInitialBrands = useCallback(async () => {
    if (loadingRef.current || initialLoadComplete) return;

    const initialBrands = await loadPage(0);
    if (initialBrands.length > 0) {
      setBrands(initialBrands);
      setCurrentPage(0);
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete, loadPage]);

  // Load initial brands when component mounts
  useEffect(() => {
    if (
      !initialLoadComplete &&
      brands.length === 0 &&
      selectedBrandId === undefined
    ) {
      loadInitialBrands();
    }
  }, [initialLoadComplete, selectedBrandId]); // Removed brands.length and loadInitialBrands to prevent infinite loops

  const loadMoreBrands = useCallback(async () => {
    if (!hasMore || isLoading || isSearchMode) {
      return;
    }

    // Limit total brands to prevent excessive loading
    if (brands.length >= 5000) {
      setHasMore(false);
      return;
    }

    const nextPage = currentPage + 1;
    const newBrands = await loadPage(nextPage);

    if (newBrands.length > 0) {
      setBrands((prev) => {
        // Remove duplicates by ID
        const existingIds = new Set(prev.map((b) => b.id));
        const uniqueNewBrands = newBrands.filter((b) => !existingIds.has(b.id));
        return [...prev, ...uniqueNewBrands];
      });
      setCurrentPage(nextPage);
    } else {
      setHasMore(false);
    }
  }, [hasMore, isLoading, currentPage, loadPage, isSearchMode, brands.length]);

  const searchBrands = useCallback(
    async (searchTerm: string) => {
      // Prevent multiple simultaneous searches
      if (searchRef.current) {
        return;
      }

      setSearchTerm(searchTerm);

      if (!searchTerm.trim()) {
        setIsSearchMode(false);
        setSearchResults([]);
        return;
      }

      searchRef.current = true;
      setSearchLoading(true);
      setIsSearchMode(true);

      try {
        // Only search in existing brands, don't load more or use API fallback
        const filteredExisting = brands.filter((b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredExisting.length > 0) {
          setSearchResults(filteredExisting);
        } else {
          setSearchResults([]);
        }

        setSearchLoading(false);
        searchRef.current = false;
      } catch (error) {
        setSearchResults([]);
        setSearchLoading(false);
        searchRef.current = false;
      }
    },
    [brands]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      // Trigger pagination only when user reaches the end of the current list
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // Small buffer of 10px

      if (
        isAtBottom &&
        !isLoading &&
        hasMore &&
        !isSearchMode &&
        !searchRef.current
      ) {
        loadMoreBrands();
      }
    },
    [isLoading, hasMore, loadMoreBrands, isSearchMode]
  );

  const resetBrands = useCallback(() => {
    setBrands([]);
    setSearchResults([]);
    setCurrentPage(0);
    setHasMore(true);
    setIsSearchMode(false);
    setIsLoading(false);
    setSearchLoading(false);
    setSearchTerm("");
    setInitialLoadComplete(false);
    searchRef.current = false;
  }, []);

  const displayBrands = isSearchMode ? searchResults : brands;

  return {
    brands: displayBrands,
    hasMore: !isSearchMode && hasMore,
    isLoading: isLoading || isPending,
    searchLoading: searchLoading || searchPending,
    isSearchMode,
    searchTerm,
    loadMoreBrands,
    handleScroll,
    searchBrands,
    resetBrands,
    loadInitialBrands,
  };
};

export const useGetTrendyolBrandsWithPagination = (
  selectedBrandId?: number
) => {
  const { getTrendyolBrands, isPending } = useGetTrendyolBrands();
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedBrandFound, setSelectedBrandFound] = useState(false);
  const [autoLoadingComplete, setAutoLoadingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const loadingRef = useRef(false);
  const previousSelectedBrandId = useRef<number | undefined>(selectedBrandId);
  const lastLoadTimeRef = useRef<number>(0);

  const loadPage = useCallback(
    async (page: number, isAutoLoad = false) => {
      if (loadingRef.current) return [];

      // Add debounce for auto-loading to prevent rapid successive calls
      if (isAutoLoad) {
        const now = Date.now();
        const timeSinceLastLoad = now - lastLoadTimeRef.current;
        if (timeSinceLastLoad < 500) {
          // 500ms debounce
          return [];
        }
        lastLoadTimeRef.current = now;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        // Use smaller page sizes to reduce API load
        const pageSize = isAutoLoad ? 200 : 50;
        const request: BrandListRequest = { page, size: pageSize };
        const response = await getTrendyolBrands(request);

        if (response?.data?.brands) {
          const newBrands = response.data.brands;

          // Determine if there are more brands to load
          if (newBrands.length === 0) {
            setHasMore(false);
          } else if (newBrands.length < pageSize) {
            // If we got less than requested, no more data available
            setHasMore(false);
          } else {
            // We got the full page size, might have more
            setHasMore(true);
          }

          return newBrands;
        }

        setHasMore(false);
        return [];
      } catch (error) {
        setHasMore(false);
        return [];
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [getTrendyolBrands]
  );

  const loadInitialBrands = useCallback(async () => {
    if (brands.length > 0) return;

    const initialBrands = await loadPage(0, true);
    setBrands(initialBrands);
    setCurrentPage(0);

    // Check if selected brand is in initial load
    if (
      selectedBrandId &&
      initialBrands.some((b) => b.id === selectedBrandId)
    ) {
      setSelectedBrandFound(true);
      setAutoLoadingComplete(true);
      return;
    }

    // Disable aggressive auto-loading to prevent excessive API calls
    // Just mark as complete after initial load
    setAutoLoadingComplete(true);
  }, [selectedBrandId, selectedBrandFound, hasMore, loadPage]); // Removed brands.length to prevent infinite loops

  const autoLoadUntilBrandFound = useCallback(
    async (currentBrands: BrandItem[], startPage: number) => {
      let allBrands = [...currentBrands];
      let page = startPage;
      let found = false;
      const maxPages = 10; // Reduced from 100 to 10 pages max
      let pagesLoaded = 0;

      setSearchInProgress(true);

      while (!found && hasMore && selectedBrandId && pagesLoaded < maxPages) {
        const newBrands = await loadPage(page, true);
        pagesLoaded++;

        if (newBrands.length === 0) {
          setHasMore(false);
          break;
        }

        allBrands = [...allBrands, ...newBrands];
        setBrands(allBrands);
        setCurrentPage(page);

        // Check if selected brand is found in this batch
        if (newBrands.some((b) => b.id === selectedBrandId)) {
          found = true;
          setSelectedBrandFound(true);
          break; // Stop immediately when found
        }

        page++;
      }

      if (pagesLoaded >= maxPages) {
        setHasMore(false);
      }

      setSearchInProgress(false);
      setAutoLoadingComplete(true);
    },
    [selectedBrandId, hasMore, loadPage]
  );

  // Effect to handle when selectedBrandId changes after initial load
  useEffect(() => {
    if (
      selectedBrandId &&
      selectedBrandId !== previousSelectedBrandId.current &&
      brands.length > 0
    ) {
      // Check if the new selected brand is already in our current list
      const brandExists = brands.some((b) => b.id === selectedBrandId);

      if (!brandExists && hasMore && !searchInProgress) {
        // Start auto-loading to find the selected brand
        setSelectedBrandFound(false);
        setAutoLoadingComplete(false);
        autoLoadUntilBrandFound(brands, currentPage + 1);
      } else if (brandExists) {
        setSelectedBrandFound(true);
      }
    }

    previousSelectedBrandId.current = selectedBrandId;
  }, [selectedBrandId]); // Only depend on selectedBrandId to prevent infinite loops

  const loadMoreBrands = useCallback(async () => {
    if (!hasMore || isLoading || searchInProgress) {
      return;
    }

    const newBrands = await loadPage(currentPage + 1, false);

    if (newBrands.length > 0) {
      setBrands((prev) => [...prev, ...newBrands]);
      setCurrentPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
  }, [hasMore, isLoading, currentPage, loadPage, searchInProgress]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      if (isAtBottom && !isLoading && hasMore && !searchInProgress) {
        loadMoreBrands();
      }
    },
    [isLoading, hasMore, loadMoreBrands, searchInProgress]
  );

  const checkAndLoadBrandIfNeeded = useCallback(
    async (brandName: string) => {
      // Check if brand exists in current list (case insensitive)
      const brandExists = brands.some((b) =>
        b.name.toLowerCase().includes(brandName.toLowerCase())
      );

      if (!brandExists && hasMore && !searchInProgress) {
        setSearchInProgress(true);

        // Continue loading pages until we find a match or run out of brands
        let page = currentPage + 1;
        let foundMatch = false;
        let allBrands = [...brands];
        const maxPages = 5; // Reduced from 50 to 5 pages max for search
        let pagesLoaded = 0;

        while (!foundMatch && hasMore && pagesLoaded < maxPages) {
          const newBrands = await loadPage(page, true);
          pagesLoaded++;

          if (newBrands.length === 0) {
            setHasMore(false);
            break;
          }

          allBrands = [...allBrands, ...newBrands];
          setBrands(allBrands);
          setCurrentPage(page);

          // Check if any new brand matches the search
          const matchFound = newBrands.some((b) =>
            b.name.toLowerCase().includes(brandName.toLowerCase())
          );

          if (matchFound) {
            foundMatch = true;
            break; // Stop immediately when found
          }

          page++;
        }

        if (pagesLoaded >= maxPages) {
          setHasMore(false);
        }

        setSearchInProgress(false);
      }
    },
    [brands, hasMore, searchInProgress, currentPage, loadPage]
  );

  const resetBrands = useCallback(() => {
    setBrands([]);
    setCurrentPage(0);
    setHasMore(true);
    setSelectedBrandFound(false);
    setAutoLoadingComplete(false);
    setIsLoading(false);
    setSearchInProgress(false);
    previousSelectedBrandId.current = undefined;
  }, []);

  return {
    brands,
    hasMore,
    isLoading: isLoading || isPending,
    selectedBrandFound,
    autoLoadingComplete,
    searchInProgress,
    loadInitialBrands,
    loadMoreBrands,
    handleScroll,
    checkAndLoadBrandIfNeeded,
    resetBrands,
  };
};
