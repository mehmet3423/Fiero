import { useGetClaims } from "@/hooks/services/admin-trendyol-marketplace/useGetClaims";
import { GetClaimsRequest } from "@/constants/models/trendyol/GetClaimsRequest";
import { ClaimContent } from "@/constants/models/trendyol/GetClaimsResponse";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import CirclePagination from "@/components/shared/CirclePagination";
import ClaimDetailModal from "@/components/admin/trendyol-marketplace/ClaimDetailModal";
import ClaimActionModal from "@/components/admin/trendyol-marketplace/ClaimActionModal";
import ClaimApproveModal from "@/components/admin/trendyol-marketplace/ClaimApproveModal";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/currencyFormatter";

interface ClaimsFilters {
  claimIds?: string;
  claimItemStatus?: string;
  startDate?: string;
  endDate?: string;
  orderNumber?: string;
  size?: number;
  page?: number;
}

const statusTabs = [
  { key: "Created", label: "Talep Oluşturulan", count: 0, hasInfo: true },
  {
    key: "WaitingInAction",
    label: "Aksiyon Bekleyen",
    count: 0,
    hasInfo: true,
  },
  { key: "Accepted", label: "Onaylanan", count: 0 },
  { key: "Cancelled", label: "İptal Edilen", count: 0 },
  { key: "Rejected", label: "Reddedilen", count: 0 },
  { key: "Unresolved", label: "İhtilaflı", count: 0 },
  { key: "InAnalysis", label: "Analiz", count: 0 },
];

function TrendyolClaimsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ClaimsFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<ClaimsFilters>({});
  const [pageSize, setPageSize] = useState(10);

  // Tab states
  const [selectedStatus, setSelectedStatus] = useState("Created");
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({
    Created: 0,
    WaitingInAction: 0,
    Accepted: 0,
    Cancelled: 0,
    Rejected: 0,
    Unresolved: 0,
    InAnalysis: 0,
  });

  // Modal states
  const [selectedClaim, setSelectedClaim] = useState<ClaimContent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert filters to GetClaimsRequest format
  const claimsRequest: GetClaimsRequest = {
    page: currentPage - 1, // API uses 0-based pagination
    size: appliedFilters.size || pageSize,
    ...(appliedFilters.claimIds && { claimIds: appliedFilters.claimIds }),
    ...(appliedFilters.orderNumber && {
      orderNumber: appliedFilters.orderNumber,
    }),
    ...(appliedFilters.startDate && {
      startDate: new Date(appliedFilters.startDate).getTime(),
    }),
    ...(appliedFilters.endDate && {
      endDate: new Date(appliedFilters.endDate).getTime(),
    }),
    // Add status filter based on selected tab
    ...(selectedStatus && { claimItemStatus: selectedStatus }),
  };

  const { claims, isLoading, error } = useGetClaims(claimsRequest);

  // Update status counts when claims data changes
  React.useEffect(() => {
    if (claims) {
      setStatusCounts((prev) => ({
        ...prev,
        [selectedStatus]: claims.totalElements || 0,
      }));
    }
  }, [claims, selectedStatus]);

  // Helper function to format date
  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Geçersiz Tarih";
      }

      // Türkçe ay isimleri
      const months = [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ];

      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      return "Geçersiz Tarih";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    // Applied filters'a da yeni pageSize'ı ekle
    setAppliedFilters((prev) => ({
      ...prev,
      size: newPageSize,
    }));
  };

  // Navigate to cargo-stage with orderNumber filter
  const handleViewDeliveryPackages = (orderNumber: string) => {
    if (!orderNumber) return;
    router.push(
      `/admin/trendyol-marketplace/cargo-stage?orderNumber=${encodeURIComponent(
        orderNumber
      )}`
    );
  };

  // Filtreleme fonksiyonları
  const handleFilterChange = (field: keyof ClaimsFilters, value: any) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    setFilters(newFilters);

    // Tarih filtreleri için hemen uygula
    if (field === "startDate" || field === "endDate") {
      setAppliedFilters(newFilters);
    }
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  // Tab handlers
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Modal handlers
  const handleViewDetail = (claim: ClaimContent) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedClaim(null);
  };

  const handleAction = (claim: ClaimContent, action: "accept" | "reject") => {
    if (action === "accept") {
      setSelectedClaim(claim);
      setShowApproveModal(true);
    } else {
      // İade red işlemi sadece WaitingInAction durumunda yapılabilir
      if (selectedStatus !== "WaitingInAction") {
        toast.error(
          "İade red talebi sadece 'Aksiyon Bekleyen' durumundaki iadeler için yapılabilir!"
        );
        return;
      }
      setSelectedClaim(claim);
      setActionType(action);
      setShowActionModal(true);
    }
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setSelectedClaim(null);
    setActionType(null);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedClaim(null);
  };

  const handleApproveSuccess = () => {
    // Show single success message
    toast.success("İade başarıyla onaylandı!");

    // Invalidate and refetch claims data to update the UI
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.TRENDYOL_CLAIMS],
    });

    // Also reset to first page to see updated results
    setCurrentPage(1);
  };

  const handleConfirmAction = async (
    claimId: string,
    action: "accept" | "reject",
    note?: string
  ) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      alert(`İade ${action === "accept" ? "kabul" : "red"} edildi!`);

      // Close modal and refresh data
      handleCloseActionModal();
      // TODO: Refresh claims data
    } catch (error) {
      console.error("Error processing claim:", error);
      alert("İşlem sırasında bir hata oluştu!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="container-l flex-grow-1 container-p-y">
          <div className="card">
            <h5
              className="card-header"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "20px",
              }}
            >
              Trendyol İade İşlemleri
            </h5>
            <div className="d-flex justify-content-center align-items-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrapper">
        <div className="container-l flex-grow-1 container-p-y">
          <div className="card">
            <h5
              className="card-header"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "20px",
              }}
            >
              Trendyol İade İşlemleri
            </h5>
            <div className="alert alert-danger m-3">
              İade işlemleri yüklenirken bir hata oluştu. Lütfen daha sonra
              tekrar deneyin.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Status Tabs */}
        <div className="mb-4">
          <div className="d-flex flex-wrap overflow-auto">
            {statusTabs.map((tab) => (
              <div key={tab.key} className="position-relative me-4">
                <button
                  className={`btn btn-link text-decoration-none px-0 py-2 border-0 status-tab-btn ${
                    selectedStatus === tab.key
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
          <hr className="my-0" style={{ borderColor: "#e9ecef" }} />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <div className="row g-2 g-md-3">
            <div className="col-md-3">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text"
                  style={{ fontSize: "0.75rem", minWidth: "70px" }}
                >
                  İade Kodu
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={filters.claimIds || ""}
                  onChange={(e) => {
                    handleFilterChange("claimIds", e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {filters.claimIds && (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      handleFilterChange("claimIds", "");
                      setCurrentPage(1);
                    }}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0 3px 3px 0",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#dc3545";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6c757d";
                    }}
                  >
                    <i className="bx bx-x" style={{ fontSize: "0.9rem" }}></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text"
                  style={{ fontSize: "0.75rem", minWidth: "70px" }}
                >
                  Sipariş No
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={filters.orderNumber || ""}
                  onChange={(e) => {
                    handleFilterChange("orderNumber", e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {filters.orderNumber && (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      handleFilterChange("orderNumber", "");
                      setCurrentPage(1);
                    }}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0 3px 3px 0",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#dc3545";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6c757d";
                    }}
                  >
                    <i className="bx bx-x" style={{ fontSize: "0.9rem" }}></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text"
                  style={{ fontSize: "0.75rem", minWidth: "90px" }}
                >
                  Başlangıç
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={filters.startDate || ""}
                  onChange={(e) => {
                    handleFilterChange("startDate", e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {filters.startDate && (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      const newFilters = {
                        ...filters,
                        startDate: "",
                      };
                      setFilters(newFilters);
                      setAppliedFilters(newFilters);
                      setCurrentPage(1);
                    }}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0 3px 3px 0",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#dc3545";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6c757d";
                    }}
                  >
                    <i className="bx bx-x" style={{ fontSize: "0.9rem" }}></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-text"
                  style={{ fontSize: "0.75rem", minWidth: "70px" }}
                >
                  Bitiş
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={filters.endDate || ""}
                  onChange={(e) => {
                    handleFilterChange("endDate", e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {filters.endDate && (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      const newFilters = {
                        ...filters,
                        endDate: "",
                      };
                      setFilters(newFilters);
                      setAppliedFilters(newFilters);
                      setCurrentPage(1);
                    }}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#6c757d",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0 3px 3px 0",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#dc3545";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6c757d";
                    }}
                  >
                    <i className="bx bx-x" style={{ fontSize: "0.9rem" }}></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hızlı Tarih Seçimleri */}
          <div className="row g-2 mt-2">
            <div className="col-md-6">
              <small className="text-muted me-2">Hızlı Seçim:</small>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => {
                  const today = new Date();
                  const weekAgo = new Date(
                    today.getTime() - 7 * 24 * 60 * 60 * 1000
                  );
                  const newFilters = {
                    ...filters,
                    startDate: weekAgo.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  };
                  setFilters(newFilters);
                  setAppliedFilters(newFilters);
                  setCurrentPage(1);
                }}
                style={{ fontSize: "0.7rem" }}
              >
                Son 1 Hafta
              </button>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => {
                  const today = new Date();
                  const monthAgo = new Date(
                    today.getTime() - 30 * 24 * 60 * 60 * 1000
                  );
                  const newFilters = {
                    ...filters,
                    startDate: monthAgo.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  };
                  setFilters(newFilters);
                  setAppliedFilters(newFilters);
                  setCurrentPage(1);
                }}
                style={{ fontSize: "0.7rem" }}
              >
                Son 1 Ay
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  const today = new Date();
                  const threeMonthsAgo = new Date(
                    today.getTime() - 90 * 24 * 60 * 60 * 1000
                  );
                  const newFilters = {
                    ...filters,
                    startDate: threeMonthsAgo.toISOString().split("T")[0],
                    endDate: today.toISOString().split("T")[0],
                  };
                  setFilters(newFilters);
                  setAppliedFilters(newFilters);
                  setCurrentPage(1);
                }}
                style={{ fontSize: "0.7rem" }}
              >
                Son 3 Ay
              </button>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={clearFilters}
                style={{ minWidth: "100px" }}
              >
                Temizle
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSearch}
                disabled={isLoading}
                style={{ minWidth: "100px" }}
              >
                {isLoading ? "Filtreleniyor..." : "Filtrele"}
              </button>
            </div>
          </div>
        </div>

        {/* Tüm kontroller tek div içerisinde */}
        <div className="card mb-3">
          <div className="card-body py-3">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
              {/* Sol taraf - Başlık ve dropdown'lar */}
              <div>
                <h5 className="mb-0">
                  {statusTabs.find((t) => t.key === selectedStatus)?.label}
                </h5>
              </div>

              {/* Sağ taraf - Filtre sonuçları, sayfa kontrolleri */}
              <div className="d-flex flex-column gap-2 align-items-end">
                {/* Üst satır: Filtreleme sonuçları */}
                <div className="d-flex flex-column flex-md-row gap-3 align-items-end align-items-md-center">
                  {/* Filtreleme sonuçları bilgisi */}
                  <div
                    className="text-muted text-end"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <div>
                      Filtreleme Sonuçları: Toplam {claims?.totalElements || 0}{" "}
                      iade bilgisi ({claims?.content?.length || 0}{" "}
                      görüntüleniyor)
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
                </div>

                {/* Alt satır: Sayfa kontrolleri ve pagination */}
                <div className="d-flex flex-column flex-sm-row gap-3 align-items-end align-items-sm-center">
                  {/* Sayfa başına ürün sayısı */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{ minWidth: "150px" }}
                    >
                      Her Sayfada {pageSize} Ürün
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className={`dropdown-item ${
                            pageSize === 10 ? "active" : ""
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageSizeChange(10);
                          }}
                        >
                          10 Ürün
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className={`dropdown-item ${
                            pageSize === 20 ? "active" : ""
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageSizeChange(20);
                          }}
                        >
                          20 Ürün
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className={`dropdown-item ${
                            pageSize === 50 ? "active" : ""
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageSizeChange(50);
                          }}
                        >
                          50 Ürün
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Pagination kontrolleri */}
                  <div className="d-flex gap-1 flex-wrap align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      title="Önceki sayfa"
                    >
                      <i className="bx bx-chevron-left"></i>
                    </button>
                    <span
                      className="btn btn-dark btn-sm"
                      style={{ minWidth: "40px" }}
                    >
                      {currentPage}
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: "0.75rem", margin: "0 4px" }}
                    >
                      / {claims?.totalPages || 1}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      disabled={
                        !claims || currentPage >= (claims.totalPages || 1)
                      }
                      onClick={() => handlePageChange(currentPage + 1)}
                      title="Sonraki sayfa"
                    >
                      <i className="bx bx-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          {!claims || !claims.content || claims.content.length === 0 ? (
            <div className="text-center p-5">
              <i className="bx bx-undo fs-1 text-muted mb-3"></i>
              <p className="text-muted">Henüz iade işlemi bulunmamaktadır.</p>
            </div>
          ) : (
            <>
              <div
                className="table-responsive"
                style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
              >
                <table className="table responsive-claims-table">
                  <thead>
                    <tr>
                      <th className="col-order-info">SİPARİŞ BİLGİLERİ</th>
                      <th className="col-customer">ALICI</th>
                      <th className="col-product-info">BİLGİLER</th>
                      <th className="col-price">BİRİM FİYAT</th>
                      <th className="col-cargo">KARGO</th>
                      <th className="col-invoice">FATURA</th>
                      <th className="col-reason">İADE SEBEBİ</th>
                      <th className="col-status">DURUM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.content.map((claim) => (
                      <tr key={claim.id}>
                        {/* Sipariş Bilgileri */}
                        <td className="col-order-info">
                          <div>
                            {/* Header: İade ikonu + İade numarası + Kopya butonu */}
                            <div className="d-flex align-items-center mb-2">
                              <div className="me-2">
                                <svg
                                  width="16"
                                  height="16"
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
                                  fontSize: "0.85rem",
                                }}
                              >
                                #{claim.orderNumber}
                              </span>
                              <button
                                className="btn btn-sm btn-link p-0"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    claim.orderNumber
                                  )
                                }
                                title="Kopyala"
                                style={{ fontSize: "0.7rem" }}
                              >
                                <i className="bx bx-copy text-muted"></i>
                              </button>
                            </div>

                            {/* Sipariş Tarihi */}
                            <div className="mb-2">
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.8rem" }}
                              >
                                Sipariş Tarihi: {formatDate(claim.orderDate)}
                              </small>
                            </div>

                            {/* İade Talep Tarihi */}
                            <div className="mb-2">
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.8rem" }}
                              >
                                İade Talep Tarihi: {formatDate(claim.claimDate)}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Alıcı */}
                        <td className="col-customer">
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <i className="bx bx-star text-warning me-1"></i>
                              <div className="fw-bold">
                                {claim.customerFirstName}{" "}
                                {claim.customerLastName}
                              </div>
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              1. sipariş
                            </div>
                          </div>
                        </td>

                        {/* Bilgiler */}
                        <td className="col-product-info">
                          <div className="products-container">
                            {claim.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className={`product-item ${
                                  itemIndex > 0 ? "border-top pt-3 mt-3" : ""
                                }`}
                              >
                                <div className="d-flex align-items-start p-2">
                                  {/* Product number badge */}
                                  <div className="me-2">
                                    <div
                                      className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                        color: "white",
                                      }}
                                    >
                                      {item.claimItems?.length || 0}
                                    </div>
                                  </div>

                                  {/* Product image */}
                                  <div
                                    className="me-3 product-image-container"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      flexShrink: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                      const tooltip =
                                        document.createElement("div");
                                      tooltip.className =
                                        "enhanced-product-tooltip";

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

                                      // Set initial position (to the right)
                                      tooltip.style.position = "fixed";
                                      tooltip.style.left = `${
                                        rect.right + 10
                                      }px`;
                                      tooltip.style.top = `${
                                        rect.top + rect.height / 2
                                      }px`;
                                      tooltip.style.transform =
                                        "translateY(-50%)";
                                      tooltip.style.zIndex = "10000";
                                      tooltip.style.pointerEvents = "none";

                                      // Check if tooltip would go off-screen and adjust position
                                      document.body.appendChild(tooltip);
                                      const tooltipRect =
                                        tooltip.getBoundingClientRect();

                                      // If tooltip goes off right edge, position it to the left
                                      if (
                                        tooltipRect.right >
                                        windowWidth - 10
                                      ) {
                                        tooltip.style.left = `${
                                          rect.left - tooltipRect.width - 10
                                        }px`;
                                        tooltip.classList.add("tooltip-left");
                                      }

                                      // If tooltip goes off bottom edge, adjust top position
                                      if (
                                        tooltipRect.bottom >
                                        windowHeight - 10
                                      ) {
                                        tooltip.style.top = `${
                                          windowHeight - tooltipRect.height - 10
                                        }px`;
                                        tooltip.style.transform =
                                          "translateY(0)";
                                      }

                                      // If tooltip goes off top edge, adjust top position
                                      if (tooltipRect.top < 10) {
                                        tooltip.style.top = "10px";
                                        tooltip.style.transform =
                                          "translateY(0)";
                                      }

                                      // Store reference for removal
                                      (e.currentTarget as any)._tooltip =
                                        tooltip;
                                    }}
                                    onMouseLeave={(e) => {
                                      const tooltip = (e.currentTarget as any)
                                        ._tooltip;
                                      if (tooltip) {
                                        document.body.removeChild(tooltip);
                                        (e.currentTarget as any)._tooltip =
                                          null;
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
                                  </div>

                                  {/* Product details */}
                                  <div className="flex-grow-1">
                                    {/* Product name */}
                                    <div
                                      className="fw-bold text-dark mb-2 d-flex align-items-center"
                                      style={{
                                        fontSize: "0.85rem",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      <span className="me-2">
                                        {item.orderLine.productName}
                                      </span>
                                      <button
                                        className="btn btn-sm btn-link p-0"
                                        onClick={() =>
                                          navigator.clipboard.writeText(
                                            item.orderLine.productName
                                          )
                                        }
                                        title="Ürün adını kopyala"
                                        style={{ fontSize: "0.6rem" }}
                                      >
                                        <i className="bx bx-copy text-muted"></i>
                                      </button>
                                    </div>

                                    {/* Product specifications */}
                                    <div
                                      style={{
                                        fontSize: "0.7rem",
                                        color: "#666",
                                      }}
                                    >
                                      <div className="mb-1">
                                        <span className="fw-medium">
                                          Stok Kodu:
                                        </span>{" "}
                                        {item.orderLine.merchantSku || "-"}
                                      </div>
                                      <div className="mb-1">
                                        <span className="fw-medium">Renk:</span>{" "}
                                        {item.orderLine.productColor || "-"}
                                      </div>
                                      <div className="mb-1">
                                        <span className="fw-medium">
                                          Barkod:
                                        </span>{" "}
                                        {item.orderLine.barcode || "-"}
                                      </div>
                                      <div className="mb-1">
                                        <span className="fw-medium">
                                          Beden:
                                        </span>{" "}
                                        {item.orderLine.productSize || "-"}
                                      </div>
                                      <div className="mb-1">
                                        <span className="fw-medium">
                                          İade Sayısı:
                                        </span>{" "}
                                        {item.claimItems?.length || 0} adet
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Birim Fiyat */}
                        <td className="col-price">
                          <div className="d-flex flex-column gap-2">
                            {claim.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className={`${
                                  itemIndex > 0 ? "border-top pt-2" : ""
                                }`}
                              >
                                <div
                                  className="fw-bold"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  {formatCurrency(item.orderLine?.price || 0)}
                                </div>
                                {itemIndex < claim.items.length - 1 && (
                                  <hr
                                    className="my-1"
                                    style={{ opacity: 0.3 }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Kargo */}
                        <td className="col-cargo">
                          <div>
                            {/* Kargo bilgileri (varsa) */}
                            {claim.cargoTrackingNumber && (
                              <div>
                                {/* Cargo company logo and info based on tracking number */}
                                <div
                                  className="fw-bold mb-1"
                                  style={{
                                    fontSize: "1rem",
                                    color: "#333",
                                  }}
                                >
                                  {claim.cargoTrackingNumber}
                                </div>
                                <div
                                  className="text-muted mb-2"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {claim.cargoProviderName || "Kargo"}
                                </div>
                                {claim.cargoTrackingNumber && (
                                  <button
                                    className="btn btn-sm w-100"
                                    style={{
                                      fontSize: "0.7rem",
                                      backgroundColor: "#ff8c00",
                                      borderColor: "#ff8c00",
                                      color: "white",
                                    }}
                                    onClick={() => {
                                      if (claim.cargoTrackingLink) {
                                        window.open(
                                          claim.cargoTrackingLink,
                                          "_blank"
                                        );
                                      }
                                    }}
                                  >
                                    Kargo Takip
                                  </button>
                                )}
                              </div>
                            )}
                            {/* Teslimat Paketini Gör - Sadece Aksiyon Bekleyen ve Onaylanan durumlarında */}
                            {(selectedStatus === "WaitingInAction" ||
                              selectedStatus === "Accepted") && (
                              <a
                                href="#"
                                className="text-primary text-decoration-underline my-3 d-block text-center"
                                style={{ fontSize: "0.75rem" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleViewDeliveryPackages(claim.orderNumber);
                                }}
                                title="Teslimat paketini gör"
                              >
                                Teslimat Paketini Gör
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Fatura */}
                        <td className="col-invoice">
                          <div>
                            {(() => {
                              // Toplam tutarı hesapla
                              const totalAmount = claim.items.reduce(
                                (sum, item) =>
                                  sum +
                                  (item.orderLine?.price || 0) *
                                    (item.claimItems?.length || 0),
                                0
                              );
                              const avgVatRate =
                                claim.items[0]?.orderLine?.vatBaseAmount || 20;

                              return (
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  <div>
                                    Toplam Tutar: {formatCurrency(totalAmount)}
                                  </div>
                                  <div>KDV Oranı: %{avgVatRate}</div>
                                </div>
                              );
                            })()}
                          </div>
                        </td>

                        {/* İade Sebebi */}
                        <td className="col-reason">
                          <div className="d-flex flex-column gap-2">
                            {claim.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className={`${
                                  itemIndex > 0 ? "border-top pt-2" : ""
                                }`}
                              >
                                <div
                                  className="fw-bold mb-1"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {item.claimItems?.[0]?.customerClaimItemReason
                                    ?.name || "Belirtilmemiş"}
                                </div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  Müşteri Notu:{" "}
                                  {item.claimItems?.[0]?.customerNote || "Yok"}
                                </div>
                                {itemIndex < claim.items.length - 1 && (
                                  <hr
                                    className="my-1"
                                    style={{ opacity: 0.3 }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Durum */}
                        <td className="col-status">
                          <div className="d-flex flex-column gap-1">
                            {/* Talep Oluşturulan - İadeyi Teslim Aldım butonu */}
                            {selectedStatus === "Created" && (
                              <button
                                className="btn btn-sm btn-success w-100"
                                onClick={() => handleAction(claim, "accept")}
                                style={{ fontSize: "0.7rem" }}
                              >
                                İadeyi Teslim Aldım
                              </button>
                            )}

                            {/* Aksiyon Bekleyen - İade Onayla ve İade Red Talebi butonları */}
                            {selectedStatus === "WaitingInAction" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success w-100"
                                  onClick={() => handleAction(claim, "accept")}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  İade Onayla
                                </button>
                                <button
                                  className="btn btn-sm btn-danger w-100"
                                  onClick={() => handleAction(claim, "reject")}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  <i className="bx bx-x me-1"></i>
                                  İade Red Talebi
                                </button>
                              </>
                            )}

                            {/* Onaylanan - Detaylı Bilgileri Gör butonu */}
                            {selectedStatus === "Accepted" && (
                              <button
                                className="btn btn-sm btn-outline-secondary w-100"
                                onClick={() => handleViewDetail(claim)}
                                style={{ fontSize: "0.7rem" }}
                              >
                                <i className="bx bx-show-alt me-1"></i>
                                Detaylı Bilgileri Gör
                              </button>
                            )}

                            {/* İhtilaflı - İade Onayla ve Detaylı Bilgileri Gör butonları */}
                            {selectedStatus === "Unresolved" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success w-100"
                                  onClick={() => handleAction(claim, "accept")}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  <i className="bx bx-check me-1"></i>
                                  İade Onayla
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary w-100"
                                  onClick={() => handleViewDetail(claim)}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  <i className="bx bx-show-alt me-1"></i>
                                  Detaylı Bilgileri Gör
                                </button>
                              </>
                            )}

                            {/* Diğer durumlar için varsayılan butonlar */}
                            {![
                              "Created",
                              "WaitingInAction",
                              "Accepted",
                              "Unresolved",
                            ].includes(selectedStatus) && (
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle w-100"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  İşlemler
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleAction(claim, "accept")
                                      }
                                    >
                                      <i className="bx bx-check me-2"></i>
                                      İadeyi Onayla
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>
                                        handleAction(claim, "reject")
                                      }
                                    >
                                      <i className="bx bx-x me-2"></i>
                                      İadeyi Reddet
                                    </button>
                                  </li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleViewDetail(claim)}
                                    >
                                      <i className="bx bx-show-alt me-2"></i>
                                      Detayları Görüntüle
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {claims && claims.totalPages > 1 && (
                <CirclePagination
                  totalCount={claims.totalElements}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Modals */}
        <ClaimDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          claim={selectedClaim}
        />

        <ClaimActionModal
          isOpen={showActionModal}
          onClose={handleCloseActionModal}
          claim={selectedClaim}
          action={actionType}
          onConfirm={handleConfirmAction}
          isLoading={isProcessing}
        />

        <ClaimApproveModal
          isOpen={showApproveModal}
          onClose={handleCloseApproveModal}
          claim={selectedClaim}
          onSuccess={handleApproveSuccess}
        />
      </div>

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
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          table-layout: fixed;
        }

        /* Responsive table styles */
        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
        }

        /* Column width definitions for responsive table */
        .responsive-claims-table {
          min-width: 1400px;
          table-layout: fixed;
        }

        .responsive-claims-table .col-order-info {
          width: 200px;
          min-width: 180px;
        }

        .responsive-claims-table .col-customer {
          width: 120px;
          min-width: 100px;
        }

        .responsive-claims-table .col-product-info {
          width: 320px;
          min-width: 280px;
        }

        .responsive-claims-table .col-price {
          width: 100px;
          min-width: 90px;
        }

        .responsive-claims-table .col-cargo {
          width: 140px;
          min-width: 120px;
        }

        .responsive-claims-table .col-invoice {
          width: 180px;
          min-width: 160px;
        }

        .responsive-claims-table .col-reason {
          width: 140px;
          min-width: 120px;
        }

        .responsive-claims-table .col-status {
          width: 120px;
          min-width: 100px;
        }

        /* Product info specific responsive fixes */
        .col-product-info .products-container {
          padding: 0;
        }

        .col-product-info .product-item {
          border-color: #e9ecef;
        }

        .col-product-info .product-item:first-child {
          border-top: none !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
        }

        .col-product-info .d-flex {
          flex-wrap: nowrap;
          align-items: flex-start;
        }

        .col-product-info .flex-grow-1 {
          min-width: 0;
          padding-left: 8px;
        }

        /* Text wrapping and overflow handling */
        .col-product-info,
        .col-order-info,
        .col-customer,
        .col-reason {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        @media (max-width: 1200px) {
          .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            scrollbar-color: #ff6600 #f8f9fa;
          }

          .table-responsive::-webkit-scrollbar {
            height: 8px;
          }

          .table-responsive::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 4px;
          }

          .table-responsive::-webkit-scrollbar-thumb {
            background: #ff6600;
            border-radius: 4px;
          }

          .table-responsive::-webkit-scrollbar-thumb:hover {
            background: #e55a00;
          }

          .responsive-claims-table {
            min-width: 1200px;
          }

          .responsive-claims-table .col-product-info {
            width: 280px;
            min-width: 260px;
          }
        }

        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.8rem;
          }

          .table th,
          .table td {
            padding: 0.5rem 0.25rem;
          }

          .btn-sm {
            font-size: 0.6rem;
            padding: 0.25rem 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .table-responsive {
            font-size: 0.7rem;
          }

          .table th,
          .table td {
            padding: 0.25rem 0.1rem;
          }

          .btn-sm {
            font-size: 0.5rem;
            padding: 0.2rem 0.4rem;
          }

          .d-flex.gap-2 {
            flex-direction: column;
            gap: 0.5rem !important;
          }
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

        /* Action bar stilleri */
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

        /* Input group styling */
        .input-group {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #d9dee3;
        }

        .input-group .input-group-text {
          border: none;
          border-right: 1px solid #d9dee3;
          background-color: #f8f9fa;
          box-shadow: none !important;
        }

        .input-group .form-control {
          border: none;
          box-shadow: none !important;
          outline: none !important;
        }

        .input-group .form-control:focus {
          border: none;
          box-shadow: none !important;
          outline: none !important;
          background-color: white;
        }

        .input-group:focus-within {
          border-color: #ff6600;
          box-shadow: 0 0 0 0.2rem rgba(255, 102, 0, 0.25) !important;
        }

        /* Override Bootstrap default focus styles */
        .input-group .form-control:focus,
        .input-group .input-group-text:focus {
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* Remove any default browser outline */
        .input-group *:focus {
          outline: none !important;
        }

        /* Pagination styles */
        .pagination {
          margin: 0;
        }
        .page-link {
          border: 1px solid #d9dee3;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          font-size: 0.75rem;
          color: #697a8d;
        }
        .page-item.active .page-link {
          background-color: #ff6600;
          border-color: #ff6600;
          color: #fff;
        }
        .page-item.disabled .page-link {
          color: #adb5bd;
          opacity: 0.65;
        }
        .page-link i {
          font-size: 1rem;
        }

        /* Status tab styles */
        .status-tab {
          transition: all 0.2s ease;
        }

        .status-tab.active {
          color: #ff6600 !important;
          font-weight: bold;
        }

        .status-tab.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #ff6600;
        }

        /* Status tab button specific styles - remove hover effects */
        .status-tab-btn {
          box-shadow: none !important;
          outline: none !important;
        }

        .status-tab-btn:hover {
          box-shadow: none !important;
          outline: none !important;
          transform: none !important;
        }

        .status-tab-btn:focus {
          box-shadow: none !important;
          outline: none !important;
        }

        .status-tab-btn:active {
          box-shadow: none !important;
          outline: none !important;
        }

        /* Modal styles */
        .modal-content {
          border-radius: 8px;
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          border-bottom: 1px solid #e9ecef;
          background-color: #f8f9fa;
        }

        .modal-footer {
          border-top: 1px solid #e9ecef;
          background-color: #f8f9fa;
        }

        /* Button hover effects */
        .btn {
          transition: all 0.2s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        /* Table row hover effects */
        .table tbody tr {
          transition: background-color 0.2s ease;
        }

        .table tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }

        /* Badge hover effects */
        .badge {
          transition: all 0.2s ease;
        }

        .badge:hover {
          transform: scale(1.05);
        }

        /* Loading spinner */
        .spinner-border {
          width: 1rem;
          height: 1rem;
        }

        /* Alert styles */
        .alert {
          border-radius: 6px;
          border: none;
        }

        .alert-info {
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .alert-warning {
          background-color: #fff3cd;
          color: #856404;
        }

        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }

        .alert-success {
          background-color: #d4edda;
          color: #155724;
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
          background: white;
          border-radius: 8px;
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
          font-weight: 600;
          font-size: 0.85rem;
          color: #333;
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .tooltip-product-specs {
          font-size: 0.7rem;
          color: #666;
          line-height: 1.3;
        }

        .tooltip-spec-item {
          margin-bottom: 2px;
        }

        .tooltip-spec-label {
          font-weight: 500;
          color: #555;
        }

        .tooltip-arrow {
          position: absolute;
          top: 50%;
          right: -8px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid #e9ecef;
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
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}

export default TrendyolClaimsPage;
