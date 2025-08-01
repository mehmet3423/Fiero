import React, { useState } from "react";
import { useMediaMissingProductsReport } from "@/hooks/services/reports/useMediaMissingProductsReport";
import Link from "next/link";
import { useRouter } from "next/router";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_MEDIA_MISSING_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface MediaMissingReportFilters {
  withoutContentImage?: boolean;
  withoutBanner?: boolean;
  withoutVideo?: boolean;
  categoryKeyword?: string;
  productNameKeyword?: string;
}

function MediaMissingProductsReportPage() {
  const router = useRouter();

  // Local state for form inputs
  const [withoutContentImage, setWithoutContentImage] =
    useState<boolean>(false);
  const [withoutBanner, setWithoutBanner] = useState<boolean>(false);
  const [withoutVideo, setWithoutVideo] = useState<boolean>(false);
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
  const [productNameKeyword, setProductNameKeyword] = useState<string>("");

  // Use modern pagination hook
  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<MediaMissingReportFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useMediaMissingProductsReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setWithoutContentImage(filters.withoutContentImage ?? false);
    setWithoutBanner(filters.withoutBanner ?? false);
    setWithoutVideo(filters.withoutVideo ?? false);
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setProductNameKeyword(filters.productNameKeyword ?? "");
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      withoutContentImage: withoutContentImage || undefined,
      withoutBanner: withoutBanner || undefined,
      withoutVideo: withoutVideo || undefined,
      categoryKeyword: categoryKeyword || undefined,
      productNameKeyword: productNameKeyword || undefined,
    });
  };

  const handleClearFilter = () => {
    setWithoutContentImage(false);
    setWithoutBanner(false);
    setWithoutVideo(false);
    setCategoryKeyword("");
    setProductNameKeyword("");
    clearFilters();
  };

  // Toplam sayfa sayısını hesapla
  const totalCount = data?.data?.count || 0;

  const getMissingMediaInfo = (item: any) => {
    const missing = [];
    if (!item.contentImageUrls || item.contentImageUrls.length === 0)
      missing.push("İçerik Görseli");
    if (!item.banner || item.banner.length === 0) missing.push("Banner");
    if (!item.videoUrl) missing.push("Video");
    return missing;
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_MEDIA_MISSING_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "medya-eksik-urunler-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y px-4">
      <h5 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Medya Eksik Ürünler Raporu
      </h5>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0 p-3">Filtreler</h5>
        </div>
        <div className="card-body">
          {/* Media Type Filters */}
          <div className="row mb-2">
            <div className="col-12">
              <h6 className="mb-2" style={{ fontSize: "1rem" }}>
                Eksik Medya Türleri
              </h6>
              <div className="d-flex flex-wrap gap-3">
                <div
                  className="form-check d-flex align-items-center"
                  style={{ minWidth: "180px" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="withoutContentImage"
                    checked={withoutContentImage}
                    onChange={(e) => setWithoutContentImage(e.target.checked)}
                    style={{ width: "1em", height: "1em" }}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor="withoutContentImage"
                    style={{ fontSize: "0.95rem" }}
                  >
                    İçerik Görseli Olmayan
                  </label>
                </div>
                <div
                  className="form-check d-flex align-items-center"
                  style={{ minWidth: "150px" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="withoutBanner"
                    checked={withoutBanner}
                    onChange={(e) => setWithoutBanner(e.target.checked)}
                    style={{ width: "1em", height: "1em" }}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor="withoutBanner"
                    style={{ fontSize: "0.95rem" }}
                  >
                    Banner Olmayan
                  </label>
                </div>
                <div
                  className="form-check d-flex align-items-center"
                  style={{ minWidth: "140px" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="withoutVideo"
                    checked={withoutVideo}
                    onChange={(e) => setWithoutVideo(e.target.checked)}
                    style={{ width: "1em", height: "1em" }}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor="withoutVideo"
                    style={{ fontSize: "0.95rem" }}
                  >
                    Video Olmayan
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Text Filters */}
          <div className="row">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <label htmlFor="productNameKeyword" className="form-label">
                Ürün Adı
              </label>
              <input
                type="text"
                className="form-control"
                id="productNameKeyword"
                placeholder="Ürün adı girin..."
                value={productNameKeyword}
                onChange={(e) => setProductNameKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <button
                className="btn btn-dark me-2"
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
          <h5 className="card-title mb-0 p-3">Medya Eksik Ürünler Raporu</h5>
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
                        <th className="small">Kategori</th>
                        <th className="small">Eksik Medya</th>
                        <th className="small">Oluşturulma</th>
                        <th className="small">Son Güncelleme</th>
                        <th className="small">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => {
                        const missingMedia = getMissingMediaInfo(item);
                        return (
                          <tr key={item.id}>
                            <td className="small">
                              <span
                                className="badge text-dark badge-sm"
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
                                <span className="me-2">{item.title}</span>
                                {missingMedia.length > 0 && (
                                  <span
                                    className="badge bg-warning-subtle text-warning badge-sm"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {missingMedia.length} Eksik
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
                              <div className="d-flex flex-column gap-1">
                                {!item.contentImageUrls ||
                                  (item.contentImageUrls.length === 0 && (
                                    <span
                                      className="badge bg-danger-subtle text-danger badge-sm"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      İçerik Görseli
                                    </span>
                                  ))}
                                {!item.banner || item.banner.length === 0 ? (
                                  <span
                                    className="badge bg-warning-subtle text-warning badge-sm"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    Banner
                                  </span>
                                ) : null}
                                {!item.videoUrl && (
                                  <span
                                    className="badge bg-info-subtle text-info badge-sm"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    Video
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="small">
                              {new Date(item.createdOnValue).toLocaleDateString(
                                "tr-TR",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </td>
                            <td className="small">
                              {new Date(
                                item.modifiedOnValue
                              ).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </td>
                            <td className="small">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(item.id)}
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                                title="Ürünü Düzenle"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-success">
                    <i className="fas fa-images fa-3x mb-3"></i>
                    <h5>Harika! Medya eksik ürün bulunamadı.</h5>
                    <p className="text-muted">
                      {Object.keys(filters).length > 0
                        ? "Belirtilen kriterlere göre tüm ürünlerin medya içerikleri tam."
                        : "Tüm ürünlerinizin medya içerikleri eksiksiz."}
                    </p>
                  </div>
                </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaMissingProductsReportPage;
