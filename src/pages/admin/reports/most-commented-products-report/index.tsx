import React, { useEffect, useState } from "react";
import { useMostCommentedProductsReport } from "@/hooks/services/reports/useMostCommentedProductsReport";
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
import CirclePagination from "@/components/shared/CirclePagination";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import { REPORT_PAGE_SIZE, CHART_CONFIG } from "@/constants/reportConstants";
import { getGlobalRowNumber } from "@/utils/reportUtils";
import { useExcelExport } from "@/hooks/services/reports/useExcelExport";
import { GET_MOST_COMMENTED_PRODUCTS_REPORT_EXCEL } from "@/constants/links";
import BackButton from "@/components/shared/BackButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CommentReportFilters {
  ascending?: boolean;
  categoryKeyword?: string;
  productNameKeyword?: string;
}

function MostCommentedProductsReportPage() {
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
  } = useReportPagination<CommentReportFilters>({
    defaultPageSize: REPORT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useMostCommentedProductsReport(
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
      GET_MOST_COMMENTED_PRODUCTS_REPORT_EXCEL,
      apiParams,
      "en-cok-yorumlanan-urunler-raporu.xlsx"
    );
  };

  // Chart data preparation
  const chartData = data?.data
    ? {
        labels: data.data.items.map((item) => item.title),
        datasets: [
          {
            label: "Yorum Sayısı",
            data: data.data.items.map((item) => item.commentCount),
            backgroundColor: CHART_CONFIG.BAR_COLOR,
            borderColor: CHART_CONFIG.BAR_COLOR,
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: CHART_CONFIG.RESPONSIVE,
    maintainAspectRatio: CHART_CONFIG.MAINTAIN_ASPECT_RATIO,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Ürün bazlı Yorum Raporu",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
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

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">
          <Link href="/admin/reports">Raporlar</Link> /
        </span>{" "}
        En Çok Yorumlanan Ürünler
      </h4>
      <BackButton href="/admin/reports" />
      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-body py-2">
          {/* Sort Options */}
          <div className="row mb-2">
            <div className="col-12">
              <h6 className="card-title mb-0 small m-2">Filtreler</h6>
              <label className="form-label small mb-1">Sıralama Yönü</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input form-check-input-sm"
                    style={{ cursor: "pointer" }}
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
                    Çok Yorumlanan → Az Yorumlanan
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input form-check-input-sm"
                    style={{ cursor: "pointer" }}
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
                    Az Yorumlanan → Çok Yorumlanan
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
        </div>
      </div>

      {isLoading && (
        <div className="card">
          <div className="card-body text-center py-4">
            <div className="spinner-border spinner-border-sm" role="status">
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
                <div style={{ height: `${CHART_CONFIG.DEFAULT_HEIGHT}px` }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="card-title mb-0 small mb-3 ms-3 mt-3">
                En Çok Yorumlanan Ürünler
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
              {data.data?.items &&
              Array.isArray(data.data.items) &&
              data.data.items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-sm">
                    <tbody>
                      {data.data.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="small">
                            <span className="fw-medium me-2">
                              {getGlobalRowNumber(displayPage, pageSize, index)}
                              .
                            </span>
                            <span className="me-2">{item.title}</span>
                          </td>
                          <td className="small text-end">
                            <span
                              className="badge bg-info-subtle text-info badge-sm"
                              style={{ fontSize: "0.7rem" }}
                            >
                              💬 {item.commentCount}
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
                    <i className="fas fa-comments fa-2x mb-2"></i>
                    <h6 className="small mb-1">
                      Henüz yorumlanan ürün bulunmuyor.
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
                        ? "Belirtilen kriterlere göre yorumlanan ürün bulunamadı."
                        : "Müşterileriniz ürünlerinizi yorumladıkça burada görünecekler."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Pagination */}
            {data.data?.count && data.data.count > pageSize && (
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
        </>
      )}
    </div>
  );
}

export default MostCommentedProductsReportPage;
