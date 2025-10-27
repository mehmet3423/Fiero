"use client";
import {
  GetShipmentPackagesRequest,
  ShipmentPackage,
} from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

interface ExcelColumn {
  key: string;
  label: string;
  width: number;
  getValue: (pkg: ShipmentPackage, line?: any) => any;
}

interface ExcelExportButtonProps {
  /** Function to fetch data from API */
  fetchData: (request: GetShipmentPackagesRequest) => Promise<{
    data?: { content: ShipmentPackage[]; totalElements: number };
  }>;
  /** Required filters for export */
  filters: {
    startDate?: string;
    endDate?: string;
    supplierId?: number;
    orderNumber?: string;
    status?: string;
    orderByField?: string;
    orderByDirection?: "ASC" | "DESC" | null;
    shipmentPackageIds?: number[];
  };
  /** Current total count (optional, will be fetched if not provided) */
  totalCount?: number;
  /** Custom Excel columns (optional, will use default if not provided) */
  columns?: ExcelColumn[];
  /** Custom file name prefix (optional, defaults to 'Siparisleriniz') */
  fileNamePrefix?: string;
  /** Button style props */
  buttonProps?: {
    className?: string;
    style?: React.CSSProperties;
    size?: "sm" | "md" | "lg";
  };
  /** Custom validation function (optional) */
  customValidation?: () => string | null; // Returns error message or null if valid
}

// Default columns configuration
const defaultColumns: ExcelColumn[] = [
  {
    key: "orderNumber",
    label: "Sipariş No",
    width: 15,
    getValue: (pkg) => pkg.orderNumber,
  },
  { key: "packageId", label: "Paket No", width: 10, getValue: (pkg) => pkg.id },
  {
    key: "orderDate",
    label: "Tarih",
    width: 12,
    getValue: (pkg) => new Date(pkg.orderDate).toLocaleDateString("tr-TR"),
  },
  {
    key: "customerFirstName",
    label: "Müşteri Adı",
    width: 15,
    getValue: (pkg) => pkg.shipmentAddress?.firstName || "",
  },
  {
    key: "customerLastName",
    label: "Müşteri Soyadı",
    width: 15,
    getValue: (pkg) => pkg.shipmentAddress?.lastName || "",
  },
  {
    key: "country",
    label: "Ülke",
    width: 8,
    getValue: (pkg) => pkg.invoiceAddress?.countryCode || "",
  },
  {
    key: "city",
    label: "Şehir",
    width: 15,
    getValue: (pkg) => pkg.shipmentAddress?.city || "",
  },
  {
    key: "district",
    label: "İlçe",
    width: 15,
    getValue: (pkg) => pkg.shipmentAddress?.district || "",
  },
  {
    key: "address",
    label: "Adres",
    width: 30,
    getValue: (pkg) => pkg.shipmentAddress?.fullAddress || "",
  },
  {
    key: "productName",
    label: "Ürün Adı",
    width: 25,
    getValue: (pkg, line) => line?.productName || "",
  },
  {
    key: "barcode",
    label: "Barkod",
    width: 15,
    getValue: (pkg, line) => line?.barcode || "",
  },
  {
    key: "sku",
    label: "SKU",
    width: 15,
    getValue: (pkg, line) => line?.merchantSku || "",
  },
  {
    key: "color",
    label: "Renk",
    width: 10,
    getValue: (pkg, line) => line?.productColor || "",
  },
  {
    key: "size",
    label: "Beden",
    width: 10,
    getValue: (pkg, line) => line?.productSize || "",
  },
  {
    key: "quantity",
    label: "Adet",
    width: 8,
    getValue: (pkg, line) => line?.quantity || (pkg.lines?.length ? 0 : 1),
  },
  {
    key: "unitPrice",
    label: "Birim Fiyat",
    width: 12,
    getValue: (pkg, line) => line?.price || 0,
  },
  {
    key: "totalPrice",
    label: "Toplam Fiyat",
    width: 12,
    getValue: (pkg, line) => line?.amount || pkg.totalPrice,
  },
  {
    key: "discount",
    label: "İndirim",
    width: 10,
    getValue: (pkg, line) => line?.discount || pkg.totalDiscount,
  },
  {
    key: "status",
    label: "Durum",
    width: 12,
    getValue: (pkg) => getStatusDisplayText(pkg.status),
  },
  {
    key: "cargoTracking",
    label: "Kargo Takip No",
    width: 15,
    getValue: (pkg) => pkg.cargoTrackingNumber || "",
  },
  {
    key: "cargoCompany",
    label: "Kargo Firması",
    width: 15,
    getValue: (pkg) =>
      getCargoCompany(pkg.cargoTrackingNumber || "", pkg.cargoProviderName),
  },
  {
    key: "invoiceAddress",
    label: "Fatura Adresi",
    width: 30,
    getValue: (pkg) =>
      `${pkg.invoiceAddress?.firstName || ""} ${
        pkg.invoiceAddress?.lastName || ""
      }, ${pkg.invoiceAddress?.fullAddress || ""}`,
  },
  {
    key: "taxNumber",
    label: "Vergi No",
    width: 15,
    getValue: (pkg) => pkg.invoiceAddress?.taxNumber || pkg.taxNumber || "",
  },
];

// Helper functions
const getStatusDisplayText = (status: string) => {
  switch (status) {
    case "Created":
      return "Yeni";
    case "Picking":
      return "İşleme Alınan";
    case "Shipped":
      return "Taşıma Durumunda";
    case "Delivered":
      return "Teslim Edildi";
    case "Returned":
      return "Yeniden Gönderim";
    case "UnSupplied":
      return "Askıda";
    default:
      return status;
  }
};

const getCargoCompany = (
  cargoTrackingNumber: number | string,
  cargoProviderName?: string
) => {
  if (cargoProviderName) {
    return cargoProviderName;
  }

  if (!cargoTrackingNumber) return "Bilinmiyor";

  const trackingStr = cargoTrackingNumber.toString();
  const firstThreeDigits = trackingStr.substring(0, 3);

  switch (firstThreeDigits) {
    case "733":
      return "Trendyol Express";
    case "725":
      return "Yurtiçi Kargo";
    case "732":
      return "Alternatif Teslimat";
    case "734":
      return "PTT Kargo";
    case "884":
    case "984":
      return "Horoz Lojistik";
    default:
      return "Diğer Kargo";
  }
};

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  fetchData,
  filters,
  totalCount,
  columns = defaultColumns,
  fileNamePrefix = "Siparisleriniz",
  buttonProps = {},
  customValidation,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExcelExport = async () => {
    try {
      // Custom validation first
      if (customValidation) {
        const validationError = customValidation();
        if (validationError) {
          toast.error(validationError);
          return;
        }
      }

      // Default validation - require date range
      if (!filters.startDate || !filters.endDate) {
        toast.error("Excel indirmek için tarih aralığı belirtmelisiniz!");
        return;
      }

      const startTime = new Date(filters.startDate).getTime();
      const endTime = new Date(filters.endDate).getTime();

      // Check if date range is valid
      if (startTime >= endTime) {
        toast.error("Başlangıç tarihi bitiş tarihinden küçük olmalıdır!");
        return;
      }

      // Check maximum date range (14 days as per API docs)
      const diffDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
      if (diffDays > 14) {
        toast.error("Tarih aralığı maksimum 14 gün olabilir!");
        return;
      }

      setIsExporting(true);
      toast.success("Excel dosyası hazırlanıyor...");

      // First, get total count to determine how much data to fetch
      let totalElementsToFetch = totalCount || 0;

      // If we don't have total count, make a small request to get it
      if (!totalElementsToFetch) {
        const countRequest: GetShipmentPackagesRequest = {
          startDate: startTime,
          endDate: endTime,
          page: 0,
          size: 1, // Just get count
          supplierId: filters.supplierId || 1,
          orderNumber: filters.orderNumber || undefined,
          status: filters.status,
          orderByField: filters.orderByField || "PackageLastModifiedDate",
          orderByDirection: filters.orderByDirection || "DESC",
          shipmentPackageIds: filters.shipmentPackageIds,
        };

        const countResponse = await fetchData(countRequest);
        totalElementsToFetch = countResponse.data?.totalElements || 0;
      }

      if (totalElementsToFetch === 0) {
        toast.error("İndirilecek veri bulunamadı!");
        setIsExporting(false);
        return;
      }

      // Fetch all data using pagination
      const allPackages: ShipmentPackage[] = [];
      const totalPages = Math.ceil(totalElementsToFetch / 200); // API maximum is 200

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const pageRequest: GetShipmentPackagesRequest = {
          startDate: startTime,
          endDate: endTime,
          page: pageIndex,
          size: Math.min(200, totalElementsToFetch - pageIndex * 200),
          supplierId: filters.supplierId || 1,
          orderNumber: filters.orderNumber || undefined,
          status: filters.status,
          orderByField: filters.orderByField || "PackageLastModifiedDate",
          orderByDirection: filters.orderByDirection || "DESC",
          shipmentPackageIds: filters.shipmentPackageIds,
        };

        const pageResponse = await fetchData(pageRequest);
        if (pageResponse.data?.content) {
          allPackages.push(...pageResponse.data.content);
        }
      }

      if (allPackages.length === 0) {
        toast.error("İndirilecek veri bulunamadı!");
        setIsExporting(false);
        return;
      }

      // Create Excel data
      const excelData = [];

      // Add header row
      excelData.push(columns.map((col) => col.label));

      // Add data rows
      allPackages.forEach((pkg) => {
        if (pkg.lines && pkg.lines.length > 0) {
          // For each product in the package
          pkg.lines.forEach((line) => {
            const row = columns.map((col) => col.getValue(pkg, line));
            excelData.push(row);
          });
        } else {
          // If no products, add package info only
          const row = columns.map((col) => col.getValue(pkg, null));
          excelData.push(row);
        }
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      const colWidths = columns.map((col) => ({ wch: col.width }));
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Siparişler");

      // Generate filename with date range
      const startDateStr = new Date(startTime)
        .toLocaleDateString("tr-TR")
        .replace(/\./g, "");
      const endDateStr = new Date(endTime)
        .toLocaleDateString("tr-TR")
        .replace(/\./g, "");
      const todayStr = new Date()
        .toLocaleDateString("tr-TR")
        .replace(/\./g, "");
      const filename = `${fileNamePrefix}_${startDateStr}-${endDateStr}_${todayStr}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, filename);

      toast.success(
        `Excel dosyası başarıyla indirildi! (${allPackages.length} sipariş)`
      );
    } catch (error) {
      toast.error("Excel dosyası oluşturulamadı!");
    } finally {
      setIsExporting(false);
    }
  };

  const { className = "", style = {}, size = "sm" } = buttonProps;
  const buttonSizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";

  return (
    <button
      className={`btn btn-outline-success ${buttonSizeClass} ${
        isExporting ? "disabled" : ""
      } ${className}`}
      type="button"
      onClick={handleExcelExport}
      disabled={isExporting}
      style={{ minWidth: "160px", border: "1px solid #d9dee3", ...style }}
      title={
        !filters.startDate || !filters.endDate
          ? "Excel indirmek için tarih aralığı belirtmelisiniz"
          : "Mevcut filtrelerdeki tüm verileri Excel olarak indir"
      }
    >
      {isExporting ? (
        <>
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
            style={{ width: "14px", height: "14px" }}
          >
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          Excel Hazırlanıyor...
        </>
      ) : (
        <>
          <i className="bx bx-file me-1" style={{ color: "#28a745" }}></i>
          Excel ile İndir
        </>
      )}
    </button>
  );
};

export default ExcelExportButton;
