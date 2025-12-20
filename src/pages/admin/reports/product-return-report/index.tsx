import React, { useState } from "react";
import { useProductReturnReport } from "@/hooks/services/reports/useProductReturnReport";
import {
  CancelReasonType,
  getCancelReasonTypeDisplayName,
  getCancelReasonTypeColor,
  getCancelReasonTypeIcon,
} from "@/constants/models/reports";
import Link from "next/link";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_PRODUCT_RETURN_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";
import { formatCurrency } from "@/utils/currencyFormatter";
import { formatDate, formatDateTime } from "@/utils/dateFormatter";

function ProductReturnReportPage() {
  const [categoryKeyword, setCategoryKeyword] = useState<string>("");
  const [cancelReasonType, setCancelReasonType] = useState<CancelReasonType>(
    CancelReasonType.ALL
  );

  const [filterParams, setFilterParams] = useState<{
    categoryKeyword?: string;
    cancelReasonType?: CancelReasonType;
  }>({});

  const { data, isLoading, error, refetch } =
    useProductReturnReport(filterParams);
  const { exportToExcel, isExporting } = useExcelExport();

  const handleSearch = () => {
    setFilterParams({
      categoryKeyword: categoryKeyword || undefined,
      cancelReasonType:
        cancelReasonType !== CancelReasonType.ALL
          ? cancelReasonType
          : undefined,
    });
  };

  const handleClearFilter = () => {
    setCategoryKeyword("");
    setCancelReasonType(CancelReasonType.ALL);
    setFilterParams({});
  };

  const getReturnSeverity = (reasonType: CancelReasonType) => {
    switch (reasonType) {
      case CancelReasonType.DEFECTIVE_PRODUCT:
        return { level: "Kritik", color: "bg-danger", priority: 4 };
      case CancelReasonType.WRONG_PRODUCT:
        return { level: "Yüksek", color: "bg-warning", priority: 3 };
      case CancelReasonType.LATE_DELIVERY:
        return { level: "Orta", color: "bg-secondary", priority: 2 };
      case CancelReasonType.CUSTOMER_CHANGED_MIND:
        return { level: "Düşük", color: "bg-info", priority: 1 };
      default:
        return { level: "Normal", color: "bg-primary", priority: 0 };
    }
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filterParams).filter(
      (key) => filterParams[key as keyof typeof filterParams] !== undefined
    ).length;
  };

  const calculateTotalRefund = () => {
    if (!data?.data) return 0;
    return data.data.reduce((total, item) => total + item.refundAmount, 0);
  };

  const calculateTotalReturns = () => {
    if (!data?.data) return 0;
    return data.data.reduce((total, item) => total + item.returnQuantity, 0);
  };

  const getReasonTypeStats = () => {
    if (!data?.data) return {};
    const stats: { [key: string]: number } = {};
    data.data.forEach((item) => {
      const reasonName = getCancelReasonTypeDisplayName(item.cancelReasonType);
      stats[reasonName] = (stats[reasonName] || 0) + 1;
    });
    return stats;
  };

  const handleExcelExport = () => {
    exportToExcel(
      GET_PRODUCT_RETURN_REPORT_EXCEL,
      filterParams,
      "urun-iade-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        Ürün İade Raporu
      </h4>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body py-2">
          <h6 className="card-title mb-2 small">Filtreler</h6>
          <div className="row mb-2">
            <div className="col-md-4">
              <label htmlFor="cancelReasonType" className="form-label small">
                İade Nedeni Türü
              </label>
              <select
                className="form-select form-select-sm"
                id="cancelReasonType"
                value={cancelReasonType}
                onChange={(e) =>
                  setCancelReasonType(
                    Number(e.target.value) as CancelReasonType
                  )
                }
                style={{ fontSize: "0.8rem" }}
              >
                <option value={CancelReasonType.ALL}>Tümü</option>
                <option value={CancelReasonType.DEFECTIVE_PRODUCT}>
                  ⚠️ Kusurlu Ürün
                </option>
                <option value={CancelReasonType.WRONG_PRODUCT}>
                  ❌ Yanlış Ürün
                </option>
                <option value={CancelReasonType.CUSTOMER_CHANGED_MIND}>
                  🤔 Müşteri Fikir Değiştirdi
                </option>
                <option value={CancelReasonType.LATE_DELIVERY}>
                  ⏰ Geç Teslimat
                </option>
              </select>
            </div>
            <div className="col-md-4">
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
            <div className="col-md-4 d-flex align-items-end mt-2">
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
      {data && data.data && data.data.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-undo text-primary me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>Toplam İade</span>
                </div>
                <h5 className="card-text text-primary mb-0">
                  {data.totalCount}
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-boxes text-warning me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>İade Adedi</span>
                </div>
                <h5 className="card-text text-warning mb-0">
                  {calculateTotalReturns()}
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
                  {formatCurrency(calculateTotalRefund())}
                </h6>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-chart-pie text-info me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>İade Türü</span>
                </div>
                <h5 className="card-text text-info mb-0">
                  {Object.keys(getReasonTypeStats()).length}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center py-2">
          <h6 className="card-title mb-0 small m-3">Ürün İade Raporu</h6>
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
              Aradığınız kriterlere uygun ürün iade kaydı bulunamadı.
            </div>
          )}

          {data && !isLoading && (
            <>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Toplam {data.totalCount} ürün iade kaydı bulundu
                  {getActiveFiltersCount() > 0 && " (filtrelenmiş)"}
                </small>
                {data.totalCount > 0 && (
                  <div className="text-end">
                    <small
                      className="text-warning"
                      style={{ fontSize: "0.8rem" }}
                    >
                      🔄 İade trend analizi
                    </small>
                  </div>
                )}
              </div>

              {data.data && data.data.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Ürün Adı</th>
                        <th className="small">Kategori</th>
                        <th className="small">Müşteri</th>
                        <th className="small">İade Nedeni</th>
                        <th className="small">Öncelik</th>
                        <th className="small">Miktar</th>
                        <th className="small">Tutar</th>
                        <th className="small">İade Tarihi</th>
                        <th className="small">Sipariş Tarihi</th>
                        <th className="small">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.map((item, index) => {
                        const severity = getReturnSeverity(
                          item.cancelReasonType
                        );
                        const reasonIcon = getCancelReasonTypeIcon(
                          item.cancelReasonType
                        );
                        const reasonColor = getCancelReasonTypeColor(
                          item.cancelReasonType
                        );
                        const reasonName = getCancelReasonTypeDisplayName(
                          item.cancelReasonType
                        );

                        return (
                          <tr key={item.id}>
                            <td className="small">
                              <span
                                className="badge bg-primary badge-sm"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td className="small">
                              <div className="d-flex align-items-center">
                                <span className="me-2">{item.title}</span>
                                {severity.priority >= 3 && (
                                  <span
                                    className="badge bg-danger-subtle text-danger badge-sm"
                                    style={{ fontSize: "0.65rem" }}
                                  >
                                    🚨 Kritik
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
                              <span
                                className="badge bg-info-subtle text-info badge-sm"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {item.customerName}
                              </span>
                            </td>
                            <td className="small">
                              <div className="d-flex align-items-center">
                                <span className="me-1">{reasonIcon}</span>
                                <span
                                  className={`badge ${reasonColor} badge-sm`}
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  {reasonName}
                                </span>
                              </div>
                              {item.returnReason && (
                                <small
                                  className="text-muted d-block mt-1"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {item.returnReason}
                                </small>
                              )}
                            </td>
                            <td className="small">
                              <span
                                className={`badge ${severity.color} badge-sm`}
                                style={{ fontSize: "0.7rem" }}
                              >
                                {severity.level}
                              </span>
                            </td>
                            <td className="small">
                              <span
                                className="badge bg-warning badge-sm"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {item.returnQuantity}
                              </span>
                            </td>
                            <td className="small">
                              <strong
                                className="text-success"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {formatCurrency(item.refundAmount)}
                              </strong>
                            </td>
                            <td className="small">
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {formatDateTime(item.returnDate)}
                              </small>
                            </td>
                            <td className="small">
                              <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {formatDateTime(item.orderDate)}
                              </small>
                            </td>
                            <td className="small">
                              <span
                                className={`badge badge-sm ${
                                  item.isAvailable ? "bg-success" : "bg-danger"
                                }`}
                                style={{ fontSize: "0.75rem" }}
                              >
                                {item.isAvailable ? "Aktif" : "Pasif"}
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
                  <div className="text-warning">
                    <i className="fas fa-undo fa-2x mb-2"></i>
                    <h6 className="small mb-1">Ürün iade kaydı bulunmuyor.</h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {getActiveFiltersCount() > 0
                        ? "Belirtilen kriterlere göre ürün iade kaydı bulunamadı. Filtreleri gözden geçirin."
                        : "Henüz ürün iade kaydı bulunmuyor. İadeler gerçekleştikçe burada görünecekler."}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductReturnReportPage;
