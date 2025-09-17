import React, { useState } from "react";
import Link from "next/link";
import CirclePagination from "@/components/shared/CirclePagination";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_UNSOLD_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import { useUnsoldProductsReport } from "@/hooks/services/reports/useUnsoldProductsReport";
import BackButton from "@/components/shared/BackButton";

interface UnsoldProductsReportFilters {
  productNameKeyword?: string;
  categoryKeyword?: string;
  startDate?: string;
  endDate?: string;
}

function UnsoldProductsReportPage() {
  const [productNameKeyword, setProductNameKeyword] = useState<string>("");
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
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
  } = useReportPagination<UnsoldProductsReportFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useUnsoldProductsReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setProductNameKeyword(filters.productNameKeyword ?? "");
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setStartDate(filters.startDate ?? "");
    setEndDate(filters.endDate ?? "");
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      productNameKeyword: productNameKeyword || undefined,
      categoryKeyword: categoryKeyword || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClearFilter = () => {
    setProductNameKeyword("");
    setCategoryKeyword("");
    setStartDate("");
    setEndDate("");
    clearFilters();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR");
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(
      (key) => filters[key as keyof typeof filters]
    ).length;
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_UNSOLD_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "satilmayan-urunler-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Satılmayan Ürünler
      </h4>
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
            <div className="col-md-3 d-flex align-items-end">
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
          <h6 className="card-title mb-0 small m-3">
            Satılmayan Ürünler Raporu
          </h6>
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
                        <th className="small">Kategori</th>
                        <th className="small">Barkod</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => {
                        return (
                          <tr key={item.id}>
                            <td className="small">
                              <span
                                className="text-primary badge-sm me-2"
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
                              <small className="text-muted">
                                {item.productTitle}
                              </small>
                            </td>

                            <td className="small">
                              {item.mainCategory?.name ||
                                item.subCategory?.name ||
                                "N/A"}
                            </td>

                            <td className="small">
                              <small className="text-muted">
                                {item.productBarcodeNumber}
                              </small>
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
                      Satılmayan ürün kaydı bulunmuyor.
                    </h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {getActiveFiltersCount() > 0
                        ? "Belirtilen kriterlere göre satılmayan ürün bulunamadı. Filtreleri gözden geçirin."
                        : "Satılmayan ürünlerinizin barkodları burada görünecekler."}
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

export default UnsoldProductsReportPage;
