import { useState } from "react";
import { getToken, handleLogout } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";

interface ExcelExportParams {
  [key: string]: any;
}

export function useExcelExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async (
    endpoint: string,
    params: ExcelExportParams = {},
    filename?: string
  ) => {
    setIsExporting(true);

    // Değişkenleri scope dışında tanımla
    let filteredParams: ExcelExportParams = {};
    let fullUrl = "";

    try {
      // Pagination parametrelerini filtrele, sadece filtreleme parametrelerini kullan
      filteredParams = {};

      Object.entries(params).forEach(([key, value]) => {
        // Pagination parametrelerini hariç tut
        if (
          key !== "page" &&
          key !== "pageSize" &&
          key !== "pageIndex" &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          filteredParams[key] = value;
        }
      });

      // Query string parametrelerini oluştur
      const queryParams = new URLSearchParams();

      Object.entries(filteredParams).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });

      const queryString = queryParams.toString();
      fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;

      const token = getToken();

      // Token expiration kontrolü
      if (token) {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000;

          if (Date.now() >= exp) {
            handleLogout();
            toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
            throw new Error("Token expired");
          }
        }
      }

      // Fetch ile Excel endpoint'ine istek at
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        // 401 error handling
        if (response.status === 401 && token) {
          toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
          handleLogout();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Content-Type'ı kontrol et
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // JSON response - download link bekleniyor
        const result = await response.json();
        if (result.data && result.data.downloadLink) {
          window.open(result.data.downloadLink, "_blank");
        } else {
          throw new Error("Download link not found in response");
        }
      } else {
        // Binary response - direkt dosya indirme
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Content-Disposition header'ından filename'i al
        const contentDisposition = response.headers.get("content-disposition");
        let downloadFilename = filename || "report.xlsx";

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            downloadFilename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        // Programmatik olarak dosyayı indir
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Excel export error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        endpoint,
        params: filteredParams,
        fullUrl,
      });
      alert(
        `Excel dosyası indirilemedi. Hata: ${
          error instanceof Error ? error.message : "Bilinmeyen hata"
        }`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToExcel,
    isExporting,
  };
}
