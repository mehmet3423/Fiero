import { useState, useCallback } from "react";
import { CHECK_CANONICAL_EXISTS } from "@/constants/links";
import { CommandResultWithData } from "@/constants/models/CommandResult";
import toast from "react-hot-toast";

interface CanonicalCheckResponse {
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

export const useCheckCanonicalExists = () => {
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (canonicalUrl: string, baseUrl: string) => {
    if (!canonicalUrl || !baseUrl) {
      setExists(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
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

      const result: CommandResultWithData<CanonicalCheckResponse> = await response.json();

      // Check if the response is successful according to CommandResult structure
      if (result.isSucceed && result.data) {
        setExists(result.data.exists);
        setError(null);
      } else {
        setError(result.message || "Kontrol sırasında hata oluştu.");
        setExists(null);
        toast.error(result.message || "Kontrol sırasında hata oluştu.");
      }
    } catch (err: any) {
      setError("Kontrol sırasında hata oluştu.");
      setExists(null);
      toast.error("Kontrol sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, exists, error, check };
}; 