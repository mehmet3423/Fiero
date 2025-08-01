import React from "react";
import { useReturnReasonReport } from "@/hooks/services/reports/useReturnReasonReport";
import {
  getReasonTypeInfo,
  getPercentageColor,
} from "@/constants/models/reports";
import Link from "next/link";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_RETURN_REASON_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

interface ReturnReasonFilters {
  // Bu rapor için filter yok ama interface gerekli
}

function ReturnReasonReportPage() {
  // Modern pagination hook
  const { displayPage, pageSize, changePage, getApiParams } =
    useReportPagination<ReturnReasonFilters>({
      defaultPageSize: REPORT_PAGE_SIZE,
    });

  const { data, isLoading, error, refetch } = useReturnReasonReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("tr-TR");
  };

  const calculateTotalReturns = () => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce(
      (total, item) => total + item.totalReturns,
      0
    );
  };

  const calculateTotalRefunds = () => {
    if (!data?.data?.items) return 0;
    return data.data.items.reduce(
      (total, item) => total + item.totalRefundAmount,
      0
    );
  };

  const getMostCommonReason = () => {
    if (!data?.data?.items || data.data.items.length === 0) return null;
    return data.data.items.reduce((prev, current) =>
      prev.totalReturns > current.totalReturns ? prev : current
    );
  };

  const getHighestRefundReason = () => {
    if (!data?.data?.items || data.data.items.length === 0) return null;
    return data.data.items.reduce((prev, current) =>
      prev.totalRefundAmount > current.totalRefundAmount ? prev : current
    );
  };

  // Toplam sayfa sayısını hesapla
  const totalCount = data?.data?.count || 0;

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_RETURN_REASON_REPORT_EXCEL,
      apiParams,
      "iade-nedeni-raporu.xlsx"
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y px-4">
      <h5 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        İade Nedeni Raporu
      </h5>
      <BackButton href="/admin/reports" />
      {/* Statistics Cards */}
      {data && data.data && data.data.items && data.data.items.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-list text-primary me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>İade Nedeni</span>
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
                  <i className="fas fa-undo text-warning me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>İade Sayısı</span>
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
                  {formatCurrency(calculateTotalRefunds())}
                </h6>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body py-2">
                <div className="card-title d-flex align-items-center justify-content-center small">
                  <i className="fas fa-chart-pie text-info me-1"></i>
                  <span style={{ fontSize: "0.8rem" }}>Ort. Tutar</span>
                </div>
                <h6
                  className="card-text text-info mb-0"
                  style={{ fontSize: "1rem" }}
                >
                  {formatCurrency(
                    calculateTotalRefunds() / calculateTotalReturns() || 0
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Cards */}
      {data && data.data && data.data.items && data.data.items.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body py-2">
                <h6 className="card-title text-danger small mb-2">
                  🔥 En Sık İade Nedeni
                </h6>
                {getMostCommonReason() && (
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {
                        getReasonTypeInfo(getMostCommonReason()!.reasonType)
                          .icon
                      }
                    </span>
                    <div>
                      <h6 className="mb-1 small">
                        {getMostCommonReason()!.reasonName}
                      </h6>
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {getMostCommonReason()!.totalReturns} iade (
                        {getMostCommonReason()!.percentage.toFixed(1)}%)
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body py-2">
                <h6 className="card-title text-warning small mb-2">
                  💰 En Yüksek Tutarlı İade
                </h6>
                {getHighestRefundReason() && (
                  <div className="d-flex align-items-center">
                    <span className="me-2">
                      {
                        getReasonTypeInfo(getHighestRefundReason()!.reasonType)
                          .icon
                      }
                    </span>
                    <div>
                      <h6 className="mb-1 small">
                        {getHighestRefundReason()!.reasonName}
                      </h6>
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {formatCurrency(
                          getHighestRefundReason()!.totalRefundAmount
                        )}{" "}
                        toplam iade
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center py-2">
          <h6 className="card-title mb-0 small m-3">İade Nedeni Raporu</h6>
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
              Aradığınız kriterlere uygun iade nedeni bulunamadı.
            </div>
          )}

          {data && !isLoading && (
            <>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Toplam {data.data.count} farklı iade nedeni analiz edildi
                </small>
                {data.data.count > 0 && (
                  <div className="text-end">
                    <small className="text-info" style={{ fontSize: "0.8rem" }}>
                      📊 İade nedeni dağılım analizi
                    </small>
                  </div>
                )}
              </div>

              {data.data.items && data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">İade Nedeni</th>
                        <th className="small">Öncelik</th>
                        <th className="small">İade</th>
                        <th className="small">Yüzde</th>
                        <th className="small">Toplam</th>
                        <th className="small">Ortalama</th>
                        <th className="small">Açıklama</th>
                        <th className="small">Güncelleme</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items
                        .sort((a, b) => b.totalReturns - a.totalReturns) // En çok iade nedeni önce
                        .map((item, index) => {
                          const reasonInfo = getReasonTypeInfo(item.reasonType);
                          const percentageColor = getPercentageColor(
                            item.percentage
                          );

                          return (
                            <tr key={item.id}>
                              <td className="small">
                                <span
                                  className="badge bg-primary badge-sm"
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
                                  <span className="me-1">
                                    {reasonInfo.icon}
                                  </span>
                                  <div>
                                    <span className="fw-bold">
                                      {item.reasonName}
                                    </span>
                                    {index === 0 && (
                                      <span
                                        className="badge bg-danger-subtle text-danger badge-sm ms-1"
                                        style={{ fontSize: "0.65rem" }}
                                      >
                                        🔥 En Sık
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="small">
                                <span
                                  className={`badge ${reasonInfo.color} badge-sm`}
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {reasonInfo.priority}
                                </span>
                              </td>
                              <td className="small">
                                <div className="d-flex align-items-center">
                                  <span
                                    className="badge bg-warning badge-sm me-1"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {item.totalReturns}
                                  </span>
                                  {item.totalReturns >= 100 && (
                                    <span
                                      className="badge bg-danger-subtle text-danger badge-sm"
                                      style={{ fontSize: "0.65rem" }}
                                    >
                                      ⚠️ Yüksek
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="small">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="progress me-1"
                                    style={{ width: "40px", height: "6px" }}
                                  >
                                    <div
                                      className={`progress-bar ${percentageColor.replace(
                                        "text-",
                                        "bg-"
                                      )}`}
                                      style={{
                                        width: `${Math.min(
                                          item.percentage,
                                          100
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span
                                    className={`fw-bold ${percentageColor}`}
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {item.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                              <td className="small">
                                <strong
                                  className="text-success"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {formatCurrency(item.totalRefundAmount)}
                                </strong>
                              </td>
                              <td className="small">
                                <span
                                  className="text-info"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {formatCurrency(item.averageRefundAmount)}
                                </span>
                              </td>
                              <td className="small">
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {item.reasonDescription || "Açıklama yok"}
                                </small>
                              </td>
                              <td className="small">
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {formatDateTime(item.modifiedonvalue)}
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
                    <i className="fas fa-chart-bar fa-2x mb-2"></i>
                    <h6 className="small mb-1">
                      İade nedeni verisi bulunmuyor.
                    </h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      İade işlemleri gerçekleştikçe burada analiz sonuçları
                      görünecek.
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

export default ReturnReasonReportPage;
