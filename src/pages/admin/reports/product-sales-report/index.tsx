import React, { useState } from "react";
import { useProductSalesReport } from "@/hooks/services/reports/useProductSalesReport";
import Link from "next/link";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_PRODUCT_SALES_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";
import { formatCurrency } from "@/utils/currencyFormatter";
import { formatDate, formatDateTime } from "@/utils/dateFormatter";

interface ProductSalesFilters {
  startDate?: string;
  endDate?: string;
  categoryKeyword?: string;
  customerNameKeyword?: string;
  isRegisteredCustomer?: boolean;
  ascending?: boolean;
}

function ProductSalesReportPage() {
  // State for filters
  const [localFilters, setLocalFilters] = useState<ProductSalesFilters>({
    ascending: false,
  });

  // Modern pagination hook
  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<ProductSalesFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useProductSalesReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  const handleSearch = () => {
    updateFilters(localFilters);
  };

  const handleClearFilter = () => {
    setLocalFilters({ ascending: false });
    clearFilters();
  };

  const calculateTotalSales = () => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce(
      (total, item) => total + item.totalRevenue,
      0
    );
  };

  const calculateTotalQuantity = () => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce(
      (total, item) => total + item.totalQuantity,
      0
    );
  };

  const getRegisteredCustomersCount = () => {
    if (!data?.data?.items) return 0;
    return data.data.items.filter((item) => item.isRegisteredCustomer).length;
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(
      (key) =>
        filters[key as keyof typeof filters] !== undefined &&
        filters[key as keyof typeof filters] !== ""
    ).length;
  };

  // Toplam sayfa sayısını hesapla
  const totalCount = data?.data?.count || 0;

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_PRODUCT_SALES_REPORT_EXCEL,
      apiParams,
      "urun-satis-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Ürün Satış Raporu
      </h4>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body py-2">
          <h6 className="card-title mb-2 small">Filtreler</h6>
          <div className="row mb-2">
            <div className="col-md-3">
              <label htmlFor="startDate" className="form-label small">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="startDate"
                value={localFilters.startDate || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value,
                  })
                }
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="endDate" className="form-label small">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="endDate"
                value={localFilters.endDate || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, endDate: e.target.value })
                }
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="categoryKeyword" className="form-label small">
                Kategori
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="categoryKeyword"
                placeholder="Kategori adı girin..."
                value={localFilters.categoryKeyword || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    categoryKeyword: e.target.value,
                  })
                }
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="customerNameKeyword" className="form-label small">
                Müşteri Adı
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="customerNameKeyword"
                placeholder="Müşteri adı girin..."
                value={localFilters.customerNameKeyword || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    customerNameKeyword: e.target.value,
                  })
                }
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{ fontSize: "0.8rem" }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3">
              <label
                htmlFor="isRegisteredCustomer"
                className="form-label small"
              >
                Müşteri Türü
              </label>
              <select
                className="form-select form-select-sm"
                id="isRegisteredCustomer"
                value={localFilters.isRegisteredCustomer?.toString() || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    isRegisteredCustomer:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  })
                }
                style={{ fontSize: "0.8rem" }}
              >
                <option value="">Tümü</option>
                <option value="true">👤 Kayıtlı Müşteri</option>
                <option value="false">👥 Misafir Müşteri</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="ascending" className="form-label small">
                Sıralama
              </label>
              <select
                className="form-select form-select-sm"
                id="ascending"
                value={localFilters.ascending?.toString() || "false"}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    ascending: e.target.value === "true",
                  })
                }
                style={{ fontSize: "0.8rem" }}
              >
                <option value="false">📅 Yeniden Eskiye</option>
                <option value="true">📅 Eskiden Yeniye</option>
              </select>
            </div>
            <div className="col-md-6 d-flex align-items-end mt-2">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={handleSearch}
                disabled={isLoading}
                style={{ fontSize: "0.8rem" }}
              >
                {isLoading ? "Aranıyor..." : "Ara"}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClearFilter}
                style={{ fontSize: "0.8rem" }}
              >
                Temizle
              </button>
              {getActiveFiltersCount() > 0 && (
                <span
                  className="badge bg-info badge-sm ms-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  {getActiveFiltersCount()} filtre aktif
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {data && data.data && data.data.items && data.data.items.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-shopping-cart text-primary me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>Toplam Satış</span>
                </div>
                <h5 className="card-text text-primary mb-0">
                  {data.data.count}
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-boxes text-warning me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>Satılan Ürün</span>
                </div>
                <h5 className="card-text text-warning mb-0">
                  {calculateTotalQuantity()}
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-money-bill text-success me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>Toplam Tutar</span>
                </div>
                <h6
                  className="card-text text-success mb-0"
                  style={{ fontSize: "1rem" }}
                >
                  {formatCurrency(calculateTotalSales())}
                </h6>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-users text-info me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>Kayıtlı Müşteri</span>
                </div>
                <h5 className="card-text text-info mb-0">
                  {getRegisteredCustomersCount()}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center py-2">
          <h6 className="card-title mb-0 small m-3">Ürün Satış Raporu</h6>
          <button
            className="btn btn-success btn-sm m-3"
            onClick={handleExcelExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Excel Hazırlanıyor...
              </>
            ) : (
              <>
                <i className="bx bx-download me-1"></i>
                Excel İndir
              </>
            )}
          </button>
        </div>
        <div className="card-body">
          {isLoading && (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              Aradığınız kriterlere uygun satış kaydı bulunamadı.
            </div>
          )}

          {data && !isLoading && (
            <>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Toplam {data.data.count} satış kaydı bulundu
                  {getActiveFiltersCount() > 0 && " (filtrelenmiş)"}
                </small>
              </div>

              {data.data.items && data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Ürün Adı</th>
                        <th className="small">Kategori</th>
                        <th className="small">Miktar</th>
                        <th className="small">Toplam Tutar</th>
                        <th className="small">Sipariş No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="small">
                            <span
                              className="badge bg-primary badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {getGlobalRowNumber(displayPage, pageSize, index)}
                            </span>
                          </td>
                          <td className="small">
                            <div className="d-flex align-items-center">
                              <span className="fw-bold">
                                {item.productTitle}
                              </span>
                            </div>
                          </td>
                          <td className="small">
                            {item.mainCategory?.name ||
                              item.subCategory?.name ||
                              "N/A"}
                          </td>

                          <td className="small">
                            <span
                              className="badge bg-info badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {item.totalQuantity}
                            </span>
                          </td>

                          <td className="small">
                            <strong
                              className="text-success"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {formatCurrency(item.totalRevenue)}
                            </strong>
                          </td>

                          <td className="small">
                            <span
                              className="badge bg-warning-subtle text-warning badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {item.productBarcodeNumber}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="text-info">
                    <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                    <h6 className="small mb-1">Satış kaydı bulunmuyor.</h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {getActiveFiltersCount() > 0
                        ? "Belirtilen kriterlere göre satış kaydı bulunamadı. Filtreleri gözden geçirin."
                        : "Henüz satış kaydı bulunmuyor. Satışlar gerçekleştikçe burada görünecekler."}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalCount > 0 && (
            <div className="d-flex justify-content-center p-3 border-top">
              <CirclePagination
                totalCount={totalCount}
                pageSize={pageSize}
                currentPage={displayPage}
                onPageChange={(page) => changePage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSalesReportPage;
