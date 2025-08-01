import React, { useState } from "react";
import { useMostLikedProductsReport } from "@/hooks/services/reports/useMostLikedProductsReport";
import Link from "next/link";
import CirclePagination from "@/components/shared/CirclePagination";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_MOST_LIKED_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface LikedReportFilters {
  ascending?: boolean;
  categoryKeyword?: string;
  productNameKeyword?: string;
}

function MostLikedProductsReportPage() {
  const [ascending, setAscending] = useState<boolean>(false);
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
  const [productNameKeyword, setProductNameKeyword] = useState<string>("");

  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<LikedReportFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useMostLikedProductsReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setAscending(filters.ascending ?? false);
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setProductNameKeyword(filters.productNameKeyword ?? "");
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      ascending,
      categoryKeyword: categoryKeyword || undefined,
      productNameKeyword: productNameKeyword || undefined,
    });
  };

  const handleClearFilter = () => {
    setAscending(false);
    setCategoryKeyword("");
    setProductNameKeyword("");
    clearFilters();
  };

  const handleSortChange = (newAscending: boolean) => {
    setAscending(newAscending);
    updateFilters({
      ascending: newAscending,
      categoryKeyword: categoryKeyword || undefined,
      productNameKeyword: productNameKeyword || undefined,
    });
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_MOST_LIKED_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "en-begenilen-urunler-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y px-4">
      <h5 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        En Beğenilen Ürünler
      </h5>
      <BackButton href="/admin/reports" />

      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body py-2">
          {/* Sort Options */}
          <div className="row mb-2">
            <div className="col-12">
              <label className="form-label small mb-1">Sıralama Yönü</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input form-check-input-sm"
                    style={{
                      width: "0.8em",
                      height: "0.8em",
                      marginTop: "10px",
                    }}
                    type="radio"
                    name="sortOrder"
                    id="descending"
                    checked={!ascending}
                    onChange={() => handleSortChange(false)}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="descending"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Çok Beğenilen → Az Beğenilen
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input form-check-input-sm"
                    style={{
                      width: "0.8em",
                      height: "0.8em",
                      marginTop: "10px",
                    }}
                    type="radio"
                    name="sortOrder"
                    id="ascending"
                    checked={ascending}
                    onChange={() => handleSortChange(true)}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="ascending"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Az Beğenilen → Çok Beğenilen
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Text Filters */}
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="categoryKeyword" className="form-label small">
                Kategori Anahtar Kelimesi
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
            <div className="col-md-4">
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
            <div className="col-md-4 d-flex align-items-end">
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
        </div>
      </div>

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 m-3">En Beğenilen Ürünler</h5>
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
              {data.data?.items &&
              Array.isArray(data.data.items) &&
              data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Ürün Adı</th>
                        <th className="small">Kategori</th>
                        <th className="small">Beğeni Sayısı</th>
                        <th className="small">Barkod</th>
                        <th className="small">Son Güncelleme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data?.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="small">
                            <span
                              className="text-primary"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {getGlobalRowNumber(displayPage, pageSize, index)}
                            </span>
                          </td>
                          <td className="small">
                            <div className="d-flex align-items-center">
                              <span className="me-2">{item.title}</span>
                              {item.likeCount >= 100 && (
                                <span
                                  className="badge bg-danger-subtle text-danger badge-sm"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  💖 Super
                                </span>
                              )}
                              {item.likeCount >= 50 && item.likeCount < 100 && (
                                <span
                                  className="badge bg-warning-subtle text-warning badge-sm"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  ❤️ Popular
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="small">
                            {item.mainCategory?.name ||
                              item.subCategory?.name ||
                              "N/A"}
                          </td>
                          <td className="small">
                            <div className="d-flex align-items-center ">
                              <span
                                className="badge bg-danger badge-sm "
                                style={{ fontSize: "0.7rem" }}
                              >
                                {item.likeCount}
                              </span>
                            </div>
                          </td>
                          <td className="small text-secondary">
                            {item.barcodeNumber}
                          </td>
                          <td className="small">
                            {new Date(item.modifiedOnValue).toLocaleDateString(
                              "tr-TR",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="text-info">
                    <i className="fas fa-heart fa-2x mb-2"></i>
                    <h6 className="small mb-1">
                      Henüz beğenilen ürün bulunmuyor.
                    </h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {Object.keys(filters).filter(
                        (key) =>
                          key !== "ascending" &&
                          filters[key as keyof typeof filters]
                      ).length > 0
                        ? "Belirtilen kriterlere göre beğenilen ürün bulunamadı."
                        : "Müşterileriniz ürünlerinizi beğendikçe burada görünecekler."}
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

export default MostLikedProductsReportPage;
