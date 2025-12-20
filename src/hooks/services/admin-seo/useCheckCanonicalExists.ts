import { useState, useCallback } from "react";
import axios from "axios";
import { CHECK_CANONICAL_EXISTS } from "@/constants/links";

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
      const res = await axios.get(CHECK_CANONICAL_EXISTS, {
        params: { canonicalUrl, baseUrl },
      });
      setExists(!!res.data);
    } catch (err: any) {
      setError("Kontrol sırasında hata oluştu.");
      setExists(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, exists, error, check };
}; 