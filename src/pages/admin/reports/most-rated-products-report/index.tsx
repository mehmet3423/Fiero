import React, { useState } from "react";
import { useMostRatedProductsReport } from "@/hooks/services/reports/useMostRatedProductsReport";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import CirclePagination from "@/components/shared/CirclePagination";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_MOST_RATED_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MostRatedProductsFilters {
  ascending?: boolean;
}

function MostRatedProductsReportPage() {
  // Local state for form inputs
  const [ascending, setAscending] = useState<boolean>(false);

  // Use modern pagination hook
  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<MostRatedProductsFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useMostRatedProductsReport(
    getApiParams()
  );
  const { exportToExcel, isExporting } = useExcelExport();

  // Sync local state with URL filters
  React.useEffect(() => {
    setAscending(filters.ascending ?? false);
  }, [filters]);

  const handleSortChange = (newAscending: boolean) => {
    setAscending(newAscending);
    updateFilters({ ascending: newAscending });
  };

  const handleExcelExport = () => {
    const apiParams = getApiParams();
    exportToExcel(
      GET_MOST_RATED_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "en-cok-puanlanan-urunler-raporu.xlsx"
    );
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="d-flex align-items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star text-warning"></i>
        ))}
        {/* Half Star */}
        {hasHalfStar && <i className="fas fa-star-half-alt text-warning"></i>}
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star text-muted"></i>
        ))}
        <span className="ms-1 text-muted">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Chart data preparation
  const chartData =
    data?.data?.items &&
    Array.isArray(data.data.items) &&
    data.data.items.length > 0
      ? {
          labels: data.data.items.map((item) => item.productTitle),
          datasets: [
            {
              label: "Puan",
              data: data.data.items.map((item) => item.averageRating),
              backgroundColor: "#4285f4",
              borderColor: "#4285f4",
              borderWidth: 1,
            },
          ],
        }
      : null;

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Ürün bazlı Puan Raporu",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Toplam sayfa sayısını hesapla
  const totalCount = data?.data?.count || 0;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        En Çok Puanlanan Ürünler
      </h4>
      <BackButton href="/admin/reports" />
      {/* Sort Options */}
      <div className="card mb-4">
        <div className="card-body py-2">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label small mb-2">Sıralama Yönü</label>
              <div className="d-flex gap-3 mt-2 ">
                <div className="form-check">
                  <input
                    className="form-check-input mt-2"
                    type="radio"
                    name="sortOrder"
                    id="descending"
                    checked={!ascending}
                    onChange={() => handleSortChange(false)}
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      border: "2px solid #6c757d",
                    }}
                  />
                  <label
                    className="form-check-label small "
                    htmlFor="descending"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Yüksek Puan → Düşük Puan
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input mt-2"
                    type="radio"
                    name="sortOrder"
                    id="ascending"
                    checked={ascending}
                    onChange={() => handleSortChange(true)}
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      border: "2px solid #6c757d",
                    }}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="ascending"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Düşük Puan → Yüksek Puan
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="card">
          <div className="card-body text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
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
          {/* Chart Section */}
          {chartData && (
            <div className="card mb-4">
              <div className="card-body">
                <div style={{ height: "400px" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">En Çok Puanlanan Ürünler</h5>
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
              {data?.data?.items &&
              Array.isArray(data.data.items) &&
              data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Ürün Adı</th>
                        <th className="small">Yorum Sayısı</th>
                        <th className="small text-end">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data.items.map((item, index) => (
                        <tr key={item.productId}>
                          <td className="small">
                            <span
                              className="badge text-primary badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {getGlobalRowNumber(displayPage, pageSize, index)}
                            </span>
                          </td>
                          <td className="small">
                            <span className="me-2">{item.productTitle}</span>
                          </td>
                          <td>
                            <span
                              className="badge bg-info-subtle text-info badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {item.commentCount} değerlendirme
                            </span>
                          </td>
                          <td className="small text-end">
                            <span
                              className="badge bg-warning-subtle text-warning badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              ⭐ {item.averageRating.toFixed(1)}
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
                    <i className="fas fa-star fa-2x mb-2"></i>
                    <h6 className="small mb-1">
                      Henüz puanlanan ürün bulunmuyor.
                    </h6>
                    <p
                      className="text-muted small mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Müşterileriniz ürünlerinizi puanladıkça burada
                      görünecekler.
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MostRatedProductsReportPage;
