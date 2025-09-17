"use client";
import GeneralModal from "@/components/shared/GeneralModal";
import {
  GetShipmentPackagesRequest,
  ShipmentPackage,
} from "@/constants/models/trendyol/GetShipmentPackagesRequest";
import { useGetShipmentPackages } from "@/hooks/services/admin-trendyol-marketplace/useGetShipmentPackages";
import { useUpdateShipmentPackageStatus } from "@/hooks/services/admin-trendyol-marketplace/useUpdateShipmentPackageStatus";
import { useUpdateTrackingNumber } from "@/hooks/services/admin-trendyol-marketplace/useUpdateTrackingNumber";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/context/useAuth";
import { useGetTrendyolCountries } from "@/hooks/services/admin-trendyol-marketplace/useGetTrendyolCountries";
import InvoiceInfoModal from "@/components/admin/trendyol-marketplace/InvoiceInfoModal";
import UploadInvoiceModal from "@/components/admin/trendyol-marketplace/UploadInvoiceModal";
import DeleteInvoiceModal from "@/components/admin/trendyol-marketplace/DeleteInvoiceModal";
import SplitPackageModal from "@/components/admin/trendyol-marketplace/SplitPackageModal";
import SplitConfirmationModal from "@/components/admin/trendyol-marketplace/SplitConfirmationModal";
import UnsuppliedItemsModal from "@/components/admin/trendyol-marketplace/UnsuppliedItemsModal";
import { useSplitMultiPackageByQuantity } from "@/hooks/services/admin-trendyol-marketplace/useSplitMultiPackageByQuantity";
import { useSplitShipmentPackage } from "@/hooks/services/admin-trendyol-marketplace/useSplitShipmentPackage";
import { useSplitShipmentPackageByQuantity } from "@/hooks/services/admin-trendyol-marketplace/useSplitShipmentPackageByQuantity";
import { useSplitShipmentPackageMultiGroup } from "@/hooks/services/admin-trendyol-marketplace/useSplitShipmentPackageMultiGroup";
import { SplitShipmentPackageRequest } from "@/constants/models/trendyol/SplitShipmentPackageRequest";
import { SplitShipmentPackageByQuantityRequest } from "@/constants/models/trendyol/SplitShipmentPackageByQuantityRequest";
import { SplitMultiPackageByQuantityRequest } from "@/constants/models/trendyol/SplitMultiPackageByQuantityRequest";
import { useDeleteInvoiceLink } from "@/hooks/services/admin-trendyol-marketplace/useDeleteInvoiceLink";
import XLSX from "xlsx";

interface FrontendFilters {
  // API parametreleri
  startDate?: number;
  endDate?: number;
  page?: number;
  size?: number;
  supplierId?: number;
  orderNumber?: string;
  status?: string;
  orderByField?: string;
  orderByDirection?: "ASC" | "DESC" | null; // null = sıralama yok
  shipmentPackageIds?: number[];

  // Frontend-only filtreler (client-side filtering)
  customerName?: string;
  packageNumber?: string;
  barcode?: string;
  cargoCode?: string;
  productName?: string;
  supplyPeriodStatus?: string;
}

const statusTabs = [
  { key: "All", label: "Tüm Siparişler", count: 0 },
  { key: "Created", label: "Yeni", count: 0 },
  { key: "Picking", label: "İşleme Alınanlar", count: 0 },
  { key: "Shipped", label: "Taşıma Durumunda", count: 0 },
  { key: "Delivered", label: "Teslim Edilen", count: 0 },
  { key: "Returned", label: "Yeniden Gönderimler", count: 0 },
  { key: "UnSupplied", label: "Askıdaki Siparişler", count: 0, hasInfo: true },
];

function TrendyolMarketplaceCargoStagePage() {
  // States
  const [filters, setFilters] = useState<FrontendFilters>({
    page: 0,
    size: 20,
    supplierId: 1, // Geçici olarak 1, gerçek uygulamada kullanıcı bilgilerinden alınmalı
    // Diğer alanlar opsiyonel, default değer atanmamalı
  });

  const [selectedStatus, setSelectedStatus] = useState("Created");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] =
    useState<ShipmentPackage | null>(null);
  const [modalType, setModalType] = useState<"status" | "tracking" | null>(
    null
  );
  const [newStatus, setNewStatus] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedPackages, setSelectedPackages] = useState<Set<number>>(
    new Set()
  );
  const [showUploadInvoiceModal, setShowUploadInvoiceModal] = useState(false);
  const [showInvoiceInfoModal, setShowInvoiceInfoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPackageForModal, setSelectedPackageForModal] =
    useState<ShipmentPackage | null>(null);

  // Split package states
  const [showSplitPackageModal, setShowSplitPackageModal] = useState(false);
  const [showSplitConfirmationModal, setShowSplitConfirmationModal] =
    useState(false);
  const [selectedPackageForSplit, setSelectedPackageForSplit] =
    useState<ShipmentPackage | null>(null);
  const [splitQuantities, setSplitQuantities] = useState<{
    [lineId: number]: number;
  }>({});

  // Toplu paket bölme states
  const [showBulkSplitModal, setShowBulkSplitModal] = useState(false);
  const [selectedPackagesForBulkSplit, setSelectedPackagesForBulkSplit] =
    useState<ShipmentPackage[]>([]);

  // Unsupplied items states
  const [showUnsuppliedItemsModal, setShowUnsuppliedItemsModal] =
    useState(false);
  const [selectedPackageForUnsupplied, setSelectedPackageForUnsupplied] =
    useState<ShipmentPackage | null>(null);

  // Delete invoice states
  const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
  const [selectedPackageForDelete, setSelectedPackageForDelete] =
    useState<ShipmentPackage | null>(null);

  // Frontend filter states
  const [customerName, setCustomerName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [packageNumber, setPackageNumber] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cargoCode, setCargoCode] = useState("");
  const [productName, setProductName] = useState("");
  const [supplyPeriodStatus, setSupplyPeriodStatus] = useState("");
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Hooks
  const { getShipmentPackages, isPending: isLoadingPackages } =
    useGetShipmentPackages();
  const { updateShipmentPackageStatus, isPending: isUpdatingStatus } =
    useUpdateShipmentPackageStatus();
  const { updateTrackingNumber, isPending: isUpdatingTracking } =
    useUpdateTrackingNumber();
  const { userProfile } = useAuth();
  const { getTrendyolCountries, isPending: isLoadingCountries } =
    useGetTrendyolCountries();
  const { splitMultiPackageByQuantity, isPending: isSplittingPackage } =
    useSplitMultiPackageByQuantity();
  const { splitShipmentPackage, isPending: isSplittingShipment } =
    useSplitShipmentPackage();
  const { splitShipmentPackageByQuantity, isPending: isSplittingByQuantity } =
    useSplitShipmentPackageByQuantity();
  const { splitShipmentPackageMultiGroup, isPending: isSplittingMultiGroup } =
    useSplitShipmentPackageMultiGroup();
  const { deleteInvoiceLink, isPending: isDeletingInvoice } =
    useDeleteInvoiceLink();

  // Excel export state
  const [isExporting, setIsExporting] = useState(false);

  // Data state
  const [packagesData, setPackagesData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const response = await getTrendyolCountries();
      if (response.data) {
        // API response'dan data array'ini al
        setCountries(response.data);
      }
    } catch (error) {
      // Error handling - hook içinde toast mesajı var
    }
  };

  // Fetch packages
  const fetchPackages = async () => {
    try {
      // Dokümana göre: maksimum 3 aylık geçmişe dönük sorgu yapılabilir
      const maxDateRange = 90 * 24 * 60 * 60 * 1000; // 90 gün

      const requestParams: GetShipmentPackagesRequest = {
        // Sadece API'de desteklenen parametreleri gönder
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: currentPage - 1,
        size: Math.min(itemsPerPage, 200), // Dokümana göre maksimum 200
        supplierId: filters.supplierId,
        orderNumber: orderNumber,
        status: filters.status,
        orderByField: filters.orderByField || "PackageLastModifiedDate",
        orderByDirection: filters.orderByDirection || "DESC",
        shipmentPackageIds: filters.shipmentPackageIds,
      };

      // Ülke filtresi ekle (eğer seçilmişse)
      if (selectedCountry) {
        // Burada ülke filtresi için gerekli API parametresi eklenebilir
        // Şimdilik frontend'de filtreleme yapılıyor
      }

      // Add date filters if provided
      if (startDate) {
        const startTimestamp = new Date(startDate).getTime();
        requestParams.startDate = startTimestamp;
      }
      if (endDate) {
        // Set end date to end of day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        requestParams.endDate = endDateTime.getTime();
      }

      // Dokümana göre: Tarih parametresi verilmezse son 1 hafta, verilirse maksimum 2 hafta
      if (!startDate && !endDate) {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        requestParams.startDate = oneWeekAgo;
        requestParams.endDate = Date.now();
      } else if (startDate && endDate) {
        const startTime = new Date(startDate).getTime();
        const endTime = new Date(endDate).getTime();
        const diffDays = (endTime - startTime) / (1000 * 60 * 60 * 24);

        if (diffDays > 14) {
          // Maksimum 2 hafta olmalı
          const maxEndDate = new Date(startTime + 14 * 24 * 60 * 60 * 1000);
          requestParams.endDate = maxEndDate.getTime();
          toast.error(
            "Tarih aralığı maksimum 2 hafta olabilir. 2 hafta olarak ayarlandı."
          );
        }
      }

      // Dokümana göre: supplierId zorunlu
      if (!requestParams.supplierId || requestParams.supplierId === 0) {
        // Kullanıcı bilgilerinden supplierId alınmalı
        // TODO: Gerçek supplierId kullanıcı bilgilerinden alınmalı
        // Şimdilik geçici olarak 1 kullanıyoruz
        requestParams.supplierId = 1;
      }

      // Dokümana göre: Status parametresi doğru kullanım
      if (selectedStatus !== "All") {
        requestParams.status = selectedStatus;
      }

      const response = await getShipmentPackages(requestParams);
      setPackagesData(response);
    } catch (error) {
      toast.error("Sipariş paketleri yüklenirken hata oluştu!");
      // Set empty data on error to prevent crashes
      setPackagesData({
        data: { content: [], totalElements: 0, totalPages: 0 },
      });
    }
  };

  // Effects
  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [
    currentPage,
    selectedStatus,
    orderNumber,
    startDate,
    endDate,
    selectedCountry,
    itemsPerPage,
  ]);

  // Update totalCount and totalPages when packagesData changes
  useEffect(() => {
    if (packagesData?.data) {
      setTotalCount(packagesData.data.totalElements || 0);
      setTotalPages(packagesData.data.totalPages || 0);
    }
  }, [packagesData]);

  // Sync itemsPerPage with filters.size
  useEffect(() => {
    setFilters((prev) => ({ ...prev, size: itemsPerPage }));
  }, [itemsPerPage]);

  // Sync filters.size with itemsPerPage when filters change
  useEffect(() => {
    if (filters.size && filters.size !== itemsPerPage) {
      setItemsPerPage(filters.size);
    }
  }, [filters.size]);

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter packages on frontend based on customer name and other fields
  const filteredPackages = (packagesData?.data?.content || []).filter(
    (pkg: ShipmentPackage) => {
      // First filter out UnPacked packages (like Trendyol does)
      if (pkg.status === "UnPacked") {
        return false;
      }

      if (
        customerName &&
        !`${pkg.shipmentAddress?.firstName || ""} ${pkg.shipmentAddress?.lastName || ""
          }`
          .toLowerCase()
          .includes(customerName.toLowerCase())
      ) {
        return false;
      }
      if (packageNumber && !pkg.id.toString().includes(packageNumber)) {
        return false;
      }
      if (
        barcode &&
        !pkg.lines?.some((line) => line.barcode?.includes(barcode))
      ) {
        return false;
      }
      if (
        productName &&
        !pkg.lines?.some(
          (line) =>
            line.productName
              ?.toLowerCase()
              .includes(productName.toLowerCase()) ||
            line.merchantSku?.toLowerCase().includes(productName.toLowerCase())
        )
      ) {
        return false;
      }
      // Ülke filtresi - InvoiceAddress.countryCode ile filtreleme
      if (selectedCountry) {
        // Daha esnek ülke eşleme - hem tam isim hem de benzer isimler için ara
        let selectedCountryData = countries.find(
          (country) => country.name === selectedCountry
        );

        // Eğer bulunamadıysa, alternative mapping'ler dene
        if (!selectedCountryData) {
          if (selectedCountry === "Azerbaycan") {
            // "Azerbaycan" seçilmişse "Azərbaycan" ara
            selectedCountryData = countries.find(
              (country) =>
                country.name === "Azərbaycan" || country.code === "AZ"
            );
          }
          // Diğer ülkeler için de benzer mapping'ler eklenebilir
        }

        if (
          selectedCountryData &&
          pkg.invoiceAddress?.countryCode !== selectedCountryData.code
        ) {
          return false;
        }
      }
      return true;
    }
  );

  // Calculate status counts (excluding UnPacked packages)
  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      All: filteredPackages.length, // filteredPackages already excludes UnPacked
      Created: filteredPackages.filter(
        (p: ShipmentPackage) => p.status === "Created"
      ).length,
      Picking: filteredPackages.filter(
        (p: ShipmentPackage) => p.status === "Picking"
      ).length,
      Shipped: filteredPackages.filter(
        (p: ShipmentPackage) => p.status === "Shipped"
      ).length,
      Delivered: filteredPackages.filter(
        (p: ShipmentPackage) => p.status === "Delivered"
      ).length,
      Returned: filteredPackages.filter(
        (p: ShipmentPackage) => p.status === "Returned"
      ).length,
      UnSupplied: filteredPackages.filter(
        (p: ShipmentPackage) => p.status === "UnSupplied"
      ).length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Handle filter changes
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status === "All") {
      setFilters((prev) => ({ ...prev, status: undefined }));
    } else {
      setFilters((prev) => ({ ...prev, status }));
    }
    setCurrentPage(1);

    // Status değiştiğinde toplu işlem seçimlerini resetle
    // Çünkü farklı status'taki paketler için farklı işlemler yapılabilir
    if (selectedPackages.size > 0) {
      setSelectedPackages(new Set());
      toast.success("Status değiştiği için toplu işlem seçimleri temizlendi");
    }
  };

  const handleSearch = (value: string) => {
    setOrderNumber(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setOrderNumber("");
    setCustomerName("");
    setPackageNumber("");
    setBarcode("");
    setCargoCode("");
    setProductName("");
    setSupplyPeriodStatus("");
    setSelectedStatus("Created");
    setStartDate("");
    setEndDate("");
    setSelectedCountry("");
    setCountrySearchTerm("");
    setItemsPerPage(20);
    // Filtreler temizlendiğinde seçimleri de temizle
    setSelectedPackages(new Set());
    setFilters({
      page: 0,
      size: 20,
      supplierId: 1, // Sadece gerekli alanlar
      // Diğer alanlar opsiyonel, default değer atanmamalı
    });
    setCurrentPage(1);
  };

  // Checkbox handlers
  const handleSelectPackage = (packageId: number) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(packageId)) {
      newSelected.delete(packageId);
    } else {
      newSelected.add(packageId);
    }
    setSelectedPackages(newSelected);
  };

  const handleSelectAll = () => {
    // displayPackages kullanarak mevcut görüntülenen paketleri al
    const packages = displayPackages || [];

    // Eğer tüm görüntülenen paketler zaten seçiliyse, seçimi kaldır
    if (selectedPackages.size === packages.length && packages.length > 0) {
      setSelectedPackages(new Set());
    } else {
      // Eğer tüm paketler seçili değilse, tümünü seç
      const allPackageIds = packages.map((pkg: ShipmentPackage) => pkg.id);
      setSelectedPackages(new Set(allPackageIds));
    }
  };

  // Modal handlers
  const openStatusModal = (pkg: ShipmentPackage) => {
    setSelectedPackage(pkg);
    setNewStatus(pkg.status);
    setModalType("status");
    $("#statusModal").modal("show");
  };

  const openTrackingModal = (pkg: ShipmentPackage) => {
    setSelectedPackage(pkg);
    setNewTrackingNumber(pkg.cargoTrackingNumber || "");
    setModalType("tracking");
    $("#trackingModal").modal("show");
  };

  const handleUpdateStatus = async () => {
    if (!selectedPackage || !newStatus) return;

    try {
      // Prepare lines data according to Trendyol API documentation
      const lines =
        selectedPackage.lines?.map((line) => ({
          lineId: line.id,
          quantity: line.quantity,
        })) || [];

      // Only include lines and params for Picking and Invoiced statuses
      const updateRequest =
        newStatus === "Picking" || newStatus === "Invoiced"
          ? {
            status: newStatus,
            lines: lines,
            params: {},
          }
          : {
            status: newStatus,
          };

      await updateShipmentPackageStatus(selectedPackage.id, updateRequest);
      $("#statusModal").modal("hide");
      fetchPackages(); // Refresh data
    } catch (error) {
      // Hook içinde zaten toast mesajı gösteriliyor
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedPackage || !newTrackingNumber) return;

    try {
      await updateTrackingNumber(selectedPackage.id, {
        trackingNumber: newTrackingNumber,
      });
      $("#trackingModal").modal("hide");
      fetchPackages(); // Refresh data
    } catch (error) {
      // Hook içinde zaten toast mesajı gösteriliyor
    }
  };

  // Split package handlers
  const openSplitPackageModal = (pkg: ShipmentPackage) => {
    const packageLines = pkg.lines || [];
    const isSingleProduct = packageLines.length === 1;
    const totalQuantity =
      packageLines.reduce((sum, line) => sum + line.quantity, 0) || 1;

    // Hiç ürün yoksa
    if (packageLines.length === 0) {
      toast.error("Bu pakette ürün bulunmuyor");
      return;
    }

    // Tek ürün ve 1 adet ise bölme yapılamaz
    if (isSingleProduct && totalQuantity <= 1) {
      toast.error("Bu paket bölünecek kadar ürün içermiyor");
      return;
    }

    // Genel kontrol: toplam adet 1 veya daha azsa
    if (totalQuantity <= 1) {
      toast.error("Bu paket bölünecek kadar ürün içermiyor");
      return;
    }

    setSelectedPackageForSplit(pkg);
    setShowSplitPackageModal(true);
    // Bootstrap modal açma
    setTimeout(() => {
      $("#splitPackageModal").modal("show");
    }, 100);
  };

  // Toplu paket bölme işlemi
  const handleBulkSplitPackages = () => {
    if (selectedPackages.size === 0) {
      toast.error("Lütfen bölünecek paketleri seçin");
      return;
    }

    // Seçili paketleri al
    const selectedPackageList = Array.from(selectedPackages)
      .map((packageId) =>
        displayPackages.find((pkg: ShipmentPackage) => pkg.id === packageId)
      )
      .filter(Boolean) as ShipmentPackage[];

    if (selectedPackageList.length === 0) {
      toast.error("Seçili paketler bulunamadı");
      return;
    }

    // Her paket için bölme kontrolü yap
    const validPackages = selectedPackageList.filter((pkg) => {
      const packageLines = pkg.lines || [];
      const totalQuantity =
        packageLines.reduce((sum, line) => sum + line.quantity, 0) || 1;

      if (packageLines.length === 0) {
        toast.error(`Paket #${pkg.id}: Bu pakette ürün bulunmuyor`);
        return false;
      }

      if (totalQuantity <= 1) {
        toast.error(
          `Paket #${pkg.id}: Bu paket bölünecek kadar ürün içermiyor`
        );
        return false;
      }

      return true;
    });

    if (validPackages.length === 0) {
      toast.error("Bölünebilecek paket bulunamadı");
      return;
    }

    // Toplu bölme onay modal'ını aç
    setSelectedPackagesForBulkSplit(validPackages);
    setShowBulkSplitModal(true);
  };

  // Paket için hangi split API'sini kullanacağını belirleyen yardımcı fonksiyon
  const getOptimalSplitStrategy = (pkg: ShipmentPackage) => {
    const packageLines = pkg.lines || [];
    const isSingleProduct = packageLines.length === 1;
    const totalQuantity = packageLines.reduce(
      (sum, line) => sum + (line.quantity || 1),
      0
    );

    // Tek Ürün mü?
    if (isSingleProduct) {
      const singleLine = packageLines[0];
      // Miktar > 1 mi?
      if (singleLine.quantity > 1) {
        // quantity-split kullan
        const splitQuantity = Math.floor(singleLine.quantity / 2);
        return {
          strategy: "quantity-split",
          api: "splitShipmentPackageByQuantity",
          data: {
            quantitySplit: [
              {
                orderLineId: singleLine.id,
                quantities: [
                  splitQuantity,
                  singleLine.quantity - splitQuantity,
                ],
              },
            ],
          },
        };
      } else {
        // Bölme yapılamaz
        return null;
      }
    } else {
      // Çoklu Ürün
      const halfLines = packageLines.slice(
        0,
        Math.ceil(packageLines.length / 2)
      );

      // Az ürün seçildi mi?
      if (halfLines.length <= Math.ceil(packageLines.length / 2)) {
        // splitShipmentPackage kullan
        return {
          strategy: "simple-split",
          api: "splitShipmentPackage",
          data: {
            orderLineIds: halfLines.map((line) => line.id),
          },
        };
      } else {
        // Çok ürün var -> splitMultiPackageByQuantity kullan
        return {
          strategy: "multi-package-split",
          api: "splitMultiPackageByQuantity",
          data: {
            splitPackages: [
              {
                packageDetails: halfLines.map((line) => ({
                  orderLineId: line.id,
                  quantities: 1, // Varsayılan olarak 1 adet
                })),
              },
            ],
          },
        };
      }
    }
  };

  // Toplu bölme işlemi - Akıllı strateji kullanarak
  const handleBulkSplitOperation = async (packages: ShipmentPackage[]) => {
    try {
      // Her paket için optimal strateji belirle ve uygula
      const splitPromises = packages.map(async (pkg) => {
        const strategy = getOptimalSplitStrategy(pkg);

        if (!strategy) {
          return null;
        }

        // Strateji'ye göre uygun API'yi çağır
        switch (strategy.api) {
          case "splitShipmentPackageByQuantity":
            return await splitShipmentPackageByQuantity(
              pkg.id,
              strategy.data as SplitShipmentPackageByQuantityRequest
            );

          case "splitShipmentPackage":
            return await splitShipmentPackage(
              pkg.id,
              strategy.data as SplitShipmentPackageRequest
            );

          case "splitMultiPackageByQuantity":
            return await splitMultiPackageByQuantity(
              pkg.id,
              strategy.data as SplitMultiPackageByQuantityRequest
            );

          default:
            return null;
        }
      });

      // Tüm bölme işlemlerini paralel olarak yap
      const results = await Promise.all(splitPromises);
      const successfulSplits = results.filter(
        (result) => result !== null
      ).length;

      if (successfulSplits > 0) {
        toast.success(`${successfulSplits} paket başarıyla bölündü`);
        // Seçimleri temizle ve verileri yenile
        setSelectedPackages(new Set());
        fetchPackages();
      } else {
        toast.error("Hiçbir paket bölünemedi");
      }
    } catch (error) {
      toast.error("Toplu paket bölme işlemi sırasında hata oluştu");
    }
  };

  const handleSplitPackage = (quantities: { [lineId: number]: number }) => {
    setSplitQuantities(quantities);
    setShowSplitPackageModal(false);
    setShowSplitConfirmationModal(true);
  };

  const handleConfirmSplit = async () => {
    // Bu fonksiyon artık sadece success callback olarak kullanılıyor
    // Actual split işlemi SplitConfirmationModal içinde yapılıyor
    closeSplitModals();
    fetchPackages(); // Refresh data
  };

  const closeSplitModals = () => {
    $("#splitPackageModal").modal("hide");
    $("#splitConfirmationModal").modal("hide");
    setShowSplitPackageModal(false);
    setShowSplitConfirmationModal(false);
    setSelectedPackageForSplit(null);
    setSplitQuantities({});
  };

  // Handle Excel export with validation and dynamic data fetching
  const handleExcelExport = async () => {
    try {
      // Validate date range
      if (!startDate || !endDate) {
        toast.error("Excel indirmek için tarih aralığı belirtmelisiniz!");
        return;
      }

      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();

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
      let totalElementsToFetch = totalCount;

      // If we don't have total count, make a small request to get it
      if (!totalElementsToFetch) {
        const countRequest: GetShipmentPackagesRequest = {
          startDate: startTime,
          endDate: endTime,
          page: 0,
          size: 1, // Just get count
          supplierId: filters.supplierId || 1,
          orderNumber: orderNumber || undefined,
          status: selectedStatus === "All" ? undefined : selectedStatus,
          orderByField: filters.orderByField || "PackageLastModifiedDate",
          orderByDirection: filters.orderByDirection || "DESC",
          shipmentPackageIds: filters.shipmentPackageIds,
        };

        const countResponse = await getShipmentPackages(countRequest);
        totalElementsToFetch = countResponse.data?.totalElements || 0;
      }

      if (totalElementsToFetch === 0) {
        toast.error("İndirilecek veri bulunamadı!");
        setIsExporting(false);
        return;
      }

      // Prepare request to fetch ALL data (set size to totalElements)
      const allDataRequest: GetShipmentPackagesRequest = {
        startDate: startTime,
        endDate: endTime,
        page: 0,
        size: Math.min(totalElementsToFetch, 200), // API maximum is 200
        supplierId: filters.supplierId || 1,
        orderNumber: orderNumber || undefined,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        orderByField: filters.orderByField || "PackageLastModifiedDate",
        orderByDirection: filters.orderByDirection || "DESC",
        shipmentPackageIds: filters.shipmentPackageIds,
      };

      // If we need more than 200 records, we'll need to make multiple requests
      const allPackages: ShipmentPackage[] = [];
      const totalPages = Math.ceil(totalElementsToFetch / 200);

      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        const pageRequest = {
          ...allDataRequest,
          page: pageIndex,
          size: Math.min(200, totalElementsToFetch - pageIndex * 200),
        };

        const pageResponse = await getShipmentPackages(pageRequest);
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
      excelData.push([
        "Sipariş No",
        "Paket No",
        "Tarih",
        "Müşteri Adı",
        "Müşteri Soyadı",
        "Ülke",
        "Şehir",
        "İlçe",
        "Adres",
        "Ürün Adı",
        "Barkod",
        "SKU",
        "Renk",
        "Beden",
        "Adet",
        "Birim Fiyat",
        "Toplam Fiyat",
        "İndirim",
        "Durum",
        "Kargo Takip No",
        "Kargo Firması",
        "Fatura Adresi",
        "Vergi No",
      ]);

      // Add data rows
      allPackages.forEach((pkg) => {
        if (pkg.lines && pkg.lines.length > 0) {
          // For each product in the package
          pkg.lines.forEach((line) => {
            excelData.push([
              pkg.orderNumber,
              pkg.id,
              new Date(pkg.orderDate).toLocaleDateString("tr-TR"),
              pkg.shipmentAddress?.firstName || "",
              pkg.shipmentAddress?.lastName || "",
              pkg.invoiceAddress?.countryCode || "",
              pkg.shipmentAddress?.city || "",
              pkg.shipmentAddress?.district || "",
              pkg.shipmentAddress?.fullAddress || "",
              line.productName || "",
              line.barcode || "",
              line.merchantSku || "",
              line.productColor || "",
              line.productSize || "",
              line.quantity,
              line.price,
              line.amount,
              line.discount,
              getStatusDisplayText(pkg.status),
              pkg.cargoTrackingNumber || "",
              getCargoCompany(
                pkg.cargoTrackingNumber || "",
                pkg.cargoProviderName
              ),
              `${pkg.invoiceAddress?.firstName || ""} ${pkg.invoiceAddress?.lastName || ""
              }, ${pkg.invoiceAddress?.fullAddress || ""}`,
              pkg.invoiceAddress?.taxNumber || pkg.taxNumber || "",
            ]);
          });
        } else {
          // If no products, add package info only
          excelData.push([
            pkg.orderNumber,
            pkg.id,
            new Date(pkg.orderDate).toLocaleDateString("tr-TR"),
            pkg.shipmentAddress?.firstName || "",
            pkg.shipmentAddress?.lastName || "",
            pkg.invoiceAddress?.countryCode || "",
            pkg.shipmentAddress?.city || "",
            pkg.shipmentAddress?.district || "",
            pkg.shipmentAddress?.fullAddress || "",
            "",
            "",
            "",
            "",
            "",
            0,
            0,
            pkg.totalPrice,
            pkg.totalDiscount,
            getStatusDisplayText(pkg.status),
            pkg.cargoTrackingNumber || "",
            getCargoCompany(
              pkg.cargoTrackingNumber || "",
              pkg.cargoProviderName
            ),
            `${pkg.invoiceAddress?.firstName || ""} ${pkg.invoiceAddress?.lastName || ""
            }, ${pkg.invoiceAddress?.fullAddress || ""}`,
            pkg.invoiceAddress?.taxNumber || pkg.taxNumber || "",
          ]);
        }
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Sipariş No
        { wch: 10 }, // Paket No
        { wch: 12 }, // Tarih
        { wch: 15 }, // Müşteri Adı
        { wch: 15 }, // Müşteri Soyadı
        { wch: 8 }, // Ülke
        { wch: 15 }, // Şehir
        { wch: 15 }, // İlçe
        { wch: 30 }, // Adres
        { wch: 25 }, // Ürün Adı
        { wch: 15 }, // Barkod
        { wch: 15 }, // SKU
        { wch: 10 }, // Renk
        { wch: 10 }, // Beden
        { wch: 8 }, // Adet
        { wch: 12 }, // Birim Fiyat
        { wch: 12 }, // Toplam Fiyat
        { wch: 10 }, // İndirim
        { wch: 12 }, // Durum
        { wch: 15 }, // Kargo Takip No
        { wch: 15 }, // Kargo Firması
        { wch: 30 }, // Fatura Adresi
        { wch: 15 }, // Vergi No
      ];
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
      const filename = `Siparisleriniz_${startDateStr}-${endDateStr}_${todayStr}.xlsx`;

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

  // Handle "İşleme Al" (Process) action
  const handleProcessPackage = async (pkg: ShipmentPackage) => {
    try {
      // Prepare lines data according to Trendyol API documentation
      const lines =
        pkg.lines?.map((line) => ({
          lineId: line.id,
          quantity: line.quantity,
        })) || [];

      await updateShipmentPackageStatus(pkg.id, {
        status: "Picking",
        lines: lines,
        params: {},
      });

      fetchPackages(); // Refresh data
    } catch (error) {
      // Error handling is already done in the hook
    }
  };

  // Pagination - Use correct API response values
  const packages = packagesData?.data?.content || [];

  // Group packages by order number - same order number should be grouped together
  const groupPackagesByOrderNumber = (packages: ShipmentPackage[]) => {
    const grouped: { [orderNumber: string]: ShipmentPackage[] } = {};
    packages.forEach((pkg) => {
      if (!grouped[pkg.orderNumber]) {
        grouped[pkg.orderNumber] = [];
      }
      grouped[pkg.orderNumber].push(pkg);
    });
    return grouped;
  };

  // Use filtered packages for display - but show raw data when possible
  // Frontend filtering should only be applied to the current page data
  const displayPackages =
    selectedStatus === "All"
      ? filteredPackages
      : filteredPackages.filter(
        (p: ShipmentPackage) => p.status === selectedStatus
      );

  // Frontend filtreleme aktif mi kontrol et
  const isFrontendFilteringActive =
    customerName || packageNumber || barcode || productName || selectedCountry;

  // Pagination için doğru sayfa sayısını hesapla
  // Frontend filtreleme aktifse, filtrelenmiş veri sayısına göre sayfa hesapla
  // Değilse API'den gelen toplam sayfa sayısını kullan
  const effectiveTotalCount = isFrontendFilteringActive
    ? displayPackages.length
    : totalCount;
  const effectiveTotalPages = Math.ceil(effectiveTotalCount / itemsPerPage);

  // Pagination için kullanılacak sayfa sayısı
  const paginationTotalPages = isFrontendFilteringActive
    ? effectiveTotalPages
    : totalPages;

  // Group the display packages by order number
  const groupedPackages = groupPackagesByOrderNumber(displayPackages);

  // Generate table rows based on package lines logic
  // Each package creates multiple rows based on its lines (products)
  // Package information (ID, status, cargo tracking, total price) only shows in the first row
  // Other product rows have empty package columns for visual grouping
  interface TableRow {
    packageId: number;
    orderNumber: string;
    isFirstRowInPackage: boolean;
    isFirstRowInOrder: boolean;
    packageRowSpan: number;
    orderRowSpan: number;
    package: ShipmentPackage;
    line: any | null; // Product line (can be null if no lines exist)
    lineIndex: number; // Index within the package
  }

  const generateTableRows = (): TableRow[] => {
    const rows: TableRow[] = [];

    Object.entries(groupedPackages).forEach(([orderNumber, orderPackages]) => {
      orderPackages.forEach((pkg, packageIndex) => {
        const packageLines = pkg.lines || [];
        const packageRowSpan = Math.max(1, packageLines.length);

        // If no lines exist, create a single row with the package info
        if (packageLines.length === 0) {
          const row: TableRow = {
            packageId: pkg.id,
            orderNumber: pkg.orderNumber,
            isFirstRowInPackage: true,
            isFirstRowInOrder: true, // Her paket kendi sipariş bilgilerini gösterir
            packageRowSpan: 1,
            orderRowSpan: 1, // Her paket için ayrı rowspan
            package: pkg,
            line: null,
            lineIndex: 0,
          };
          rows.push(row);
        } else {
          // Create rows for each product line
          packageLines.forEach((line, lineIndex) => {
            const row: TableRow = {
              packageId: pkg.id,
              orderNumber: pkg.orderNumber,
              isFirstRowInPackage: lineIndex === 0,
              isFirstRowInOrder: lineIndex === 0, // Her paketin ilk satırında sipariş bilgileri
              packageRowSpan: packageRowSpan,
              orderRowSpan: packageRowSpan, // Paket rowspan'i ile aynı
              package: pkg,
              line: line,
              lineIndex: lineIndex,
            };

            rows.push(row);
          });
        }
      });
    });

    return rows;
  };

  const tableRows = generateTableRows();

  // Calculate correct display counts
  // API'den gelen ham veri sayısı (pagination için)
  const apiPageSize = packages.length;
  // Frontend filtrelenmiş veri sayısı (görüntüleme için)
  const filteredDisplayCount = displayPackages.length;

  // Eğer frontend filtreleme aktifse, filtrelenmiş sayıyı göster
  // Değilse API sayfa boyutunu göster
  const displayCount = isFrontendFilteringActive
    ? filteredDisplayCount
    : apiPageSize;

  const selectedCountryData = countries.find(
    (country) => country.name === selectedCountry
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // Eğer frontend filtreleme aktifse ve sayfa değişiyorsa, filtreleri temizle
    // Çünkü frontend filtreleme sadece mevcut sayfa verilerinde çalışır
    if (isFrontendFilteringActive && pageNumber !== currentPage) {
      // Filtreleri temizle ve API'den yeni veri çek
      handleClearFilters();
      return;
    }

    // Sayfa değiştiğinde otomatik olarak veriler yüklenir (useEffect sayesinde)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Tarih belirtilmemiş";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Geçersiz tarih";

    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateLong = (timestamp: number) => {
    if (!timestamp) return "Tarih belirtilmemiş";

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Geçersiz tarih";

    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Kargo şirketi tanıma fonksiyonu
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

  // Kalan süre hesaplama fonksiyonu
  const calculateRemainingTime = (agreedDeliveryDate?: number) => {
    if (!agreedDeliveryDate) return "Süre belirtilmemiş";

    const now = Date.now();
    const remaining = agreedDeliveryDate - now;

    if (remaining <= 0) return "Süre doldu";

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} gün ${hours} saat ${minutes} dakika`;
    } else if (hours > 0) {
      return `${hours} saat ${minutes} dakika`;
    } else {
      return `${minutes} dakika`;
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopyalandı!");
  };

  // Sorting function
  const handleSortChange = (
    newSortBy: string,
    newDirection: "ASC" | "DESC" | null
  ) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection || "DESC");
    setFilters((prev) => ({
      ...prev,
      orderByField:
        newSortBy === "orderDate" ? "PackageLastModifiedDate" : newSortBy,
      orderByDirection: newDirection,
    }));
    // Sıralama değiştiğinde ilk sayfaya dön ve otomatik filtrele
    setCurrentPage(1);
  };

  // Unsupplied Items handlers
  const handleCancelItems = (pkg: ShipmentPackage) => {
    setSelectedPackageForUnsupplied(pkg);
    setShowUnsuppliedItemsModal(true);
  };

  const handleUnsuppliedSuccess = () => {
    // Refresh the packages list after successful cancellation
    // Use the existing fetchPackages function to ensure proper parameters
    fetchPackages();
    setSelectedPackageForUnsupplied(null);
    setShowUnsuppliedItemsModal(false);
  };

  const getSortDisplayText = () => {
    if (sortBy === "orderDate" && sortDirection === "DESC") {
      return "Sipariş Tarihi (Yeniden Eskiye)";
    } else if (sortBy === "orderDate" && sortDirection === "ASC") {
      return "Sipariş Tarihi (Eskiden Yeniye)";
    }
    return "Sipariş Tarihi (Yeniden Eskiye)";
  };

  // Kargo durumu için badge class'ı
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Created":
        return "bg-primary";
      case "Picking":
        return "bg-warning";
      case "Shipped":
        return "bg-info";
      case "Delivered":
        return "bg-success";
      case "Returned":
        return "bg-secondary";
      case "UnSupplied":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Kargo durumu için görüntüleme metni
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

  // Delete invoice handlers
  const handleDeleteInvoice = (pkg: ShipmentPackage) => {
    setSelectedPackageForDelete(pkg);
    setShowDeleteInvoiceModal(true);
  };

  const handleConfirmDeleteInvoice = async () => {
    if (!selectedPackageForDelete) return;

    try {
      await deleteInvoiceLink({
        shipmentPackageId: selectedPackageForDelete.id,
        customerId: selectedPackageForDelete.customerId,
      });

      // Close modal and refresh data
      setShowDeleteInvoiceModal(false);
      setSelectedPackageForDelete(null);
      fetchPackages();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleCloseDeleteInvoiceModal = () => {
    setShowDeleteInvoiceModal(false);
    setSelectedPackageForDelete(null);
  };

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Status Tabs */}
        <div className="mb-4">
          <div className="d-flex">
            {statusTabs.map((tab) => (
              <div key={tab.key} className="position-relative me-4">
                <button
                  className={`btn btn-link text-decoration-none px-0 py-2 border-0 ${selectedStatus === tab.key
                      ? "text-primary fw-bold"
                      : "text-muted"
                    }`}
                  onClick={() => handleStatusChange(tab.key)}
                  style={{ borderRadius: 0, background: "none" }}
                >
                  <div className="d-flex flex-column align-items-start">
                    <div className="d-flex align-items-center">
                      <span style={{ fontSize: "0.9rem" }}>{tab.label}</span>
                      {tab.hasInfo && (
                        <i
                          className="bx bx-info-circle ms-1"
                          style={{ fontSize: "0.8rem" }}
                        ></i>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#666",
                        marginTop: "2px",
                      }}
                    >
                      {statusCounts[tab.key]} Paket
                    </div>
                  </div>
                </button>
                {selectedStatus === tab.key && (
                  <div
                    className="position-absolute"
                    style={{
                      bottom: "0",
                      left: "0",
                      right: "0",
                      height: "2px",
                      backgroundColor: "#ff6600",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <hr className="my-0" style={{ borderColor: "#dee2e6" }} />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="row g-2">
            <div className="col-md-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Müşteri Adı"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Sipariş No"
                value={orderNumber}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Paket No"
                value={packageNumber}
                onChange={(e) => {
                  setPackageNumber(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Barkod"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Kargo Kodu"
                value={cargoCode}
                onChange={(e) => {
                  setCargoCode(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ürün Adı / Model Kodu"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={supplyPeriodStatus}
                onChange={(e) => {
                  setSupplyPeriodStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tedarik Süresi Durumu</option>
                <option value="normal">Normal</option>
                <option value="hizli">Hızlı</option>
                <option value="acil">Acil</option>
              </select>
            </div>
            <div className="col-md-2 position-relative">
              <input
                type="date"
                className={`form-control form-control-sm ${!startDate ? "border-warning" : ""
                  }`}
                placeholder="Sipariş Başlangıç Tarihi"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                title="Excel indirmek için bu alan zorunludur"
              />
              {!startDate && (
                <small
                  className="text-warning position-absolute"
                  style={{ fontSize: "0.7rem", bottom: "-18px", left: "0" }}
                >
                  <i className="bx bx-info-circle me-1"></i>Excel için gerekli
                </small>
              )}
            </div>
            <div className="col-md-2 position-relative">
              <input
                type="date"
                className={`form-control form-control-sm ${!endDate ? "border-warning" : ""
                  }`}
                placeholder="Sipariş Bitiş Tarihi"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                title="Excel indirmek için bu alan zorunludur"
              />
              {!endDate && (
                <small
                  className="text-warning position-absolute"
                  style={{ fontSize: "0.7rem", bottom: "-18px", left: "0" }}
                >
                  <i className="bx bx-info-circle me-1"></i>Excel için gerekli
                </small>
              )}
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={filters.orderByDirection || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters((prev) => ({
                    ...prev,
                    orderByDirection:
                      value === "" ? null : (value as "ASC" | "DESC"),
                  }));
                  setCurrentPage(1);
                }}
              >
                <option value="">Sıralama Yok</option>
                <option value="ASC">Küçükten Büyüğe</option>
                <option value="DESC">Büyükten Küçüğe</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={handleClearFilters}
              >
                Temizle
              </button>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary btn-sm w-100"
                onClick={fetchPackages}
                disabled={isLoadingPackages}
              >
                {isLoadingPackages ? "Filtreleniyor..." : "Filtrele"}
              </button>
            </div>
          </div>
        </div>

        {/* Tüm kontroller tek div içerisinde */}
        <div className="card mb-3">
          <div className="card-body py-3">
            <div className="d-flex justify-content-between align-items-start">
              {/* Sol taraf - Başlık ve dropdown'lar */}
              <div>
                <h5 className="mb-0">
                  {selectedStatus === "Created"
                    ? "Yeni"
                    : statusTabs.find((t) => t.key === selectedStatus)?.label}
                </h5>

                {/* Dropdown'lar başlığın altında */}
                <div className="d-flex gap-2 mt-2">
                  {/* Toplu İşlemler - Sadece 'Yeni' ve 'İşleme Alınanlar' durumlarında görünür */}
                  {(selectedStatus === "Created" ||
                    selectedStatus === "Picking") && (
                      <div className="dropdown">
                        <button
                          className={`btn btn-sm dropdown-toggle ${selectedPackages.size > 0
                              ? "btn-warning"
                              : "btn-secondary"
                            }`}
                          type="button"
                          data-bs-toggle={
                            selectedPackages.size > 0 ? "dropdown" : ""
                          }
                          disabled={selectedPackages.size === 0}
                          style={{ minWidth: "160px" }}
                          title={
                            selectedPackages.size === 0
                              ? "Toplu işlem için önce tablodan eleman seçin"
                              : "Toplu işlemler"
                          }
                        >
                          <i className="bx bx-layer me-1"></i>
                          Toplu İşlemler
                          {selectedPackages.size > 0 && (
                            <span className="badge bg-danger text-white ms-2 fw-bold">
                              {selectedPackages.size}
                            </span>
                          )}
                        </button>
                        {selectedPackages.size > 0 && (
                          <ul className="dropdown-menu">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="bx bx-printer me-2"></i>A4 Etiketi
                                Yazdır
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="bx bx-sticker me-2"></i>Sticker
                                Etiketi Yazdır
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  if (selectedPackages.size === 0) {
                                    toast.error(
                                      "Lütfen işleme alınacak paketleri seçin"
                                    );
                                    return;
                                  }

                                  try {
                                    // Get selected packages
                                    const selectedPackageList = Array.from(
                                      selectedPackages
                                    )
                                      .map((packageId) =>
                                        displayPackages.find(
                                          (pkg: ShipmentPackage) =>
                                            pkg.id === packageId
                                        )
                                      )
                                      .filter(Boolean) as ShipmentPackage[];

                                    // Process each package
                                    for (const pkg of selectedPackageList) {
                                      // Prepare lines data according to Trendyol API documentation
                                      const lines =
                                        pkg.lines?.map((line) => ({
                                          lineId: line.id,
                                          quantity: line.quantity,
                                        })) || [];

                                      await updateShipmentPackageStatus(pkg.id, {
                                        status: "Picking",
                                        lines: lines,
                                        params: {},
                                      });
                                    }

                                    setSelectedPackages(new Set());
                                    fetchPackages();
                                  } catch (error) {
                                    // Error handling is already done in the hook
                                  }
                                }}
                              >
                                <i className="bx bx-play me-2"></i>İşleme Al
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="bx bx-package me-2"></i>Desi/Koli
                                Bilgisi Gir
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="bx bx-truck me-2"></i>Başka Kargo
                                Firması ile Gönder
                              </a>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleBulkSplitPackages();
                                }}
                              >
                                <i className="bx bx-cut me-2"></i>Toplu Paket Böl
                              </a>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // For bulk operations, we could show a modal to select which packages to cancel
                                  // For now, let's handle single package cancellation in the dropdown below
                                }}
                              >
                                <i className="bx bx-x me-2"></i>İptal Et
                              </a>
                            </li>
                          </ul>
                        )}
                      </div>
                    )}

                  {/* Ülke Seçimi */}
                  <div className="dropdown">
                    <button
                      className="btn btn-primary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      disabled={isLoadingCountries}
                      style={{ minWidth: "120px" }}
                    >
                      <i className="bx bx-globe me-1"></i>
                      {isLoadingCountries
                        ? "Yükleniyor..."
                        : selectedCountry || "Ülke"}
                    </button>
                    <ul
                      className="dropdown-menu"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        minWidth: "250px",
                      }}
                    >
                      {/* Search Bar */}
                      <li className="px-3 py-2">
                        <div className="input-group input-group-sm country-search-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i
                              className="bx bx-search text-muted"
                              style={{ fontSize: "0.8rem" }}
                            ></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 country-search-input"
                            placeholder="Ülke ara..."
                            value={countrySearchTerm}
                            onChange={(e) =>
                              setCountrySearchTerm(e.target.value)
                            }
                            style={{ fontSize: "0.8rem" }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCountry("");
                            setCountrySearchTerm("");
                            setCurrentPage(1);
                          }}
                        >
                          Tüm Ülkeler
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      {isLoadingCountries ? (
                        <li>
                          <div className="dropdown-item text-muted">
                            Ülkeler yükleniyor...
                          </div>
                        </li>
                      ) : filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => {
                          // Azerbaijan için özel görüntüleme
                          let displayName = country.name;
                          let selectedValue = country.name;

                          if (
                            country.code === "AZ" &&
                            country.name === "Azərbaycan"
                          ) {
                            displayName = "Azerbaycan (Azərbaycan)";
                            selectedValue = "Azerbaycan";
                          }

                          return (
                            <li key={country.code}>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCountry(selectedValue);
                                  setCountrySearchTerm("");
                                  setCurrentPage(1);
                                }}
                              >
                                {displayName}
                              </a>
                            </li>
                          );
                        })
                      ) : (
                        <li>
                          <div className="dropdown-item text-muted">
                            Ülke bulunamadı
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Sipariş Tarihi Sıralama */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{ minWidth: "200px", textAlign: "left" }}
                    >
                      {getSortDisplayText()}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className={`dropdown-item ${sortBy === "orderDate" && sortDirection === "DESC"
                              ? "active"
                              : ""
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("orderDate", "DESC");
                          }}
                          style={{
                            color:
                              sortBy === "orderDate" && sortDirection === "DESC"
                                ? "#ff6600"
                                : "inherit",
                          }}
                        >
                          Sipariş Tarihi (Yeniden Eskiye)
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className={`dropdown-item ${sortBy === "orderDate" && sortDirection === "ASC"
                              ? "active"
                              : ""
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSortChange("orderDate", "ASC");
                          }}
                          style={{
                            color:
                              sortBy === "orderDate" && sortDirection === "ASC"
                                ? "#ff6600"
                                : "inherit",
                          }}
                        >
                          Sipariş Tarihi (Eskiden Yeniye)
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sağ taraf - Filtre sonuçları, Excel butonu ve sayfa kontrolleri */}
              <div className="d-flex flex-column gap-2">
                {/* Üst satır: Filtreleme sonuçları ve Excel butonu */}
                <div className="d-flex gap-3 align-items-center">
                  {/* Filtreleme sonuçları bilgisi */}
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    <div>
                      Filtreleme Sonuçları: Toplam {totalCount} sipariş bilgisi
                      ({displayCount} görüntüleniyor)
                      {isFrontendFilteringActive && (
                        <span className="text-warning ms-2">
                          <i className="bx bx-info-circle me-1"></i>
                          Frontend Filtreleme Aktif
                        </span>
                      )}
                    </div>
                    <div>
                      Son Güncelleme:{" "}
                      {new Date().toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {new Date().toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Excel ile İndir */}
                  <button
                    className={`btn btn-outline-success btn-sm ${isExporting ? "disabled" : ""
                      }`}
                    type="button"
                    onClick={handleExcelExport}
                    disabled={isExporting}
                    style={{ minWidth: "160px", border: "1px solid #d9dee3" }}
                    title={
                      !startDate || !endDate
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
                        <i
                          className="bx bx-file me-1"
                          style={{ color: "#28a745" }}
                        ></i>
                        Excel ile İndir
                      </>
                    )}
                  </button>
                </div>

                {/* Alt satır: Sayfa kontrolleri ve pagination */}
                <div className="d-flex gap-3 align-items-center">
                  {/* Sayfa başına ürün sayısı */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{ minWidth: "150px" }}
                    >
                      Her Sayfada {itemsPerPage} Ürün
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className={`dropdown-item ${itemsPerPage === 10 ? "active" : ""
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFrontendFilteringActive) {
                              toast.error(
                                "Sayfa boyutu değiştiğinde frontend filtreleri temizlendi"
                              );
                              handleClearFilters();
                            } else {
                              setItemsPerPage(10);
                              setCurrentPage(1);
                            }
                          }}
                          style={
                            itemsPerPage === 10 ? { color: "#ff6600" } : {}
                          }
                        >
                          10 Ürün
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className={`dropdown-item ${itemsPerPage === 20 ? "active" : ""
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFrontendFilteringActive) {
                              toast.error(
                                "Sayfa boyutu değiştiğinde frontend filtreleri temizlendi"
                              );
                              handleClearFilters();
                            } else {
                              setItemsPerPage(20);
                              setCurrentPage(1);
                            }
                          }}
                          style={
                            itemsPerPage === 20 ? { color: "#ff6600" } : {}
                          }
                        >
                          20 Ürün
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className={`dropdown-item ${itemsPerPage === 50 ? "active" : ""
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFrontendFilteringActive) {
                              toast.error(
                                "Sayfa boyutu değiştiğinde frontend filtreleri temizlendi"
                              );
                              handleClearFilters();
                            } else {
                              setItemsPerPage(50);
                              setCurrentPage(1);
                            }
                          }}
                          style={
                            itemsPerPage === 50 ? { color: "#ff6600" } : {}
                          }
                        >
                          50 Ürün
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className={`dropdown-item ${itemsPerPage === 100 ? "active" : ""
                            }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFrontendFilteringActive) {
                              toast.error(
                                "Sayfa boyutu değiştiğinde frontend filtreleri temizlendi"
                              );
                              handleClearFilters();
                            } else {
                              setItemsPerPage(100);
                              setCurrentPage(1);
                            }
                          }}
                          style={
                            itemsPerPage === 100 ? { color: "#ff6600" } : {}
                          }
                        >
                          100 Ürün
                        </a>
                      </li>
                      {isFrontendFilteringActive && (
                        <>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <div
                              className="dropdown-item text-warning"
                              style={{ fontSize: "0.75rem" }}
                            >
                              <i className="bx bx-exclamation-triangle me-1"></i>
                              Frontend filtreleme aktif - sayfa boyutu
                              değiştiğinde filtreler temizlenir
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Pagination kontrolleri */}
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="bx bx-chevron-left"></i>
                    </button>
                    <div className="d-flex gap-1">
                      {(() => {
                        const maxVisiblePages = 5;
                        const startPage = Math.max(
                          1,
                          currentPage - Math.floor(maxVisiblePages / 2)
                        );
                        const endPage = Math.min(
                          paginationTotalPages,
                          startPage + maxVisiblePages - 1
                        );
                        const adjustedStartPage = Math.max(
                          1,
                          endPage - maxVisiblePages + 1
                        );

                        const pages = [];

                        // Show first page if not in range
                        if (adjustedStartPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              className={`btn btn-sm ${currentPage === 1
                                  ? "btn-dark"
                                  : "btn-outline-secondary"
                                }`}
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </button>
                          );
                          if (adjustedStartPage > 2) {
                            pages.push(
                              <span key="start-ellipsis" className="btn btn-sm">
                                ...
                              </span>
                            );
                          }
                        }

                        // Show page range
                        for (let i = adjustedStartPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              className={`btn btn-sm ${currentPage === i
                                  ? "btn-dark"
                                  : "btn-outline-secondary"
                                }`}
                              onClick={() => handlePageChange(i)}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Show last page if not in range
                        if (endPage < paginationTotalPages) {
                          if (endPage < paginationTotalPages - 1) {
                            pages.push(
                              <span key="end-ellipsis" className="btn btn-sm">
                                ...
                              </span>
                            );
                          }
                          pages.push(
                            <button
                              key={paginationTotalPages}
                              className={`btn btn-sm ${currentPage === paginationTotalPages
                                  ? "btn-dark"
                                  : "btn-outline-secondary"
                                }`}
                              onClick={() =>
                                handlePageChange(paginationTotalPages)
                              }
                            >
                              {paginationTotalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}
                    </div>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      disabled={currentPage >= paginationTotalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="bx bx-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Packages List */}
        {isLoadingPackages ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          </div>
        ) : displayPackages.length > 0 ? (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "1%" }}>
                        {/* Checkbox sadece 'Yeni' ve 'İşleme Alınanlar' durumlarında görünür */}
                        {(selectedStatus === "Created" ||
                          selectedStatus === "Picking") && (
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={
                                  selectedPackages.size ===
                                  displayPackages.length &&
                                  displayPackages.length > 0
                                }
                                ref={(input) => {
                                  if (input) {
                                    // indeterminate durumu: bazı paketler seçili ama hepsi değil
                                    input.indeterminate =
                                      selectedPackages.size > 0 &&
                                      selectedPackages.size <
                                      displayPackages.length;
                                  }
                                }}
                                onChange={handleSelectAll}
                              />
                            </div>
                          )}
                      </th>
                      <th style={{ width: "15%" }}>
                        Sipariş Bilgileri
                        <i className="bx bx-filter ms-1"></i>
                      </th>
                      <th style={{ width: "10%" }}>
                        Alıcı
                        <i className="bx bx-chevron-down ms-1"></i>
                      </th>
                      <th style={{ width: "18%" }}>
                        Bilgiler
                        <i className="bx bx-chevron-down ms-1"></i>
                      </th>
                      <th style={{ width: "7%" }}>
                        Birim Fiyat
                        <i className="bx bx-chevron-down ms-1"></i>
                      </th>
                      <th style={{ width: "12%" }}>
                        Kargo
                        <i className="bx bx-chevron-down ms-1"></i>
                      </th>
                      <th style={{ width: "13%" }}>
                        Fatura
                        <i className="bx bx-chevron-down ms-1"></i>
                      </th>
                      <th style={{ width: "15%" }}>
                        Durum
                        <i className="bx bx-chevron-down ms-1"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, index) => {
                      const isMicroExport =
                        row.package.invoiceAddress?.countryCode !== "TR";
                      const hasInvoiceIssue = true; // This would be determined by actual invoice status

                      return (
                        <tr key={`${row.packageId}-${row.lineIndex}`}>
                          {/* Checkbox - Sadece paket grubunun ilk satırında gösterilir ve rowspan kullanır */}
                          {row.isFirstRowInPackage && (
                            <td rowSpan={row.packageRowSpan}>
                              {(selectedStatus === "Created" ||
                                selectedStatus === "Picking") && (
                                  <div className="d-flex justify-content-center">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={selectedPackages.has(
                                        row.packageId
                                      )}
                                      onChange={() =>
                                        handleSelectPackage(row.packageId)
                                      }
                                    />
                                  </div>
                                )}
                            </td>
                          )}
                          {/* Sipariş Bilgileri - Paket grubunun ilk satırında gösterilir */}
                          {row.isFirstRowInPackage && (
                            <td rowSpan={row.packageRowSpan}>
                              <div>
                                {/* Header: Paket ikonu + Sipariş numarası + Kopya butonu */}
                                <div className="d-flex align-items-center mb-2">
                                  <div className="me-2">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M20 7L12 2L4 7V20H20V7Z"
                                        fill="#FF6B35"
                                        stroke="#FF6B35"
                                        strokeWidth="2"
                                      />
                                      <path
                                        d="M12 2V20"
                                        stroke="#FF6B35"
                                        strokeWidth="2"
                                      />
                                      <path
                                        d="M4 7L20 7"
                                        stroke="#FF6B35"
                                        strokeWidth="2"
                                      />
                                    </svg>
                                  </div>
                                  <span
                                    className="fw-bold me-2"
                                    style={{
                                      color: "#ff8c00",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    #{row.orderNumber}
                                  </span>
                                  <button
                                    className="btn btn-sm btn-link p-0"
                                    onClick={() =>
                                      copyToClipboard(row.orderNumber)
                                    }
                                    title="Kopyala"
                                  >
                                    <i className="bx bx-copy text-muted"></i>
                                  </button>
                                  {isMicroExport && (
                                    <i
                                      className="bx bx-globe ms-2 text-info"
                                      title="Mikro İhracat"
                                    ></i>
                                  )}
                                </div>

                                {/* Sipariş Tarihi */}
                                <div className="mb-2">
                                  <small
                                    className="text-muted"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    Sipariş Tarihi:{" "}
                                    {formatDate(row.package.orderDate)}
                                  </small>
                                </div>

                                {/* Paket Numarası - Paket grubunun ilk satırında gösterilir */}
                                <div className="mb-2">
                                  <small
                                    className="text-muted"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    Paket No:{" "}
                                    <span
                                      style={{
                                        fontWeight: "600",
                                        color: "#333",
                                      }}
                                    >
                                      {row.package.id}
                                    </span>
                                  </small>
                                </div>

                                {/* Gecikme Uyarısı - Resimdeki gibi kırmızı metin */}
                                {row.package.agreedDeliveryDate &&
                                  (() => {
                                    const now = Date.now();
                                    const deliveryTime =
                                      row.package.agreedDeliveryDate;
                                    const remaining = deliveryTime - now;

                                    if (remaining <= 0) {
                                      const diffDays = Math.floor(
                                        (now - deliveryTime) /
                                        (1000 * 60 * 60 * 24)
                                      );
                                      return (
                                        <div className="mt-2">
                                          <div
                                            className="text-danger"
                                            style={{
                                              fontSize: "0.8rem",
                                              fontWeight: "600",
                                            }}
                                          >
                                            Siparişiniz{" "}
                                            <span className="fw-bold">
                                              {diffDays} gün
                                            </span>{" "}
                                            gecikmiştir!
                                          </div>
                                          <div
                                            className="text-danger"
                                            style={{ fontSize: "0.8rem" }}
                                          >
                                            Siparişinizi en kısa sürede kargoya
                                            teslim etmelisiniz.
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}

                                {/* Kargo Durumu Badge */}
                                <div className="mt-2">
                                  <span
                                    className={`badge ${getStatusBadgeClass(
                                      row.package.status
                                    )}`}
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {getStatusDisplayText(row.package.status)}
                                  </span>
                                </div>

                                {/* Diğer durum bilgileri */}
                                {row.package.status === "Shipped" && (
                                  <div className="mt-2">
                                    <small
                                      className="d-block"
                                      style={{
                                        color: "#ff8c00",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      Taşıma Durumunda:{" "}
                                      <span className="fw-bold">
                                        {formatDateLong(
                                          row.package.lastModifiedDate ||
                                          row.package.orderDate
                                        )}{" "}
                                        {new Date(
                                          row.package.lastModifiedDate ||
                                          row.package.orderDate
                                        ).toLocaleTimeString("tr-TR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </small>
                                    <small
                                      className="d-block"
                                      style={{
                                        color: "#ff8c00",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      Bugün kargoya verildi
                                    </small>
                                  </div>
                                )}

                                {/* Kalan Süre - Duruma göre renk kodlaması */}
                                {row.package.agreedDeliveryDate &&
                                  (() => {
                                    const now = Date.now();
                                    const deliveryTime =
                                      row.package.agreedDeliveryDate;
                                    const remaining = deliveryTime - now;

                                    if (remaining > 0) {
                                      if (row.package.status === "Shipped") {
                                        return (
                                          <div className="mt-2">
                                            <small
                                              className="d-block"
                                              style={{
                                                color: "#ff8c00",
                                                fontSize: "0.75rem",
                                              }}
                                            >
                                              Kalan Süre:{" "}
                                              <span className="fw-bold">
                                                {calculateRemainingTime(
                                                  row.package.agreedDeliveryDate
                                                )}
                                              </span>
                                            </small>
                                          </div>
                                        );
                                      } else if (
                                        row.package.status === "Created"
                                      ) {
                                        return (
                                          <div className="mt-2">
                                            <small
                                              className="d-block"
                                              style={{
                                                color: "#007bff",
                                                fontSize: "0.75rem",
                                              }}
                                            >
                                              Kalan Süre:{" "}
                                              <span className="fw-bold">
                                                {calculateRemainingTime(
                                                  row.package.agreedDeliveryDate
                                                )}
                                              </span>
                                            </small>
                                          </div>
                                        );
                                      }
                                    }
                                    return null;
                                  })()}

                                {/* Teslim Edildi Durumu */}
                                {row.package.status === "Delivered" && (
                                  <div className="mt-2">
                                    <small
                                      className="d-block"
                                      style={{
                                        color: "#28a745",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      <i className="bx bx-check-circle me-1"></i>
                                      Teslim Edildi
                                    </small>
                                    <small
                                      className="d-block"
                                      style={{
                                        color: "#28a745",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      Teslim Tarihi:{" "}
                                      <span className="fw-bold">
                                        {formatDate(
                                          row.package.lastModifiedDate ||
                                          row.package.orderDate
                                        )}
                                      </span>
                                    </small>
                                  </div>
                                )}

                                {/* Yeniden Gönderim Durumu */}
                                {row.package.status === "Returned" && (
                                  <div className="mt-2">
                                    <button
                                      className="btn btn-primary btn-sm mb-2"
                                      style={{
                                        backgroundColor: "#6f42c1",
                                        borderColor: "#6f42c1",
                                      }}
                                    >
                                      <i className="bx bx-refresh me-1"></i>
                                      Yeniden Gönderim
                                    </button>
                                    <div
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "#666",
                                      }}
                                    >
                                      <div className="mb-1">
                                        Sayacınız durdurulmuştur.
                                      </div>
                                      <div className="mb-1">
                                        Sayaç yeniden aktifleştirildiğinde süre
                                        kaldığı yerden devam edecektir:
                                      </div>
                                      <div
                                        className="fw-bold"
                                        style={{
                                          color: "#6f42c1",
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        {row.package.agreedDeliveryDate
                                          ? calculateRemainingTime(
                                            row.package.agreedDeliveryDate
                                          )
                                          : "5 gün 23 saat 59 dakika"}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Mikro İhracat ETGB No */}
                                {isMicroExport && (
                                  <small
                                    className="d-block text-muted"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    ETGB No: -
                                  </small>
                                )}
                              </div>
                            </td>
                          )}
                          {/* Alıcı hücresi - Paket grubunun ilk satırında gösterilir */}
                          {row.isFirstRowInPackage && (
                            <td rowSpan={row.packageRowSpan}>
                              <div className="text-left">
                                <div className="d-flex align-items-center mb-1">
                                  <i className="bx bx-star text-warning me-1"></i>
                                  <span
                                    className="fw-bold"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    {row.package.shipmentAddress.firstName}{" "}
                                    {row.package.shipmentAddress.lastName}
                                  </span>
                                </div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  1. sipariş
                                </div>
                              </div>
                            </td>
                          )}
                          <td>
                            <div className="d-flex align-items-center p-2 justify-content-start">
                              {/* Product image with badge and hover tooltip */}
                              <div
                                className="position-relative me-3 product-image-container"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                  const tooltip = document.createElement("div");
                                  tooltip.className =
                                    "enhanced-product-tooltip";

                                  // Show quantity for this specific product line
                                  const productQuantity =
                                    row.line?.quantity || 1;

                                  tooltip.innerHTML = `
                                    <div class="tooltip-container">
                                      <div class="tooltip-image-only">
                                        <div class="tooltip-product-image">
                                          <img src="/assets/admin/img/marketplace/default.webp" alt="Ürün Resmi" 
                                               style="width: 180px !important; height: 220px !important; object-fit: cover; border-radius: 3px; border: 1px solid #4f94ff; box-shadow: 0 6px 18px rgba(79, 148, 255, 0.8), 0 3px 9px rgba(79, 148, 255, 0.6);">
                                        </div>
                                      </div>
                                      <div class="tooltip-arrow"></div>
                                    </div>
                                  `;

                                  // Position tooltip to the right of the product image
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  const windowWidth = window.innerWidth;
                                  const windowHeight = window.innerHeight;

                                  tooltip.style.position = "fixed";
                                  tooltip.style.zIndex = "10000";

                                  // Temporarily append to measure size
                                  tooltip.style.visibility = "hidden";
                                  document.body.appendChild(tooltip);
                                  const tooltipRect =
                                    tooltip.getBoundingClientRect();

                                  // Position to the right side of the image
                                  let left = rect.right + 15;
                                  let top =
                                    rect.top +
                                    rect.height / 2 -
                                    tooltipRect.height / 2;

                                  // Check if tooltip goes beyond right edge of screen
                                  if (
                                    left + tooltipRect.width >
                                    windowWidth - 10
                                  ) {
                                    // Position to the left side if no space on right
                                    left = rect.left - tooltipRect.width - 15;
                                    tooltip.classList.add("tooltip-left");
                                  }

                                  // Ensure tooltip doesn't go above or below screen
                                  if (top < 10) {
                                    top = 10;
                                  }
                                  if (
                                    top + tooltipRect.height >
                                    windowHeight - 10
                                  ) {
                                    top =
                                      windowHeight - tooltipRect.height - 10;
                                  }

                                  tooltip.style.left = `${left}px`;
                                  tooltip.style.top = `${top}px`;
                                  tooltip.style.transform = "none";
                                  tooltip.style.visibility = "visible";

                                  // Store reference for removal
                                  (e.currentTarget as any)._tooltip = tooltip;
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = (e.currentTarget as any)
                                    ._tooltip;
                                  if (tooltip) {
                                    document.body.removeChild(tooltip);
                                    (e.currentTarget as any)._tooltip = null;
                                  }
                                }}
                              >
                                <img
                                  src="/assets/admin/img/marketplace/default.webp"
                                  alt="Ürün Resmi"
                                  className="img-fluid rounded product-image"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                  }}
                                />
                                {/* Circular badge positioned on top-right of image */}
                                <div
                                  className="bg-warning rounded-circle d-flex align-items-center justify-content-center position-absolute"
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    color: "white",
                                    top: "-8px",
                                    right: "-8px",
                                    border: "2px solid white",
                                  }}
                                >
                                  {row.line?.quantity || 1}
                                </div>
                              </div>

                              {/* Product details */}
                              <div className="flex-grow-1">
                                {/* Product name */}
                                <div
                                  className="fw-bold text-dark mb-2"
                                  style={{
                                    fontSize: "0.85rem",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {row.line?.productName || "Ürün Adı"}
                                </div>

                                {/* Product specifications */}
                                <div
                                  style={{ fontSize: "0.7rem", color: "#666" }}
                                >
                                  <div className="mb-1">
                                    <span className="fw-medium">
                                      Stok Kodu:
                                    </span>{" "}
                                    {row.line?.merchantSku || "-"}
                                  </div>
                                  <div className="mb-1">
                                    <span className="fw-medium">Renk:</span>{" "}
                                    {row.line?.productColor || "-"}
                                  </div>
                                  <div className="mb-1">
                                    <span className="fw-medium">Barkod:</span>{" "}
                                    {row.line?.barcode || "-"}
                                  </div>
                                  <div className="mb-1">
                                    <span className="fw-medium">Beden:</span>{" "}
                                    {row.line?.productSize || "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div
                              className="fw-bold text-primary"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {(row.line?.price || 0).toLocaleString("tr-TR", {
                                style: "currency",
                                currency: "TRY",
                              })}
                            </div>
                          </td>
                          {/* Kargo bilgileri - Paket grubunun ilk satırında gösterilir */}
                          {row.isFirstRowInPackage && (
                            <td rowSpan={row.packageRowSpan}>
                              <div className="d-flex flex-column align-items-center text-center">
                                {/* Cargo company logo and info based on tracking number */}
                                {(() => {
                                  const trackingNumber =
                                    row.package.cargoTrackingNumber || "";
                                  const firstThreeDigits =
                                    trackingNumber.substring(0, 3);

                                  // Trendyol Express (733)
                                  if (firstThreeDigits === "733") {
                                    return (
                                      <>
                                        <div
                                          className="mb-2"
                                          style={{
                                            width: "60px",
                                            height: "40px",
                                          }}
                                        >
                                          <img
                                            src="/assets/admin/img/marketplace/trendyol-express.webp"
                                            alt="Trendyol Express"
                                            className="img-fluid"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </div>
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1rem",
                                            color: "#333",
                                          }}
                                        >
                                          {trackingNumber || "0"}
                                        </div>
                                        <div
                                          className="text-muted"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          Trendyol anlaşmalı kargo
                                        </div>
                                      </>
                                    );
                                  }

                                  // Aras Kargo (726)
                                  else if (firstThreeDigits === "726") {
                                    return (
                                      <>
                                        <div
                                          className="mb-2"
                                          style={{
                                            width: "60px",
                                            height: "40px",
                                          }}
                                        >
                                          <img
                                            src="/assets/admin/img/marketplace/aras-kargo.webp"
                                            alt="Aras Kargo"
                                            className="img-fluid"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </div>
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1rem",
                                            color: "#333",
                                          }}
                                        >
                                          {trackingNumber || "0"}
                                        </div>
                                        <div
                                          className="text-muted"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          Trendyol anlaşmalı kargo
                                        </div>
                                      </>
                                    );
                                  }

                                  // Other cargo companies (Alternatif Teslimat)
                                  else if (
                                    trackingNumber &&
                                    trackingNumber !== "0" &&
                                    trackingNumber.length > 0
                                  ) {
                                    return (
                                      <>
                                        <div
                                          className="mb-2"
                                          style={{
                                            width: "60px",
                                            height: "40px",
                                          }}
                                        >
                                          <img
                                            src="/assets/admin/img/marketplace/alternatif-teslimat.webp"
                                            alt="Alternatif Teslimat"
                                            className="img-fluid"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </div>
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1rem",
                                            color: "#333",
                                          }}
                                        >
                                          {trackingNumber}
                                        </div>
                                        <div
                                          className="text-muted"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          Trendyol anlaşmalı kargo
                                        </div>
                                      </>
                                    );
                                  }

                                  // No cargo information (shows 0) - when tracking number is empty, null, or "0"
                                  else if (
                                    !trackingNumber ||
                                    trackingNumber === "" ||
                                    trackingNumber === "0"
                                  ) {
                                    return (
                                      <>
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1.5rem",
                                            color: "#333",
                                          }}
                                        >
                                          0
                                        </div>
                                        <div
                                          className="text-muted"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          Trendyol anlaşmalı kargo
                                        </div>
                                      </>
                                    );
                                  }

                                  // Fallback case - should not normally reach here
                                  else {
                                    return (
                                      <>
                                        <div
                                          className="fw-bold mb-1"
                                          style={{
                                            fontSize: "1rem",
                                            color: "#333",
                                          }}
                                        >
                                          {trackingNumber || "N/A"}
                                        </div>
                                        <div
                                          className="text-muted"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          Trendyol anlaşmalı kargo
                                        </div>
                                      </>
                                    );
                                  }
                                })()}
                              </div>
                            </td>
                          )}
                          {/* Fatura bilgileri - Paket grubunun ilk satırında gösterilir */}
                          {row.isFirstRowInPackage && (
                            <td rowSpan={row.packageRowSpan}>
                              <div>
                                <div style={{ fontSize: "0.8rem" }}>
                                  <div>
                                    Satış Tutarı:{" "}
                                    {(row.package.grossAmount || 0).toFixed(2)}{" "}
                                    TL
                                  </div>
                                  <div className="text-success mb-1">
                                    Satıcı İndirim Tutarı:{" "}
                                    {(row.package.totalDiscount || 0).toFixed(
                                      2
                                    )}{" "}
                                    TL
                                  </div>
                                  <hr />
                                  <div className="fw-bold">
                                    Faturalanacak Tutar:{" "}
                                    {(row.package.totalPrice || 0).toFixed(2)}{" "}
                                    TL
                                  </div>
                                </div>
                                {isMicroExport && (
                                  <div className="d-flex align-items-center mt-1">
                                    <i className="bx bx-info-circle text-info me-1"></i>
                                    <span style={{ fontSize: "0.8rem" }}>
                                      Mikro İhracat Faturası
                                    </span>
                                  </div>
                                )}

                                {/* Invoice Status Display */}
                                {row.package.invoiceLink ? (
                                  // Invoice exists - show "View Invoice" button
                                  <div className="mt-2">
                                    <button
                                      className="btn btn-success btn-sm w-100"
                                      onClick={() => {
                                        if (row.package.invoiceLink) {
                                          window.open(
                                            row.package.invoiceLink,
                                            "_blank"
                                          );
                                        } else {
                                          toast.error(
                                            "Fatura linki bulunamadı"
                                          );
                                        }
                                      }}
                                      style={{ fontSize: "0.8rem" }}
                                    >
                                      <i className="bx bx-file me-1"></i>
                                      Faturayı Gör
                                    </button>
                                  </div>
                                ) : (
                                  // No invoice - show "Invoice Pending" message
                                  <div className="d-flex align-items-center mt-1">
                                    <i className="bx bx-error-circle text-danger me-1"></i>
                                    <span style={{ fontSize: "0.9rem" }}>
                                      Fatura Bekleniyor
                                    </span>
                                  </div>
                                )}

                                <div className="dropdown mt-2">
                                  <button
                                    className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    Fatura İşlemleri
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setSelectedPackageForModal(
                                            row.package
                                          );
                                          setShowInvoiceInfoModal(true);
                                        }}
                                      >
                                        Fatura Bilgileri
                                      </a>
                                    </li>
                                    {row.package.invoiceLink ? (
                                      // If invoice exists, show delete option
                                      <li>
                                        <a
                                          className="dropdown-item text-danger"
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteInvoice(row.package);
                                          }}
                                        >
                                          Fatura Sil
                                        </a>
                                      </li>
                                    ) : (
                                      // If no invoice, show upload option
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedPackageForModal(
                                              row.package
                                            );
                                            setShowUploadInvoiceModal(true);
                                          }}
                                        >
                                          Fatura Yükle
                                        </a>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </td>
                          )}
                          {/* Durum bilgileri - Paket grubunun ilk satırında gösterilir */}
                          {row.isFirstRowInPackage && (
                            <td rowSpan={row.packageRowSpan}>
                              <div>
                                {/* Created (Yeni) - Turuncu etiket butonları */}
                                {row.package.status === "Created" && (
                                  <>
                                    <div className="d-flex flex-column gap-1">
                                      <button
                                        className="btn btn-sm"
                                        onClick={() =>
                                          openStatusModal(row.package)
                                        }
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          borderColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          color: "white",
                                        }}
                                      >
                                        {hasInvoiceIssue && (
                                          <i className="bx bx-error-circle me-1"></i>
                                        )}
                                        Etiketi A4 Yazdır
                                      </button>
                                      <button
                                        className="btn btn-sm"
                                        onClick={() =>
                                          openTrackingModal(row.package)
                                        }
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          borderColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          color: "white",
                                        }}
                                      >
                                        {hasInvoiceIssue && (
                                          <i className="bx bx-error-circle me-1"></i>
                                        )}
                                        Etiketi Sticker Yazdır
                                      </button>
                                    </div>
                                    <div className="dropdown mt-2">
                                      <button
                                        className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        style={{ fontSize: "0.7rem" }}
                                      >
                                        İşlemler
                                      </button>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleProcessPackage(row.package);
                                            }}
                                          >
                                            İşleme Al
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Gönderı Seçeneğini Değiştir
                                          </a>
                                        </li>
                                        {/* Only show Paketi Böl if package can be split */}
                                        {(() => {
                                          const totalQuantity =
                                            row.package.lines?.reduce(
                                              (sum, line) =>
                                                sum + line.quantity,
                                              0
                                            ) || 1;
                                          return (
                                            totalQuantity > 1 && (
                                              <li>
                                                <a
                                                  className="dropdown-item"
                                                  href="#"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    openSplitPackageModal(
                                                      row.package
                                                    );
                                                  }}
                                                >
                                                  Paketi Böl
                                                </a>
                                              </li>
                                            )
                                          );
                                        })()}
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCancelItems(row.package);
                                            }}
                                          >
                                            İptal Et
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Mağaza Kartı Yazdır
                                          </a>
                                        </li>
                                        <li>
                                          <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Mesafeli Satış Sözleşmesi
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Ön Bilgilendirme Formu
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                )}

                                {/* Picking (İşleme Alınan) - Turuncu etiket butonları */}
                                {row.package.status === "Picking" && (
                                  <>
                                    <div className="d-flex flex-column gap-1">
                                      <button
                                        className="btn btn-sm"
                                        onClick={() =>
                                          openStatusModal(row.package)
                                        }
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          borderColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          color: "white",
                                        }}
                                      >
                                        {hasInvoiceIssue && (
                                          <i className="bx bx-error-circle me-1"></i>
                                        )}
                                        Etiketi A4 Yazdır
                                      </button>
                                      <button
                                        className="btn btn-sm"
                                        onClick={() =>
                                          openTrackingModal(row.package)
                                        }
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          borderColor: hasInvoiceIssue
                                            ? "#dc3545"
                                            : "#ff8c00",
                                          color: "white",
                                        }}
                                      >
                                        {hasInvoiceIssue && (
                                          <i className="bx bx-error-circle me-1"></i>
                                        )}
                                        Etiketi Sticker Yazdır
                                      </button>
                                    </div>
                                    <div className="dropdown mt-2">
                                      <button
                                        className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        style={{ fontSize: "0.7rem" }}
                                      >
                                        İşlemler
                                      </button>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Gönderı Seçeneğini Değiştir
                                          </a>
                                        </li>
                                        {/* Only show Paketi Böl if package can be split */}
                                        {(() => {
                                          const totalQuantity =
                                            row.package.lines?.reduce(
                                              (sum, line) =>
                                                sum + line.quantity,
                                              0
                                            ) || 1;
                                          return (
                                            totalQuantity > 1 && (
                                              <li>
                                                <a
                                                  className="dropdown-item"
                                                  href="#"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    openSplitPackageModal(
                                                      row.package
                                                    );
                                                  }}
                                                >
                                                  <i className="bx bx-cut me-2"></i>
                                                  Paketi Böl
                                                </a>
                                              </li>
                                            )
                                          );
                                        })()}
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCancelItems(row.package);
                                            }}
                                          >
                                            İptal Et
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Mağaza Kartı Yazdır
                                          </a>
                                        </li>
                                        <li>
                                          <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Mesafeli Satış Sözleşmesi
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Ön Bilgilendirme Formu
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                )}

                                {/* Shipped (Taşıma Durumunda) - Turuncu Kargo Takip butonu */}
                                {row.package.status === "Shipped" && (
                                  <>
                                    <button
                                      className="btn btn-sm w-100 mb-2"
                                      style={{
                                        fontSize: "0.7rem",
                                        backgroundColor: "#ff8c00",
                                        borderColor: "#ff8c00",
                                        color: "white",
                                      }}
                                    >
                                      Kargo Takip
                                    </button>
                                    <div className="dropdown">
                                      <button
                                        className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        style={{ fontSize: "0.7rem" }}
                                      >
                                        İşlemler
                                      </button>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Mesafeli Satış Sözleşmesi
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Ön Bilgilendirme Formu
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                )}

                                {/* Delivered (Teslim Edildi) - Yeşil ve Kırmızı butonlar */}
                                {row.package.status === "Delivered" && (
                                  <>
                                    <div className="d-flex flex-column gap-1">
                                      <button
                                        className="btn btn-sm w-100"
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: "#28a745",
                                          borderColor: "#28a745",
                                          color: "white",
                                        }}
                                      >
                                        Teslim Edildi İşaretle
                                      </button>
                                      <button
                                        className="btn btn-sm w-100"
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: "#dc3545",
                                          borderColor: "#dc3545",
                                          color: "white",
                                        }}
                                      >
                                        Teslim Edilemedi İşaretle
                                      </button>
                                      <button
                                        className="btn btn-sm w-100"
                                        style={{
                                          fontSize: "0.7rem",
                                          backgroundColor: "#ff8c00",
                                          borderColor: "#ff8c00",
                                          color: "white",
                                        }}
                                      >
                                        Kargo Takip
                                      </button>
                                    </div>
                                    <div className="dropdown mt-2">
                                      <button
                                        className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        style={{ fontSize: "0.7rem" }}
                                      >
                                        İşlemler
                                      </button>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Mesafeli Satış Sözleşmesi
                                          </a>
                                        </li>
                                        <li>
                                          <a className="dropdown-item" href="#">
                                            Ön Bilgilendirme Formu
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                )}

                                {/* Returned (Yeniden Gönderim) - Sadece İşlemler dropdown */}
                                {row.package.status === "Returned" && (
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      İşlemler
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <a className="dropdown-item" href="#">
                                          İade Talebi Oluştur
                                        </a>
                                      </li>
                                      <li>
                                        <hr className="dropdown-divider" />
                                      </li>
                                      <li>
                                        <a className="dropdown-item" href="#">
                                          Mesafeli Satış Sözleşmesi
                                        </a>
                                      </li>
                                      <li>
                                        <a className="dropdown-item" href="#">
                                          Ön Bilgilendirme Formu
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* UnSupplied ve diğer durumlar için default */}
                                {![
                                  "Created",
                                  "Picking",
                                  "Shipped",
                                  "Delivered",
                                  "Returned",
                                ].includes(row.package.status) && (
                                    <>
                                      <div className="d-flex flex-column gap-1">
                                        <button
                                          className={`btn btn-sm ${hasInvoiceIssue
                                              ? "btn-danger"
                                              : "btn-warning"
                                            }`}
                                          onClick={() =>
                                            openStatusModal(row.package)
                                          }
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          {hasInvoiceIssue && (
                                            <i className="bx bx-error-circle me-1"></i>
                                          )}
                                          Etiketi A4 Yazdır
                                        </button>
                                        <button
                                          className={`btn btn-sm ${hasInvoiceIssue
                                              ? "btn-danger"
                                              : "btn-warning"
                                            }`}
                                          onClick={() =>
                                            openTrackingModal(row.package)
                                          }
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          {hasInvoiceIssue && (
                                            <i className="bx bx-error-circle me-1"></i>
                                          )}
                                          Etiketi Sticker Yazdır
                                        </button>
                                      </div>
                                      <div className="dropdown mt-2">
                                        <button
                                          className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          İşlemler
                                        </button>
                                        <ul className="dropdown-menu">
                                          <li>
                                            <a className="dropdown-item" href="#">
                                              Mesafeli Satış Sözleşmesi
                                            </a>
                                          </li>
                                          <li>
                                            <a className="dropdown-item" href="#">
                                              Ön Bilgilendirme Formu
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </>
                                  )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="bx bx-package mb-2"
                style={{ fontSize: "3rem", color: "#d9dee3" }}
              ></i>
              <h6 style={{ fontSize: "0.9rem" }}>Sipariş bulunamadı</h6>
              <p className="text-muted mb-3" style={{ fontSize: "0.8rem" }}>
                Seçilen kriterlere uygun sipariş bulunmamaktadır.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <GeneralModal
        id="statusModal"
        title="Sipariş Durumu Güncelle"
        size="sm"
        onClose={() => setSelectedPackage(null)}
        onApprove={handleUpdateStatus}
        approveButtonText="Güncelle"
        isLoading={isUpdatingStatus}
        showFooter={true}
      >
        <div className="mb-3">
          <label className="form-label">Yeni Durum Seçin</label>
          <select
            className="form-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            {statusTabs
              .filter((tab) => tab.key !== "All")
              .map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>
        <div className="alert alert-info" style={{ fontSize: "0.8rem" }}>
          <i className="bx bx-info-circle me-2"></i>
          Sipariş durumu güncellenecektir. Bu işlem geri alınamaz.
        </div>
      </GeneralModal>

      {/* Tracking Number Update Modal */}
      <GeneralModal
        id="trackingModal"
        title="Takip Numarası Güncelle"
        size="sm"
        onClose={() => setSelectedPackage(null)}
        onApprove={handleUpdateTracking}
        approveButtonText="Güncelle"
        isLoading={isUpdatingTracking}
        showFooter={true}
      >
        <div className="mb-3">
          <label className="form-label">Takip Numarası</label>
          <input
            type="text"
            className="form-control"
            placeholder="Takip numarasını girin..."
            value={newTrackingNumber}
            onChange={(e) => setNewTrackingNumber(e.target.value)}
          />
        </div>
        <div className="alert alert-warning" style={{ fontSize: "0.8rem" }}>
          <i className="bx bx-error-circle me-2"></i>
          Takip numarası güncellenecektir. Doğru numarayı girdiğinizden emin
          olun.
        </div>
      </GeneralModal>

      {/* Yeni Modal'lar */}
      <InvoiceInfoModal
        isOpen={showInvoiceInfoModal}
        onClose={() => setShowInvoiceInfoModal(false)}
        shipmentPackage={selectedPackageForModal}
      />

      <UploadInvoiceModal
        isOpen={showUploadInvoiceModal}
        onClose={() => setShowUploadInvoiceModal(false)}
        orderNumber={selectedPackageForModal?.orderNumber || ""}
        shipmentPackageId={selectedPackageForModal?.id}
      />

      {/* Split Package Modals */}
      {showSplitPackageModal && (
        <SplitPackageModal
          isOpen={showSplitPackageModal}
          onClose={closeSplitModals}
          onSplit={handleSplitPackage}
          shipmentPackage={selectedPackageForSplit}
          isLoading={
            isSplittingPackage ||
            isSplittingShipment ||
            isSplittingByQuantity ||
            isSplittingMultiGroup
          }
        />
      )}

      {showSplitConfirmationModal && (
        <SplitConfirmationModal
          isOpen={showSplitConfirmationModal}
          onClose={closeSplitModals}
          onConfirm={handleConfirmSplit}
          isLoading={
            isSplittingPackage ||
            isSplittingShipment ||
            isSplittingByQuantity ||
            isSplittingMultiGroup
          }
          shipmentPackage={selectedPackageForSplit}
          selectedQuantities={splitQuantities}
        />
      )}

      {/* Unsupplied Items Modal */}
      <UnsuppliedItemsModal
        isOpen={showUnsuppliedItemsModal}
        onClose={() => {
          setShowUnsuppliedItemsModal(false);
          setSelectedPackageForUnsupplied(null);
        }}
        shipmentPackage={selectedPackageForUnsupplied}
        onSuccess={handleUnsuppliedSuccess}
      />

      {/* Delete Invoice Modal */}
      <DeleteInvoiceModal
        isOpen={showDeleteInvoiceModal}
        onClose={handleCloseDeleteInvoiceModal}
        onConfirm={handleConfirmDeleteInvoice}
        shipmentPackage={selectedPackageForDelete}
        isLoading={isDeletingInvoice}
      />

      {/* Toplu Paket Bölme Onay Modal */}
      {showBulkSplitModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          id="bulkSplitModal"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-cut me-2 text-warning"></i>
                  Toplu Paket Bölme Onayı
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBulkSplitModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bx bx-info-circle me-2"></i>
                  <strong>
                    {selectedPackagesForBulkSplit.length} paket
                  </strong>{" "}
                  seçildi. Bu paketler otomatik olarak bölünecektir.
                </div>

                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Paket No</th>
                        <th>Ürün Sayısı</th>
                        <th>Toplam Adet</th>
                        <th>Bölme Sonucu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPackagesForBulkSplit.map((pkg) => {
                        const packageLines = pkg.lines || [];
                        const totalQuantity =
                          packageLines.reduce(
                            (sum, line) => sum + line.quantity,
                            0
                          ) || 1;

                        let splitResult = "";
                        if (packageLines.length === 1) {
                          const splitQuantity = Math.floor(totalQuantity / 2);
                          splitResult = `Yeni: ${splitQuantity} adet, Kalan: ${totalQuantity - splitQuantity
                            } adet`;
                        } else {
                          const halfLines = Math.ceil(packageLines.length / 2);
                          splitResult = `Yeni: ${halfLines} ürün, Kalan: ${packageLines.length - halfLines
                            } ürün`;
                        }

                        return (
                          <tr key={pkg.id}>
                            <td>
                              <strong>#{pkg.id}</strong>
                            </td>
                            <td>{packageLines.length} ürün</td>
                            <td>{totalQuantity} adet</td>
                            <td className="text-success">{splitResult}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="alert alert-warning mt-3">
                  <i className="bx bx-exclamation-triangle me-2"></i>
                  <strong>Dikkat:</strong> Bu işlem geri alınamaz. Her paket
                  için yeni kargo barkodu oluşturulacaktır.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBulkSplitModal(false)}
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setShowBulkSplitModal(false);
                    handleBulkSplitOperation(selectedPackagesForBulkSplit);
                  }}
                >
                  <i className="bx bx-cut me-2"></i>
                  Toplu Paket Böl
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {showBulkSplitModal && <div className="modal-backdrop fade show"></div>}

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .card {
          border-radius: 0.5rem;
          border: 1px solid #eee;
          box-shadow: none;
        }
        .btn {
          border-radius: 3px;
        }
        .form-select,
        .form-control {
          border-radius: 3px;
          border: 1px solid #d9dee3;
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #ff6600;
          box-shadow: 0 0 0 0.2rem rgba(255, 102, 0, 0.25);
        }
        .badge {
          font-weight: 500;
          padding: 0.35em 0.65em;
        }
        .bg-label-primary {
          background-color: #e7e7ff;
          color: #696cff;
        }
        .bg-label-success {
          background-color: #e8f5e8;
          color: #71dd37;
        }
        .bg-label-warning {
          background-color: #fff2d6;
          color: #ffab00;
        }
        .bg-label-danger {
          background-color: #ffe0db;
          color: #ff3e1d;
        }
        .bg-label-info {
          background-color: #d7f5fc;
          color: #03c3ec;
        }
        .bg-label-secondary {
          background-color: #ebeef0;
          color: #8592a3;
        }
        .table th {
          border-top: none;
          font-weight: 600;
          color: #566a7f;
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          border-right: 1px solid #dee2e6;
        }
        .table td {
          vertical-align: middle;
          border: 1px solid #dee2e6;
          padding: 1rem 0.75rem;
        }
        .table {
          border-collapse: separate;
          border-spacing: 0;
        }
        .table thead th:first-child,
        .table tbody td:first-child {
          border-left: 1px solid #dee2e6;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(67, 89, 113, 0.04);
        }
        .form-check-input {
          cursor: pointer;
        }
        .btn-link {
          text-decoration: none;
        }
        .btn-link:hover {
          text-decoration: none;
        }
        .border-bottom-primary {
          border-bottom: 2px solid #ff6600 !important;
        }
        .btn-primary {
          background-color: #ff6600;
          border-color: #ff6600;
        }
        .btn-primary:hover,
        .btn-primary:focus {
          background-color: #e55a00;
          border-color: #e55a00;
        }
        .text-primary {
          color: #ff6600 !important;
        }

        /* Yeni action bar stilleri */
        .action-bar-card {
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .action-bar-card .card-body {
          padding: 1rem;
        }

        .dropdown-menu {
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 6px;
        }

        .dropdown-item.active {
          background-color: #ff6600;
          color: white;
        }

        .btn-warning {
          background-color: #ffc107;
          border-color: #ffc107;
          color: #212529;
        }

        .btn-warning:hover {
          background-color: #ffca2c;
          border-color: #ffca2c;
          color: #212529;
        }

        .btn-outline-success {
          color: #28a745;
          border-color: #d9dee3;
          background-color: white;
        }

        .btn-outline-success:hover {
          background-color: #28a745;
          border-color: #28a745;
          color: white;
        }

        /* Country search input styling */
        .country-search-group {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #d9dee3;
        }

        .country-search-group .input-group-text {
          border: none;
          border-right: 1px solid #d9dee3;
          background-color: #f8f9fa;
          box-shadow: none !important;
        }

        .country-search-input {
          border: none;
          box-shadow: none !important;
          outline: none !important;
        }

        .country-search-input:focus {
          border: none;
          box-shadow: none !important;
          outline: none !important;
          background-color: white;
        }

        .country-search-group:focus-within {
          border-color: #ff6600;
          box-shadow: 0 0 0 0.2rem rgba(255, 102, 0, 0.25) !important;
        }

        /* Override Bootstrap default focus styles */
        .country-search-group .form-control:focus,
        .country-search-group .input-group-text:focus {
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* Remove any default browser outline */
        .country-search-group *:focus {
          outline: none !important;
        }

        /* Product Tooltip Styles */
        .product-image-container {
          transition: transform 0.2s ease;
        }

        .product-image-container:hover {
          transform: scale(1.05);
        }

        .product-image {
          transition: box-shadow 0.2s ease;
        }

        .product-image-container:hover .product-image {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Enhanced Product Tooltip Styles */
        .enhanced-product-tooltip {
          background: transparent;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          animation: enhancedTooltipFadeIn 0.3s ease-out;
          pointer-events: none;
          width: auto;
          height: auto;
        }

        @keyframes enhancedTooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        .tooltip-container {
          position: relative;
          padding: 0;
        }

        .tooltip-image-only {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px 10px 14px;
        }

        .tooltip-product-image {
          position: relative;
          flex-shrink: 0;
        }

        .enhanced-product-tooltip .tooltip-product-image img {
          width: 40px !important;
          height: 40px !important;
          object-fit: cover;
          border-radius: 3px;
          border: 2px solid #4f94ff;
          box-shadow: 0 6px 18px rgba(79, 148, 255, 0.7),
            0 3px 9px rgba(79, 148, 255, 0.5) !important;
        }

        .enhanced-product-tooltip .tooltip-quantity-badge {
          position: absolute;
          top: -4px !important;
          right: -4px !important;
          background: linear-gradient(135deg, #ff6600, #ff8c00);
          color: white;
          border-radius: 50%;
          width: 16px !important;
          height: 16px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: bold;
          border: 1px solid white;
          box-shadow: 0 2px 4px rgba(255, 102, 0, 0.5) !important;
        }

        .tooltip-product-info {
          flex-grow: 1;
          min-width: 0;
        }

        .tooltip-product-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
          line-height: 1.3;
          text-decoration: underline;
          text-decoration-color: #ff6600;
          word-wrap: break-word;
        }

        .tooltip-product-quantity {
          font-size: 0.75rem;
          color: #666;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }

        .tooltip-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e9ecef, transparent);
          margin: 0 14px;
        }

        .tooltip-details-grid {
          padding: 10px 14px 12px 14px;
        }

        .tooltip-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding: 4px 0;
        }

        .tooltip-detail-row:last-child {
          margin-bottom: 0;
        }

        .tooltip-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 500;
          min-width: 80px;
        }

        .tooltip-value {
          font-size: 0.75rem;
          color: #333;
          font-weight: 600;
          text-align: right;
          max-width: 180px;
          word-wrap: break-word;
        }

        .tooltip-arrow {
          position: absolute;
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid white;
          filter: drop-shadow(-2px 0 4px rgba(37, 117, 252, 0.1));
        }

        .tooltip-arrow::before {
          content: "";
          position: absolute;
          top: -8px;
          right: -9px;
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid #e9ecef;
        }

        .enhanced-product-tooltip.tooltip-left .tooltip-arrow {
          left: auto;
          right: -8px;
          border-right: none;
          border-left: 8px solid white;
        }

        .enhanced-product-tooltip.tooltip-left .tooltip-arrow::before {
          right: auto;
          left: -9px;
          border-right: none;
          border-left: 8px solid #e9ecef;
        }

        /* Product image hover effects */
        .product-image-container {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .product-image-container:hover {
          transform: scale(1.08);
        }

        .product-image {
          transition: all 0.3s ease;
          border-radius: 8px;
        }

        .product-image-container:hover .product-image {
          box-shadow: 0 8px 20px rgba(255, 102, 0, 0.25);
          border: 2px solid #ff6600;
        }

        /* Additional hover effect for badge */
        .product-image-container:hover .bg-warning {
          background-color: #ff6600 !important;
          transform: scale(1.1);
          transition: all 0.3s ease;
        }

        /* Invoice status styles */
        .btn-success {
          background-color: #28a745;
          border-color: #28a745;
          color: white;
        }

        .btn-success:hover {
          background-color: #218838;
          border-color: #1e7e34;
          color: white;
        }

        .dropdown-item.text-danger {
          color: #dc3545 !important;
        }

        .dropdown-item.text-danger:hover {
          background-color: #f8d7da;
          color: #721c24 !important;
        }
      `}</style>
    </div>
  );
}

export default TrendyolMarketplaceCargoStagePage;
