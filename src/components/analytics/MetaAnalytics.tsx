"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGetGoogleAndMetaAnalytics } from "@/hooks/services/settings";

const MetaAnalytics = () => {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");
  const {
    googleAnalyticsCode: googleCode,
    metaAnalyticsCode: metaCode,
    isLoading,
    error,
  } = useGetGoogleAndMetaAnalytics();

  const [googleAnalyticsCode, setGoogleAnalyticsCode] = useState<string | null>(null);
  const [metaAnalyticsCode, setMetaAnalyticsCode] = useState<string | null>(null);

  useEffect(() => {
    // Admin sayfalarında analytics gösterilmez
    if (isAdminPage) {
      setGoogleAnalyticsCode(null);
      setMetaAnalyticsCode(null);
      return;
    }

    // Google Analytics Code
    if (googleCode) {
      setGoogleAnalyticsCode(googleCode);
    }

    // Meta Analytics Code
    if (metaCode) {
      setMetaAnalyticsCode(metaCode);
    }
  }, [googleCode, metaCode, isLoading, error, isAdminPage]);

  useEffect(() => {
    // Google Analytics script injection
    if (googleAnalyticsCode && !isAdminPage) {
      // Remove existing Google Analytics scripts
      const existingScripts = document.querySelectorAll('script[data-google-analytics]');
      existingScripts.forEach(script => script.remove());

      // Create and inject Google Analytics script
      const script = document.createElement("script");
      script.setAttribute("data-google-analytics", "true");
      script.innerHTML = googleAnalyticsCode;
      document.head.appendChild(script);
    }
  }, [googleAnalyticsCode, isAdminPage]);

  useEffect(() => {
    // Meta Analytics script injection
    if (metaAnalyticsCode && !isAdminPage) {
      // Remove existing Meta Analytics scripts
      const existingScripts = document.querySelectorAll('script[data-meta-analytics]');
      existingScripts.forEach(script => script.remove());

      // Create and inject Meta Analytics script
      const script = document.createElement("script");
      script.setAttribute("data-meta-analytics", "true");
      script.innerHTML = metaAnalyticsCode;
      document.head.appendChild(script);
    }
  }, [metaAnalyticsCode, isAdminPage]);

  return null; // This component doesn't render anything
};

export default MetaAnalytics;
