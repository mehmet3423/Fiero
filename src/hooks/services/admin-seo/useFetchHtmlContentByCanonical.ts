import { useEffect, useState } from "react";
import { CHECK_CANONICAL_EXISTS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import toast from "react-hot-toast";

export interface SeoCheckResponse {
  exists: boolean;
  canonicalUrl: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  imgCount: number;
  linkCount: number;
  links: string[];
  htmlContent: string;
}

export const useFetchHtmlContentByCanonical = (
  canonicalUrl: string | null,
  baseUrl: string | null
) => {
  const [data, setData] = useState<SeoCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canonicalUrl || !baseUrl) {
      setData(null);
      setError(null);
      return;
    }
    setIsLoading(true);

    const fetchData = async () => {
      try {
        // Backend logic: canonical her zaman "/" ile başlamalı
        let canonicalPath = canonicalUrl.trim();
        if (!canonicalPath.startsWith("/")) {
          canonicalPath = "/" + canonicalPath;
        }
        const response = await fetch(`${CHECK_CANONICAL_EXISTS}?canonicalUrl=${encodeURIComponent(canonicalPath)}&baseUrl=${encodeURIComponent(baseUrl)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: CommandResultWithData<SeoCheckResponse> = await response.json();

        // Check if the response is successful according to CommandResult structure
        if (result.isSucceed && result.data) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.message || "HTML içeriği alınamadı.");
          setData(null);
          toast.error(result.message || "HTML içeriği alınamadı.");
        }
      } catch (err) {
        setError("HTML içeriği alınamadı.");
        setData(null);
        toast.error("HTML içeriği alınamadı.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [canonicalUrl, baseUrl]);

  return { ...data, isLoading, error };
}; 