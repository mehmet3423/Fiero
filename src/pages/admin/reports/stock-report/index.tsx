import React, { useState } from "react";
import { useStockReport } from "@/hooks/services/reports/useStockReport";
import Link from "next/link";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_STOCK_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface StockReportFilters {
  categoryKeyword?: string;
  ascending?: boolean;
}

function StockReportPage() {
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<boolean | undefined>(undefined);

  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<StockReportFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useStockReport(getApiParams());
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setSortOrder(filters.ascending);
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      categoryKeyword: categoryKeyword || undefined,
      ascending: sortOrder,
    });
  };

  const handleClearFilter = () => {
    setCategoryKeyword("");
    setSortOrder(undefined);
    clearFilters();
  };

  const handleSortChange = (ascending: boolean | undefined) => {
    setSortOrder(ascending);
    updateFilters({
      categoryKeyword: filters.categoryKeyword,
      ascending: ascending,
    });
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(GET_STOCK_REPORT_EXCEL, apiParams, "stok-raporu.xlsx");
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Stok Raporu
      </h4>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0 p-3">Filtreler</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="categoryKeyword" className="form-label">
                Kategori Anahtar Kelimesi
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryKeyword"
                placeholder="Kategori adı girin..."
                value={categoryKeyword}
                onChange={(e) => setCategoryKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Sıralama</label>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm ${
                    sortOrder === true ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleSortChange(true)}
                  disabled={isLoading}
                >
                  <i className="bx bx-sort-up me-1"></i>
                  Artan
                </button>
                <button
                  className={`btn btn-sm ${
                    sortOrder === false ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleSortChange(false)}
                  disabled={isLoading}
                >
                  <i className="bx bx-sort-down me-1"></i>
                  Azalan
                </button>
                <button
                  className={`btn btn-sm ${
                    sortOrder === undefined
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => handleSortChange(undefined)}
                  disabled={isLoading}
                >
                  <i className="bx bx-x me-1"></i>
                  Varsayılan
                </button>
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-primary me-2"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? "Aranıyor..." : "Ara"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleClearFilter}
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 p-3">Stok Raporu</h5>
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
                <i className="bx bx-download me-1 "></i>
                Excel İndir
              </>
            )}
          </button>
        </div>
        <div className="card-body">
          {isLoading && (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </div>
          )}

          {data && !isLoading && (
            <>
              {data?.data?.items &&
              Array.isArray(data.data.items) &&
              data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Ürün Adı</th>
                        <th className="small">Fiyat</th>
                        <th className="small">Barkod Numarası</th>
                        <th className="small">Stok</th>
                        <th className="small">Son Güncelleme</th>
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
                            <td className="small">{item.title}</td>
                            <td className="small">{item.price}₺</td>
                            <td className="small">{item.barcodeNumber}</td>
                            <td className="small">
                              <span
                                className={`badge badge-sm ${
                                  item.sellableQuantity > 10
                                    ? "bg-success"
                                    : item.sellableQuantity > 0
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                                style={{
                                  fontSize: "0.75rem",
                                }}
                              >
                                {item.sellableQuantity}
                              </span>
                            </td>
                            <td className="small">
                              {item?.modifiedOnValue || item?.createdOnValue
                                ? new Date(
                                    item.modifiedOnValue || item.createdOnValue
                                  ).toLocaleDateString("tr-TR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Hiç veri bulunamadı.</p>
                </div>
              )}

              {/* Pagination */}
              {data?.data?.count && data.data.count > pageSize && (
                <div className="d-flex justify-content-center p-3 border-top">
                  <CirclePagination
                    currentPage={displayPage}
                    totalCount={data.data.count}
                    pageSize={pageSize}
                    onPageChange={(page) => changePage(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
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
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          color: #697a8d;
          background-color: transparent;
        }

        .page-link:hover {
          background-color: #e7e7ff;
          color: #696cff;
          border-color: #d9dee3;
        }

        .page-item.active .page-link {
          background-color: #696cff;
          border-color: #696cff;
          color: #fff;
        }

        .page-item.disabled .page-link {
          color: #697a8d;
          pointer-events: none;
          background-color: transparent;
          border-color: #d9dee3;
        }

        .page-link i {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

export default StockReportPage;
