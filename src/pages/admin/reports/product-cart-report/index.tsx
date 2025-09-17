import React, { useState } from "react";
import { useProductCartReport } from "@/hooks/services/reports/useProductCartReport";
import Link from "next/link";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_PRODUCT_CART_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface ProductCartFilters {
  customerNameKeyword?: string;
  categoryKeyword?: string;
  productNameKeyword?: string;
}

function ProductCartReportPage() {
  // Local state for form inputs
  const [customerNameKeyword, setCustomerNameKeyword] = useState<string>("");
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
  } = useReportPagination<ProductCartFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  // Modal state'leri
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [selectedProductCustomers, setSelectedProductCustomers] = useState<{
    productTitle: string;
    customers: Array<{
      customerId: string;
      customerFullName: string;
      quantity: number;
      createdOnValue: string;
    }>;
  } | null>(null);

  const { data, isLoading, error, refetch } = useProductCartReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setCustomerNameKeyword(filters.customerNameKeyword ?? "");
    setCategoryKeyword(filters.categoryKeyword ?? "");
    setProductNameKeyword(filters.productNameKeyword ?? "");
  }, [filters]);

  const handleSearch = () => {
    updateFilters({
      customerNameKeyword: customerNameKeyword || undefined,
      categoryKeyword: categoryKeyword || undefined,
      productNameKeyword: productNameKeyword || undefined,
    });
  };

  const handleClearFilter = () => {
    setCustomerNameKeyword("");
    setCategoryKeyword("");
    setProductNameKeyword("");
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

  const calculateTotalProducts = () => {
    if (!data?.data?.items) return 0;
    // Benzersiz ürün sayısını hesapla
    const uniqueProducts = new Set(
      data.data.items.map((item) => item.productId)
    );
    return uniqueProducts.size;
  };

  const calculateTotalQuantity = () => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce((total, item) => {
      // Tüm müşterilerden toplam miktarı hesapla
      const totalQuantityForProduct =
        item.customerCartReport?.reduce(
          (sum, cartItem) => sum + (cartItem.quantity || 0),
          0
        ) || 0;
      return total + totalQuantityForProduct;
    }, 0);
  };

  const getActiveCartsCount = () => {
    if (!data?.data?.items) return 0;
    // Her müşteri sepeti sayısını hesapla
    return data.data.items.reduce((total, item) => {
      return total + (item.customerCartReport?.length || 0);
    }, 0);
  };

  const getQuantityBadgeClass = (quantity: number) => {
    if (quantity >= 10) return "bg-success";
    if (quantity >= 5) return "bg-warning";
    return "bg-info";
  };

  const handleShowCustomers = (productTitle: string, customers: any[]) => {
    setSelectedProductCustomers({
      productTitle,
      customers,
    });
    setShowCustomersModal(true);
  };

  const handleCloseModal = () => {
    setShowCustomersModal(false);
    setSelectedProductCustomers(null);
  };

  // Toplam sayfa sayısını hesapla
  const totalCount = data?.data?.count || 0;

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_PRODUCT_CART_REPORT_EXCEL,
      apiParams,
      "urun-sepet-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Ürün Sepet Raporu
      </h4>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header py-2">
          <h5 className="card-title mb-0 small m-3">Filtreler</h5>
        </div>
        <div className="card-body py-3">
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="customerNameKeyword" className="form-label small">
                Müşteri Adı
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="customerNameKeyword"
                placeholder="Müşteri adı..."
                value={customerNameKeyword}
                onChange={(e) => setCustomerNameKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                placeholder="Kategori adı..."
                value={categoryKeyword}
                onChange={(e) => setCategoryKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="productNameKeyword" className="form-label small">
                Ürün Adı
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="productNameKeyword"
                placeholder="Ürün adı..."
                value={productNameKeyword}
                onChange={(e) => setProductNameKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? "Aranıyor..." : "Ara"}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleClearFilter}
              >
                Temizle
              </button>
              {getActiveFiltersCount() > 0 && (
                <span
                  className="badge bg-info ms-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  {getActiveFiltersCount()} filtre
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {data?.data?.items && data.data.items.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-shopping-cart text-primary me-2"></i>
                  Toplam Ürün
                </div>
                <h4 className="card-text text-primary mb-0">
                  {calculateTotalProducts()}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-boxes text-warning me-2"></i>
                  Toplam Adet
                </div>
                <h4 className="card-text text-warning mb-0">
                  {calculateTotalQuantity()}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body py-3">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-chart-line text-success me-2"></i>
                  Sepet Kaydı
                </div>
                <h4 className="card-text text-success mb-0">
                  {getActiveCartsCount()}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center py-3">
          <h5 className="card-title mb-0 small m-3">Sepet Analizi</h5>
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
        <div className="card-body py-3">
          {isLoading && (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
              <p className="mt-2 small text-muted">Veriler yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger alert-sm py-2" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <small>Aradığınız kriterlere uygun sepet kaydı bulunamadı.</small>
            </div>
          )}

          {data && !isLoading && (
            <>
              {data?.data?.items && data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr className="small">
                        <th style={{ width: "5%" }}>#</th>
                        <th style={{ width: "20%" }}>Ürün</th>
                        <th style={{ width: "12%" }}>Kategori</th>
                        <th style={{ width: "15%" }}>Müşteri</th>
                        <th style={{ width: "8%" }}>Miktar</th>
                        <th style={{ width: "12%" }}>Eklenme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => {
                        // Ürün için toplam miktar hesapla
                        const totalQuantity =
                          item.customerCartReport?.reduce(
                            (sum, cartItem) => sum + (cartItem.quantity || 0),
                            0
                          ) || 0;

                        // En eski sepet tarihini al (aciliyet için)
                        const oldestCart = item.customerCartReport?.reduce(
                          (oldest, current) => {
                            if (!oldest.createdOnValue) return current;
                            if (!current.createdOnValue) return oldest;
                            return new Date(oldest.createdOnValue) <
                              new Date(current.createdOnValue)
                              ? oldest
                              : current;
                          }
                        );

                        const hasActiveCart =
                          item.customerCartReport &&
                          item.customerCartReport.length > 0;

                        return (
                          <tr
                            key={`${item.productId}-${index}`}
                            className="small"
                          >
                            <td>
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
                            <td>
                              <div className="d-flex align-items-center">
                                <span
                                  className="me-2"
                                  title={item.productTitle}
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  {item.productTitle?.length > 30
                                    ? `${item.productTitle.substring(0, 30)}...`
                                    : item.productTitle || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className="badge bg-light text-dark"
                                style={{ fontSize: "0.65rem" }}
                              >
                                {item.mainCategory?.name ||
                                  item.subCategory?.name ||
                                  "N/A"}
                              </span>
                            </td>
                            <td>
                              {hasActiveCart ? (
                                <div style={{ maxWidth: "200px" }}>
                                  {item.customerCartReport.length <= 2 ? (
                                    // 2 müşteri veya daha azsa hepsini göster
                                    <div>
                                      {item.customerCartReport.map(
                                        (cartItem, customerIndex) => (
                                          <span
                                            key={`customer-${customerIndex}`}
                                            className="badge bg-info-subtle text-info me-1 mb-1"
                                            style={{ fontSize: "0.6rem" }}
                                            title={`${cartItem.customerFullName} - ${cartItem.quantity} adet`}
                                          >
                                            {cartItem.customerFullName || "N/A"}{" "}
                                            ({cartItem.quantity})
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    // 2'den fazla müşteri varsa compact göster
                                    <div>
                                      {/* İlk 2 müşteriyi göster */}
                                      {item.customerCartReport
                                        .slice(0, 2)
                                        .map((cartItem, customerIndex) => (
                                          <span
                                            key={`customer-${customerIndex}`}
                                            className="badge bg-info-subtle text-info me-1 mb-1"
                                            style={{ fontSize: "0.6rem" }}
                                            title={`${cartItem.customerFullName} - ${cartItem.quantity} adet`}
                                          >
                                            {cartItem.customerFullName || "N/A"}{" "}
                                            ({cartItem.quantity})
                                          </span>
                                        ))}
                                      {/* Kalan müşteri sayısını göster */}
                                      <span
                                        className="badge bg-secondary me-1"
                                        style={{
                                          fontSize: "0.6rem",
                                          cursor: "pointer",
                                        }}
                                        title={`Diğer müşteriler: ${item.customerCartReport
                                          .slice(2)
                                          .map(
                                            (c) =>
                                              `${c.customerFullName} (${c.quantity})`
                                          )
                                          .join(", ")}`}
                                        onClick={() =>
                                          handleShowCustomers(
                                            item.productTitle || "",
                                            item.customerCartReport
                                          )
                                        }
                                      >
                                        +{item.customerCartReport.length - 2}{" "}
                                        diğer
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span
                                  className="badge bg-secondary"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  N/A
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`badge ${getQuantityBadgeClass(
                                  totalQuantity
                                )}`}
                                style={{ fontSize: "0.65rem" }}
                              >
                                {totalQuantity} adet
                              </span>
                            </td>

                            <td>
                              {hasActiveCart && oldestCart?.createdOnValue ? (
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {formatDateTime(oldestCart.createdOnValue)}
                                </small>
                              ) : (
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  N/A
                                </small>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-primary">
                    <i className="fas fa-shopping-cart fa-2x mb-3"></i>
                    <h6>Sepet kaydı bulunmuyor</h6>
                    <p className="text-muted small">
                      {getActiveFiltersCount() > 0
                        ? "Belirtilen kriterlere göre sepet kaydı bulunamadı. Filtreleri gözden geçirin."
                        : "Müşteriler ürünleri sepetlerine ekledikçe burada görünecekler."}
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

      {/* Customer Details Modal */}
      {showCustomersModal && selectedProductCustomers && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-users me-2 text-primary"></i>
                  Müşteri Detayları
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Ürün:</h6>
                  <span className="badge bg-light text-dark p-2">
                    {selectedProductCustomers.productTitle}
                  </span>
                </div>

                <h6 className="text-muted mb-3">
                  Sepete Ekleyen Müşteriler (
                  {selectedProductCustomers.customers.length})
                </h6>

                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th style={{ width: "40%" }}>Müşteri Adı</th>
                        <th style={{ width: "15%" }}>Miktar</th>
                        <th style={{ width: "25%" }}>Eklenme Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProductCustomers.customers.map(
                        (customer, index) => (
                          <tr key={`modal-customer-${index}`}>
                            <td>
                              <span
                                className="badge bg-primary"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td>
                              <strong>{customer.customerFullName}</strong>
                            </td>
                            <td>
                              <span
                                className="badge bg-info"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {customer.quantity} adet
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {customer.createdOnValue
                                  ? formatDateTime(customer.createdOnValue)
                                  : "N/A"}
                              </small>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 p-3 bg-light rounded">
                  <div className="row text-center">
                    <div className="col-md-6">
                      <strong className="text-primary">
                        {selectedProductCustomers.customers.length}
                      </strong>
                      <br />
                      <small className="text-muted">Toplam Müşteri</small>
                    </div>
                    <div className="col-md-6">
                      <strong className="text-success">
                        {selectedProductCustomers.customers.reduce(
                          (sum, c) => sum + c.quantity,
                          0
                        )}
                      </strong>
                      <br />
                      <small className="text-muted">Toplam Adet</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCartReportPage;
