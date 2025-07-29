import { useEffect, useState } from "react";
import { useStockReport } from "@/hooks/services/reports/useStockReport";
import { useMostLikedProductsReport } from "@/hooks/services/reports/useMostLikedProductsReport";
import { useProductSalesReport } from "@/hooks/services/reports/useProductSalesReport";
import { usePassiveProductsReport } from "@/hooks/services/reports/usePassiveProductsReport";
import { useProductCartReport } from "@/hooks/services/reports/useProductCartReport";
import { useMainCategoriesLookUp } from "@/hooks/services/categories/useMainCategoriesLookUp";
import { useGetSupportTickets } from "@/hooks/services/support/useGetSupportTicket";
import Link from "next/link";

function AdminHomePage() {
  const [animatedCounts, setAnimatedCounts] = useState({
    stockItems: 0,
    likedProducts: 0,
    salesCount: 0,
    passiveProducts: 0,
    cartItems: 0,
    mainCategories: 0,
    subCategories: 0,
    totalSupportTickets: 0,
    pendingSupportTickets: 0,
  });
  // Reports data
  const { data: stockReport } = useStockReport({ pageSize: 1 });
  const { data: likedProductsReport } = useMostLikedProductsReport({
    pageSize: 1,
  });
  const { data: salesReport } = useProductSalesReport({ pageSize: 1 });
  const { data: passiveProductsReport } = usePassiveProductsReport({
    pageSize: 1,
  });
  const { data: cartReport } = useProductCartReport({ pageSize: 1 });

  // Categories data
  const { categories: mainCategories } = useMainCategoriesLookUp();
  const { totalCount: totalSupportTickets } = useGetSupportTickets({
    pageSize: 1,
  });
  const { totalCount: pendingSupportTickets } = useGetSupportTickets({
    pageSize: 1,
    requestType: 0, // Assuming 0 is pending status, adjust as needed
  });

  // Animation function
  const animateNumber = (
    target: number,
    setter: (value: number) => void,
    duration = 2000
  ) => {
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (target - startValue) * easeOutQuart
      );

      setter(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Trigger animations when data loads
  useEffect(() => {
    if (stockReport?.data?.count) {
      animateNumber(stockReport.data.count, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, stockItems: value }))
      );
    }
  }, [stockReport]);

  useEffect(() => {
    if (likedProductsReport?.data?.count) {
      animateNumber(likedProductsReport.data.count, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, likedProducts: value }))
      );
    }
  }, [likedProductsReport]);

  useEffect(() => {
    if (salesReport?.data?.count) {
      animateNumber(salesReport.data.count, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, salesCount: value }))
      );
    }
  }, [salesReport]);

  useEffect(() => {
    if (passiveProductsReport?.data?.count) {
      animateNumber(passiveProductsReport.data.count, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, passiveProducts: value }))
      );
    }
  }, [passiveProductsReport]);

  useEffect(() => {
    if (cartReport?.data?.count) {
      animateNumber(cartReport.data.count, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, cartItems: value }))
      );
    }
  }, [cartReport]);

  // Categories animations
  useEffect(() => {
    // Farklı veri yapılarını dene
    let categoryCount = 0;
    if (mainCategories?.items?.length) {
      categoryCount = mainCategories.items.length;
    } else if (Array.isArray(mainCategories)) {
      categoryCount = mainCategories.length;
    }

    if (categoryCount > 0) {
      animateNumber(categoryCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, mainCategories: value }))
      );
    } else {
      // Eğer veri yoksa 0 olarak set et
      setAnimatedCounts((prev) => ({ ...prev, mainCategories: 0 }));
    }
  }, [mainCategories]);

  // Support tickets animations
  useEffect(() => {
    if (totalSupportTickets) {
      animateNumber(totalSupportTickets, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, totalSupportTickets: value }))
      );
    }
  }, [totalSupportTickets]);

  useEffect(() => {
    if (pendingSupportTickets) {
      animateNumber(pendingSupportTickets, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, pendingSupportTickets: value }))
      );
    }
  }, [pendingSupportTickets]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("apexcharts").then((ApexCharts) => {
        const totalRevenueChart = new ApexCharts.default(
          document.querySelector("#totalRevenueChart"),
          {
            series: [
              {
                name: "Gelir",
                data: [18, 7, 15, 29, 18, 12, 9],
              },
            ],
            chart: {
              height: 300,
              type: "bar",
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: false,
              },
            },
            colors: ["#696cff"],
            xaxis: {
              categories: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            },
          }
        );

        // Reports Chart
        const reportsChart = new ApexCharts.default(
          document.querySelector("#reportsChart"),
          {
            series: [
              {
                name: "Rapor Verisi",
                data: [65, 23, 89, 12, 34],
              },
            ],
            chart: {
              height: 250,
              type: "area",
              toolbar: { show: false },
              zoom: { enabled: false },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            colors: ["#4f46e5"],
            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100],
              },
            },
            grid: {
              borderColor: "#e0e6ed",
              strokeDashArray: 5,
            },
            xaxis: {
              categories: ["Stok", "Beğeni", "Satış", "Pasif", "Sepet"],
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            yaxis: {
              show: false,
            },
          }
        );

        const growthChart = new ApexCharts.default(
          document.querySelector("#growthChart"),
          {
            series: [78],
            chart: {
              height: 240,
              type: "radialBar",
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: "70%",
                },
                track: {
                  background: "#f3f3f3",
                },
                dataLabels: {
                  show: true,
                  name: {
                    show: false,
                  },
                  value: {
                    formatter: function (val: number) {
                      return val + "%";
                    },
                    fontSize: "1.5rem",
                  },
                },
              },
            },
            colors: ["#696cff"],
            stroke: {
              lineCap: "round",
            },
          }
        );
        const incomeChart = new ApexCharts.default(
          document.querySelector("#incomeChart"),
          {
            series: [
              {
                data: [24, 21, 30, 22, 42, 26, 35],
              },
            ],
            chart: {
              height: 200,
              type: "line",
              toolbar: { show: false },
              zoom: { enabled: false },
            },
            markers: {
              size: 4,
              colors: ["#696cff"],
              strokeColors: "#fff",
              strokeWidth: 2,
              hover: { size: 6 },
            },
            colors: ["#696cff"],
            stroke: {
              curve: "smooth",
              width: 3,
            },
            grid: {
              borderColor: "#f1f1f1",
            },
            xaxis: {
              categories: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            },
          }
        );

        totalRevenueChart.render();
        reportsChart.render();
        growthChart.render();
        incomeChart.render();

        return () => {
          totalRevenueChart.destroy();
          reportsChart.destroy();
          growthChart.destroy();
          incomeChart.destroy();
        };
      });
    }
  }, []);

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Hoşgeldiniz Kartı */}
        <div className="row">
          <div className="col-lg-8 mb-5 order-0">
            <div className="card h-100 p-2">
              <div className="d-flex align-items-end row">
                <div className="col-asm-7">
                  <div className="card-body p-3">
                    <h5
                      className="card-title text-primary mb-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Hoş Geldiniz! 🎉
                    </h5>
                    <p className="mb-3" style={{ fontSize: "0.8rem" }}>
                      Nors Admin Paneline hoş geldiniz. Sol menüden yönetim
                      işlemlerine erişebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="col-lg-4 col-md-4 order-1">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-6 mb-5">
                <div className="card h-100 p-2">
                  <div className="card-body p-3">
                    <div className="card-title d-flex align-items-start justify-content-between mb-2">
                      <div className="avatar flex-shrink-0">
                        <span className="avatar-initial rounded bg-label-primary">
                          <i className="bx bx-category"></i>
                        </span>
                      </div>
                    </div>
                    <span
                      className="fw-semibold d-block mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Kategoriler
                    </span>
                    <h3
                      className="card-title mb-2"
                      style={{ fontSize: "1rem" }}
                    >
                      {animatedCounts.mainCategories}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-6 mb-5">
                <div className="card h-100">
                  <div className="card-body p-3">
                    <div className="card-title d-flex align-items-start justify-content-between mb-2">
                      <div className="avatar flex-shrink-0">
                        <span className="avatar-initial rounded bg-label-success">
                          <i className="bx bx-support"></i>
                        </span>
                      </div>
                    </div>
                    <span
                      className="fw-semibold d-block mb-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Destek Talepleri
                    </span>
                    <h3
                      className="card-title text-nowrap mb-1"
                      style={{ fontSize: "1rem" }}
                    >
                      {animatedCounts.totalSupportTickets}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animasyonlu Raporlar Bölümü */}
        <div className="row mb-4">
          <div className="col-lg-8 col-md-12" style={{ marginBottom: "-8px" }}>
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between mb-4">
                <h5 className="card-title mb-0 m-3 m-3">
                  <i className="bx bx-bar-chart-alt-2 me-2 text-primary"></i>
                  Canlı Raporlar
                </h5>
                <Link
                  href="/admin/reports"
                  className="btn btn-sm btn-outline-primary m-3"
                >
                  <i className="bx bx-right-arrow-alt me-1"></i>
                  Tüm Raporlar
                </Link>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-4">
                  {/* Stok Raporu */}
                  <div className="col-md-4 col-sm-6">
                    <div
                      className="card h-100 report-card"
                      style={{
                        background:
                          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        color: "#1565c0",
                        border: "1px solid #e1f5fe",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open("/admin/reports/stock-report", "_blank")
                      }
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="avatar flex-shrink-0">
                            <span
                              className="avatar-initial rounded bg-success text-white"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i
                                className="bx bx-package"
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold mb-0 animated-number"
                              style={{ fontSize: "1.5rem", lineHeight: "1" }}
                            >
                              {animatedCounts.stockItems.toLocaleString()}
                            </div>
                            <small className="text-muted">Stok Kalemi</small>
                          </div>
                        </div>
                        <h6
                          className="card-title mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Stok Raporu
                        </h6>
                        <p
                          className="card-text mb-0 text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Anlık stok durumları
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* En Beğenilen Ürünler */}
                  <div className="col-md-4 col-sm-6">
                    <div
                      className="card h-100 report-card"
                      style={{
                        background:
                          "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)",
                        color: "#c2185b",
                        border: "1px solid #fce4ec",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "/admin/reports/most-liked-products-report",
                          "_blank"
                        )
                      }
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="avatar flex-shrink-0">
                            <span
                              className="avatar-initial rounded bg-success text-white"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i
                                className="bx bx-heart"
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold mb-0 animated-number"
                              style={{ fontSize: "1.5rem", lineHeight: "1" }}
                            >
                              {animatedCounts.likedProducts.toLocaleString()}
                            </div>
                            <small className="text-muted">Beğenilen</small>
                          </div>
                        </div>
                        <h6
                          className="card-title mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Beğenilen Ürünler
                        </h6>
                        <p
                          className="card-text mb-0 text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          En çok beğenilen ürünler
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Satış Raporu */}
                  <div className="col-md-4 col-sm-6">
                    <div
                      className="card h-100 report-card"
                      style={{
                        background:
                          "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                        color: "#388e3c",
                        border: "1px solid #e8f5e8",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "/admin/reports/product-sales-report",
                          "_blank"
                        )
                      }
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="avatar flex-shrink-0">
                            <span
                              className="avatar-initial rounded bg-success text-white"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i
                                className="bx bx-trending-up"
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold mb-0 animated-number"
                              style={{ fontSize: "1.5rem", lineHeight: "1" }}
                            >
                              {animatedCounts.salesCount.toLocaleString()}
                            </div>
                            <small className="text-muted">Satış</small>
                          </div>
                        </div>
                        <h6
                          className="card-title mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Satış Raporu
                        </h6>
                        <p
                          className="card-text mb-0 text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Satış analitiği
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pasif Ürünler */}
                  <div className="col-md-4 col-sm-6">
                    <div
                      className="card h-100 report-card"
                      style={{
                        background:
                          "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
                        color: "#f57c00",
                        border: "1px solid #fff3e0",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "/admin/reports/passive-products-report",
                          "_blank"
                        )
                      }
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="avatar flex-shrink-0">
                            <span
                              className="avatar-initial rounded bg-warning text-white"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i
                                className="bx bx-error-circle"
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold mb-0 animated-number"
                              style={{ fontSize: "1.5rem", lineHeight: "1" }}
                            >
                              {animatedCounts.passiveProducts.toLocaleString()}
                            </div>
                            <small className="text-muted">Pasif</small>
                          </div>
                        </div>
                        <h6
                          className="card-title mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Pasif Ürünler
                        </h6>
                        <p
                          className="card-text mb-0 text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Satışta olmayan ürünler
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sepet Analizi */}
                  <div className="col-md-4 col-sm-6">
                    <div
                      className="card h-100 report-card"
                      style={{
                        background:
                          "linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)",
                        color: "#7b1fa2",
                        border: "1px solid #f3e5f5",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "/admin/reports/product-cart-report",
                          "_blank"
                        )
                      }
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="avatar flex-shrink-0">
                            <span
                              className="avatar-initial rounded bg-info text-white"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i
                                className="bx bx-cart"
                                style={{ fontSize: "1.2rem" }}
                              ></i>
                            </span>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold mb-0 animated-number"
                              style={{ fontSize: "1.5rem", lineHeight: "1" }}
                            >
                              {animatedCounts.cartItems.toLocaleString()}
                            </div>
                            <small className="text-muted">Sepet</small>
                          </div>
                        </div>
                        <h6
                          className="card-title mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Sepet Analizi
                        </h6>
                        <p
                          className="card-text mb-0 text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Sepete eklenen ürünler
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rapor Grafiği */}
          <div className="col-lg-4 col-md-12">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="card-title mb-0 m-3">Rapor Özeti</h6>
              </div>
              <div className="card-body">
                <div id="reportsChart"></div>
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Bu Ay</span>
                    <span className="badge bg-primary">+12%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Geçen Aya Göre</span>
                    <span className="text-success small">↗ Artış</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yönetim Kartları */}
        <div className="row">
          {/* Destek Talepleri - Yeni pozisyon */}
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="card">
              <div className="row row-bordered g-0">
                <div className="col-lg-8 col-md-12">
                  <h5 className="card-header p-4 fs-4"> Toplam Gelir</h5>
                  <div id="totalRevenueChart" className="px-2"></div>
                </div>
                <div className="col-lg-4 col-md-12">
                  <div className="card-body">
                    <div className="text-center">
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-primary dropdown-toggle"
                          type="button"
                          id="growthReportId"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          2023
                        </button>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            2022
                          </a>
                          <a className="dropdown-item" href="#">
                            2021
                          </a>
                          <a className="dropdown-item" href="#">
                            2020
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="growthChart"></div>
                  <div className="text-center fw-semibold pt-3 mb-2">
                    62% Şirket Büyümesi
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Total Balance - Yeni tasarım */}
          <div className="col-md-6 col-lg-4 mb-4 pb-2">
            <div className="card h-100">
              <div className="card-body px-0">
                <div className="tab-content p-0">
                  <div
                    className="tab-pane fade show active"
                    id="navs-tabs-line-card-income"
                    role="tabpanel"
                  >
                    <div className="d-flex p-4 pt-3">
                      <div className="avatar flex-shrink-0 me-3">
                        <img
                          src="../assets/admin/img/icons/unicons/wallet.png"
                          alt="User"
                        />
                      </div>
                      <div>
                        <small className="text-muted d-block">
                          Toplam Bakiye
                        </small>
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0 me-1">$459.10</h6>
                          <small className="text-success fw-semibold">
                            <i className="bx bx-chevron-up"></i>
                            42.9%
                          </small>
                        </div>
                      </div>
                    </div>
                    <div id="incomeChart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kategori Yönetimi */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-category me-2 text-primary"></i>
                  Kategori Yönetimi
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Ürün kategorilerini ve alt kategorilerini yönetin. Yeni
                  kategoriler ekleyin, düzenleyin veya silin.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Ana Kategoriler</span>
                    <span className="badge bg-primary">
                      {animatedCounts.mainCategories}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Alt Kategoriler</span>
                    <span className="badge bg-info">
                      {animatedCounts.subCategories}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Toplam Ürün</span>
                    <span className="badge bg-success">
                      {animatedCounts.stockItems}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/categories"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1 "></i>
                    Kategorileri Yönet
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* İçerik Yönetimi */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-edit me-2 text-success"></i>
                  İçerik Yönetimi
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Site içeriklerini düzenleyin. Ana sayfa, hakkımızda, iletişim
                  gibi sayfaların içeriklerini yönetin.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Statik Sayfalar</span>
                    <span className="badge bg-primary">5</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Slider Görselleri</span>
                    <span className="badge bg-info">3</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Banner Görselleri</span>
                    <span className="badge bg-success">4</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/general-content"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1"></i>
                    İçerikleri Yönet
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Kategori Özellikleri */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-list-ul me-2 text-info"></i>
                  Alt Kategori Özellikleri
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Alt kategorilere özel ürün özelliklerini tanımlayın. Renk,
                  beden, malzeme gibi özellikleri yönetin.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Tanımlı Özellikler</span>
                    <span className="badge bg-primary">8</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Özellik Seçenekleri</span>
                    <span className="badge bg-info">24</span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Kullanılan Alt Kategoriler</span>
                    <span className="badge bg-success">6</span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/sub-category-specifications"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1"></i>
                    Özellikleri Yönet
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Destek Talepleri */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-support me-2 text-warning"></i>
                  Destek Talepleri
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Müşterilerden gelen destek taleplerini görüntüleyin ve
                  yanıtlayın. Talepleri kategorilere göre filtreleyebilirsiniz.
                </p>
                <div className="d-flex flex-column gap-2 mt-4">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Toplam Talepler</span>
                    <span className="badge bg-primary">
                      {animatedCounts.totalSupportTickets}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Bekleyen Talepler</span>
                    <span className="badge bg-warning">
                      {animatedCounts.pendingSupportTickets}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <span>Yanıtlanan Talepler</span>
                    <span className="badge bg-success">
                      {animatedCounts.totalSupportTickets -
                        animatedCounts.pendingSupportTickets}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/support-tickets"
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bx bx-right-arrow-alt me-1"></i>
                    Talepleri Görüntüle
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı Erişim */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-rocket me-2 text-danger"></i>
                  Hızlı Erişim
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Sık kullanılan işlemlere hızlıca erişin. Aşağıdaki butonları
                  kullanarak ilgili sayfalara gidebilirsiniz.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <a
                    href="/admin/categories"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-category me-1"></i>
                    Kategori Yönetimi
                  </a>
                  <a
                    href="/admin/general-content"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-edit me-1"></i>
                    İçerik Yönetimi
                  </a>
                  <a
                    href="/admin/sub-category-specifications"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-list-ul me-1"></i>
                    Alt Kategori Özellikleri
                  </a>
                  <a
                    href="/admin/support-tickets"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bx bx-support me-1"></i>
                    Destek Talepleri
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Yardım ve Destek */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 p-4">
              <div className="card-header d-flex align-items-center justify-content-between py-3">
                <h5
                  className="card-title m-0 me-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <i className="bx bx-help-circle me-2 text-secondary"></i>
                  Yardım ve Destek
                </h5>
              </div>
              <div className="card-body p-3">
                <p className="card-text" style={{ fontSize: "0.8rem" }}>
                  Admin paneli kullanımı hakkında yardıma mı ihtiyacınız var?
                  Aşağıdaki kaynaklara göz atabilirsiniz.
                </p>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div className="card bg-light p-3">
                    <h6 className="mb-2" style={{ fontSize: "0.8rem" }}>
                      Kullanım Kılavuzu
                    </h6>
                    <p className="mb-0 small" style={{ fontSize: "0.7rem" }}>
                      Admin panelinin tüm özelliklerini detaylı olarak açıklayan
                      kullanım kılavuzuna erişin.
                    </p>
                    <a
                      href="#"
                      className="mt-2 small"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Kılavuzu Görüntüle{" "}
                      <i className="bx bx-right-arrow-alt"></i>
                    </a>
                  </div>
                  <div className="card bg-light p-3">
                    <h6 className="mb-2" style={{ fontSize: "0.8rem" }}>
                      Sık Sorulan Sorular
                    </h6>
                    <p className="mb-0 small" style={{ fontSize: "0.7rem" }}>
                      Admin paneli kullanımı hakkında sık sorulan soruların
                      cevaplarını bulun.
                    </p>
                    <a
                      href="#"
                      className="mt-2 small"
                      style={{ fontSize: "0.7rem" }}
                    >
                      SSS'leri Görüntüle{" "}
                      <i className="bx bx-right-arrow-alt"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-backdrop fade"></div>

      <style jsx>{`
        .report-card:hover {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .animated-number {
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .report-card:hover .animated-number {
          transform: scale(1.05);
        }

        .text-white-75 {
          color: rgba(255, 255, 255, 0.75) !important;
        }

        .text-white-50 {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.2);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(102, 126, 234, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
          }
        }

        .report-card .avatar-initial {
          animation: pulse 3s infinite;
        }

        .card-header h5 {
          background: linear-gradient(135deg, #495057 0%, #212529 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .report-card {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .report-card:hover .card-title {
          color: inherit !important;
        }

        .avatar-initial {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default AdminHomePage;
