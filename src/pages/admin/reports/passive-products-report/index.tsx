import React, { useState } from "react";
import { usePassiveProductsReport } from "@/hooks/services/reports/usePassiveProductsReport";
import Link from "next/link";
import { useRouter } from "next/router";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_PASSIVE_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface PassiveProductsFilters {
  categoryKeyword?: string;
  barcodeNumberKeyword?: string;
}

function PassiveProductsReportPage() {
  const router = useRouter();

  // Local state for form inputs
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
  const [barcodeNumberKeyword, setBarcodeNumberKeyword] = useState<string>("");

  // Use modern pagination hook
  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<PassiveProductsFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = usePassiveProductsReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setBarcodeNumberKeyword(filters.barcodeNumberKeyword ?? "");
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      categoryKeyword: categoryKeyword || undefined,
      barcodeNumberKeyword: barcodeNumberKeyword || undefined,
    });
  };

  const handleClearFilter = () => {
    setCategoryKeyword("");
    setBarcodeNumberKeyword("");
    clearFilters();
  };

  // Toplam sayfa sayısını hesapla
  const totalCount = data?.data?.count || 0;

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_PASSIVE_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "pasif-urunler-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y px-4">
      <h5 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Pasif Ürünler Raporu
      </h5>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header bg-white" style={{ borderBottom: "0px" }}>
          <h5 className="card-title mb-0 p-3">Filtreler</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="categoryKeyword" className="form-label">
                KATEGORİ VEYA ALT KATEGORİ ADI GİRİNİZ
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
              <label htmlFor="barcodeNumberKeyword" className="form-label">
                Barkod Numarası
              </label>
              <input
                type="text"
                className="form-control"
                id="barcodeNumberKeyword"
                placeholder="Barkod numarası girin..."
                value={barcodeNumberKeyword}
                onChange={(e) => setBarcodeNumberKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
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
        <div className="card-header bg-white d-flex justify-content-between align-items-center" style={{ borderBottom: "0px" }}>
          <h5 className="card-title mb-0 p-3">Pasif Ürünler Raporu</h5>
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
              Aradığınız kriterlere uygun pasif ürün bulunamadı.
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
                        <th className="large">#</th>
                        <th className="large">Ürün Adı</th>
                        <th className="large">Kategori</th>
                        <th className="large">Barkod No</th>
                        <th className="large">Fiyat</th>
                        <th className="large">Stok</th>
                        <th className="large">Durum</th>
                        <th className="large">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="large">
                            <span
                              className="badge text-dark badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {getGlobalRowNumber(displayPage, pageSize, index)}
                            </span>
                          </td>
                          <td className="large">
                            <div className="d-flex align-items-center">
                              <span className="me-2">{item.title}</span>
                            </div>
                          </td>
                          <td className="large">
                            {item.mainCategory?.name ||
                              item.subCategory?.name ||
                              "N/A"}
                          </td>
                          <td className="large">
                            <code className="bg-light p-1 rounded small">
                              {item.barcodeNumber}
                            </code>
                          </td>
                          <td className="large">
                            {item.price.toLocaleString("tr-TR")} ₺
                          </td>
                          <td className="large">
                            <span
                              className={`badge badge-sm ${
                                item.sellableQuantity > 0
                                  ? "bg-dark"
                                  : "bg-danger"
                              }`}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item.sellableQuantity}
                            </span>
                          </td>
                          <td className="large">
                            <span
                              className="badge text-danger badge-sm"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item.isAvailable ? "Aktif" : "Pasif"}
                            </span>
                          </td>
                          <td className="large">
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
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-success">
                    <i className="fas fa-check-circle fa-3x mb-3"></i>
                    <h5>Harika! Pasif ürün bulunamadı.</h5>
                    <p className="text-muted">Tüm ürünleriniz aktif durumda.</p>
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

export default PassiveProductsReportPage;
