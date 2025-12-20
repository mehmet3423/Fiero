import { useEffect, useState } from "react";
import axios from "axios";
import { CHECK_CANONICAL_EXISTS } from "@/constants/links";

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
    axios
      .get(CHECK_CANONICAL_EXISTS, { params: { canonicalUrl, baseUrl } })
      .then((res) => {
        setData(res.data?.data || res.data);
        setError(null);
      })
      .catch((err) => setError("HTML içeriği alınamadı."))
      .finally(() => setIsLoading(false));
  }, [canonicalUrl, baseUrl]);

  return { ...data, isLoading, error };
}; 