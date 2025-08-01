import React, { useState } from "react";
import { useFavoriteProductsReport } from "@/hooks/services/reports/useFavoriteProductsReport";
import Link from "next/link";
import CirclePagination from "@/components/shared/CirclePagination";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_FAVORITE_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface FavoriteReportFilters {
  productNameKeyword?: string;
  categoryKeyword?: string;
  customerNameKeyword?: string;
  startDate?: string;
  endDate?: string;
}

function FavoriteProductsReportPage() {
  const [productNameKeyword, setProductNameKeyword] = useState<string>("");
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
  const [customerNameKeyword, setCustomerNameKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<FavoriteReportFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useFavoriteProductsReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setProductNameKeyword(filters.productNameKeyword ?? "");
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setCustomerNameKeyword(filters.customerNameKeyword ?? "");
    setStartDate(filters.startDate ?? "");
    setEndDate(filters.endDate ?? "");
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      productNameKeyword: productNameKeyword || undefined,
      categoryKeyword: categoryKeyword || undefined,
      customerNameKeyword: customerNameKeyword || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClearFilter = () => {
    setProductNameKeyword("");
    setCategoryKeyword("");
    setCustomerNameKeyword("");
    setStartDate("");
    setEndDate("");
    clearFilters();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR");
  };

  const getFavoriteLevel = (count: number) => {
    if (count >= 50)
      return { level: "Ultra Popular", color: "bg-danger", emoji: "🔥" };
    if (count >= 20)
      return { level: "Very Popular", color: "bg-warning", emoji: "⭐" };
    if (count >= 10) return { level: "Popular", color: "bg-info", emoji: "👍" };
    if (count >= 5) return { level: "Liked", color: "bg-primary", emoji: "💙" };
    return { level: "New", color: "bg-secondary", emoji: "💚" };
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(
      (key) => filters[key as keyof typeof filters]
    ).length;
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_FAVORITE_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "favori-urunler-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y px-4">
      <h5 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Favori Ürünler
      </h5>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body py-2">
          <h6 className="card-title mb-2 small">Filtreler</h6>
          {/* Product & Category Filters */}
          <div className="row mb-2">
            <div className="col-md-3">
              <label htmlFor="productNameKeyword" className="form-label small">
                Ürün Adı
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="productNameKeyword"
                placeholder="Ürün adı girin..."
                value={productNameKeyword}
                onChange={(e) => setProductNameKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                value={categoryKeyword}
                onChange={(e) => setCategoryKeyword(e.target.value)}
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
                value={customerNameKeyword}
                onChange={(e) => setCustomerNameKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-dark btn-sm me-2"
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
            </div>
          </div>

          {/* Date Filters */}
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="startDate" className="form-label small">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="endDate" className="form-label small">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                className="form-control form-control-sm"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              {getActiveFiltersCount() > 0 && (
                <span
                  className="badge bg-info badge-sm"
                  style={{ fontSize: "0.7rem" }}
                >
                  {getActiveFiltersCount()} filtre aktif
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center py-2">
          <h6 className="card-title mb-0 small m-3">Favori Ürünler Raporu</h6>
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
            <div className="alert alert-danger mt-3" role="alert">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </div>
          )}

          {data && !isLoading && (
            <>
              {data.data.items &&
              Array.isArray(data.data.items) &&
              data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Ürün Adı</th>
                        <th className="small">Müşteri</th>
                        <th className="small">Kategori</th>
                        <th className="small">Eklenme Tarihi</th>
                        <th className="small">Fiyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => {
                        return (
                          <tr key={item.id}>
                            <td className="small">
                              <span
                                className="badge text-primary badge-sm"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {getGlobalRowNumber(
                                  displayPage,
                                  pageSize,
                                  index
                                )}
                              </span>
                            </td>
                            <td className="small">
                              <div className="d-flex align-items-center">
                                <span className="me-2">
                                  {item.productTitle}
                                </span>
                                {item.favoriteCount >= 50 && (
                                  <span
                                    className="badge bg-danger-subtle text-danger badge-sm"
                                    style={{ fontSize: "0.65rem" }}
                                  >
                                    🔥 Hot
                                  </span>
                                )}
                                {item.favoriteCount >= 20 &&
                                  item.favoriteCount < 50 && (
                                    <span
                                      className="badge bg-warning-subtle text-warning badge-sm"
                                      style={{ fontSize: "0.65rem" }}
                                    >
                                      ⭐ Trend
                                    </span>
                                  )}
                              </div>
                            </td>

                            <td className="small">{item.customerFullName}</td>
                            <td className="small">
                              {item.mainCategory?.name ||
                                item.subCategory?.name ||
                                "N/A"}
                            </td>

                            <td className="small">
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {formatDateTime(item.favoritedOn)}
                              </small>
                            </td>
                            <td className="small">
                              <span
                                className="badge bg-success-subtle text-success badge-sm"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {item.productPrice} ₺
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="text-info">
                    <i className="fas fa-heart fa-2x mb-2"></i>
                    <h6 className="small mb-1">
                      Favori ürün kaydı bulunmuyor.
                    </h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {getActiveFiltersCount() > 0
                        ? "Belirtilen kriterlere göre favori ürün bulunamadı. Filtreleri gözden geçirin."
                        : "Müşterileriniz ürünlerinizi favorilerine ekledikçe burada görünecekler."}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {/* Pagination */}
        {data?.data?.count && data.data.count > pageSize && (
          <div className="card-footer">
            <div className="d-flex justify-content-center">
              <CirclePagination
                currentPage={displayPage}
                totalCount={data.data.count}
                pageSize={pageSize}
                onPageChange={(page) => changePage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteProductsReportPage;
