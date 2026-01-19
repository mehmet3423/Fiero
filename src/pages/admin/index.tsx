import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useStockReport } from "@/hooks/services/reports/useStockReport";
import { useMostLikedProductsReport } from "@/hooks/services/reports/useMostLikedProductsReport";
import { useProductSalesReport } from "@/hooks/services/reports/useProductSalesReport";
import { usePassiveProductsReport } from "@/hooks/services/reports/usePassiveProductsReport";
import { useProductCartReport } from "@/hooks/services/reports/useProductCartReport";
import { useProductSalesReportAll } from "@/hooks/services/reports/useProductSalesReportAll";
import { useMainCategoriesLookUp } from "@/hooks/services/categories/useMainCategoriesLookUp";
import { useMainCategoriesWithSubCategories } from "@/hooks/services/categories/useMainCategoriesWithSubCategories";
import { useGetSupportTickets } from "@/hooks/services/support/useGetSupportTicket";
import { useGetOrderSupportTickets } from "@/hooks/services/support/order/useGetOrderSupportTickets";

function AdminHomePage() {
  // Animasyonlu sayılar için state
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

  // Animasyon tetikleme kontrolü (her animasyon sadece bir kez tetiklenir)
  const animationTriggered = useRef({
    stockItems: false,
    likedProducts: false,
    salesCount: false,
    passiveProducts: false,
    cartItems: false,
    mainCategories: false,
    subCategories: false,
    totalSupportTickets: false,
    pendingSupportTickets: false,
  });

  // Grafik referansları
  const reportsChartRef = useRef<any>(null);
  const totalRevenueChartRef = useRef<any>(null);

  // API Hook'ları
  // Sadece count değerine ihtiyaç var - pageSize: 1 yeterli
  const { data: stockReport } = useStockReport({ page: 0, pageSize: 1 });
  const { data: likedProductsReport } = useMostLikedProductsReport({
    page: 0,
    pageSize: 1,
    ascending: false, // Zorunlu parametre
  });
  const { data: salesReport } = useProductSalesReport({ page: 0, pageSize: 1 });
  const { data: passiveProductsReport } = usePassiveProductsReport({
    page: 0,
    pageSize: 1,
  });
  const { data: cartReport } = useProductCartReport({ page: 0, pageSize: 1 });

  // Kategoriler
  const { categories: mainCategories } = useMainCategoriesLookUp();
  const { data: mainCategoriesWithSubs } = useMainCategoriesWithSubCategories();

  // Destek talepleri (items array'ine ihtiyaç var - pageSize: 1000)
  const { tickets: allSupportTickets, totalCount: totalSupportTickets } =
    useGetSupportTickets({
      page: 0,
      pageSize: 1000,
    });
  const {
    tickets: allOrderSupportTickets,
    totalCount: totalOrderSupportTickets,
  } = useGetOrderSupportTickets({
    page: 0,
    pageSize: 1000,
  });

  // Son 7 günün tarih aralığını hesapla
  const getLast7DaysRange = useCallback(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  // Paginationsuz endpoint kullan (tüm veriler için)
  const weeklyRevenueParams = useMemo(() => {
    const { startDate, endDate } = getLast7DaysRange();
    return {
      startDate,
      endDate,
    };
  }, [getLast7DaysRange]);

  const { data: weeklyRevenueData } =
    useProductSalesReportAll(weeklyRevenueParams);

  // Memoized Data Hesaplamaları
  // Rapor sayılarını birleştir
  // API response yapısı: { data: { count, items, ... }, isSucceed, message }
  // useQuery döndürür: { data: Response, ... }
  // stockReport.data -> { data: { count, items, ... }, isSucceed, message }
  // stockReport.data.data -> { count, items, ... }
  // Fallback: Bazı API'ler root seviyede de count döndürebilir
  const reportData = useMemo(
    () => ({
      stockCount: stockReport?.data?.data?.count || stockReport?.data?.count || 0,
      likedCount: likedProductsReport?.data?.data?.count || likedProductsReport?.data?.count || 0,
      salesCount: salesReport?.data?.data?.count || salesReport?.data?.count || 0,
      passiveCount: passiveProductsReport?.data?.data?.count || passiveProductsReport?.data?.count || 0,
      cartCount: cartReport?.data?.data?.count || cartReport?.data?.count || 0,
    }),
    [
      stockReport?.data?.data?.count,
      stockReport?.data?.count,
      likedProductsReport?.data?.data?.count,
      likedProductsReport?.data?.count,
      salesReport?.data?.data?.count,
      salesReport?.data?.count,
      passiveProductsReport?.data?.data?.count,
      passiveProductsReport?.data?.count,
      cartReport?.data?.data?.count,
      cartReport?.data?.count,
    ]
  );

  // Kategori sayılarını hesapla
  const categoryData = useMemo(() => {
    const mainCount = Array.isArray(mainCategories?.data)
      ? mainCategories.data.length
      : 0;

    const subCount = mainCategoriesWithSubs.reduce((total, mainCat) => {
      return total + (mainCat.subCategories?.length || 0);
    }, 0);

    return { mainCount, subCount };
  }, [mainCategories?.data, mainCategoriesWithSubs]);

  // Destek talepleri sayılarını hesapla
  const supportData = useMemo(() => {
    // Bekleyen talepler (requestType === 0)
    const pendingSupportTickets = allSupportTickets.filter(
      (ticket) => ticket.requestType === 0
    ).length;

    const pendingOrderSupportTickets = allOrderSupportTickets.filter(
      (ticket) => ticket.requestType === 0
    ).length;

    return {
      totalCount: (totalSupportTickets || 0) + (totalOrderSupportTickets || 0),
      pendingCount: pendingSupportTickets + pendingOrderSupportTickets,
    };
  }, [
    allSupportTickets,
    allOrderSupportTickets,
    totalSupportTickets,
    totalOrderSupportTickets,
  ]);

  // Günlük gelir verilerini hesapla
  const dailyRevenueData = useMemo(() => {
    // Paginationsuz endpoint response yapısını kontrol et
    const items = weeklyRevenueData?.data?.items || weeklyRevenueData?.items;

    if (!items || !Array.isArray(items)) {
      return [0, 0, 0, 0, 0, 0, 0];
    }

    const today = new Date();
    const days = [];

    // Son 7 günü oluştur
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }

    // Günlere göre grupla ve topla
    const dailyTotals = days.map((day) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      const dayItems = items.filter((item) => {
        if (!item.createdOnValue) return false;
        try {
          const itemDate = new Date(item.createdOnValue);
          const itemDay = new Date(
            itemDate.getFullYear(),
            itemDate.getMonth(),
            itemDate.getDate()
          );
          const dayToCompare = new Date(
            dayStart.getFullYear(),
            dayStart.getMonth(),
            dayStart.getDate()
          );
          return itemDay.getTime() === dayToCompare.getTime();
        } catch (error) {
          return false;
        }
      });

      return dayItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    });

    return dailyTotals;
  }, [weeklyRevenueData]);

  // Animasyon fonksiyonu
  const animateNumber = useCallback(
    (target: number, setter: (value: number) => void, duration = 2000) => {
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutQuart)
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
    },
    []
  );

  // Animasyonları Tetikleme
  useEffect(() => {
    if (reportData.stockCount > 0 && !animationTriggered.current.stockItems) {
      animationTriggered.current.stockItems = true;
      animateNumber(reportData.stockCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, stockItems: value }))
      );
    }
  }, [reportData.stockCount, animateNumber]);

  useEffect(() => {
    if (
      reportData.likedCount > 0 &&
      !animationTriggered.current.likedProducts
    ) {
      animationTriggered.current.likedProducts = true;
      animateNumber(reportData.likedCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, likedProducts: value }))
      );
    }
  }, [reportData.likedCount, animateNumber]);

  useEffect(() => {
    if (reportData.salesCount > 0 && !animationTriggered.current.salesCount) {
      animationTriggered.current.salesCount = true;
      animateNumber(reportData.salesCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, salesCount: value }))
      );
    }
  }, [reportData.salesCount, animateNumber]);

  useEffect(() => {
    if (
      reportData.passiveCount > 0 &&
      !animationTriggered.current.passiveProducts
    ) {
      animationTriggered.current.passiveProducts = true;
      animateNumber(reportData.passiveCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, passiveProducts: value }))
      );
    }
  }, [reportData.passiveCount, animateNumber]);

  useEffect(() => {
    if (reportData.cartCount > 0 && !animationTriggered.current.cartItems) {
      animationTriggered.current.cartItems = true;
      animateNumber(reportData.cartCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, cartItems: value }))
      );
    }
  }, [reportData.cartCount, animateNumber]);

  useEffect(() => {
    if (
      categoryData.mainCount > 0 &&
      !animationTriggered.current.mainCategories
    ) {
      animationTriggered.current.mainCategories = true;
      animateNumber(categoryData.mainCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, mainCategories: value }))
      );
    }
  }, [categoryData.mainCount, animateNumber]);

  useEffect(() => {
    if (categoryData.subCount > 0 && !animationTriggered.current.subCategories) {
      animationTriggered.current.subCategories = true;
      animateNumber(categoryData.subCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, subCategories: value }))
      );
    }
  }, [categoryData.subCount, animateNumber]);

  useEffect(() => {
    if (
      supportData.totalCount > 0 &&
      !animationTriggered.current.totalSupportTickets
    ) {
      animationTriggered.current.totalSupportTickets = true;
      animateNumber(supportData.totalCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, totalSupportTickets: value }))
      );
    }
  }, [supportData.totalCount, animateNumber]);

  useEffect(() => {
    if (
      supportData.pendingCount > 0 &&
      !animationTriggered.current.pendingSupportTickets
    ) {
      animationTriggered.current.pendingSupportTickets = true;
      animateNumber(supportData.pendingCount, (value) =>
        setAnimatedCounts((prev) => ({ ...prev, pendingSupportTickets: value }))
      );
    }
  }, [supportData.pendingCount, animateNumber]);

  // Grafikleri Oluşturma
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("apexcharts").then((ApexCharts) => {
        // Rapor Özeti Grafiği (Area Chart)
        const reportsChart = new ApexCharts.default(
          document.querySelector("#reportsChart"),
          {
            series: [
              {
                name: "Rapor Sayısı",
                data: [0, 0, 0, 0],
              },
            ],
            chart: {
              height: 250,
              type: "area",
              toolbar: { show: false },
              zoom: { enabled: false },
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
            xaxis: {
              categories: ["Beğeni", "Satış", "Pasif", "Sepet"],
            },
            yaxis: {
              show: false,
            },
          }
        );

        reportsChartRef.current = reportsChart;
        reportsChart.render();

        // Toplam Gelir Grafiği (Bar Chart)
        const totalRevenueChart = new ApexCharts.default(
          document.querySelector("#totalRevenueChart"),
          {
            series: [
              {
                name: "Gelir",
                data: [0, 0, 0, 0, 0, 0, 0],
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
            yaxis: {
              labels: {
                formatter: function (val: number) {
                  return val.toLocaleString("tr-TR", {
                    maximumFractionDigits: 0,
                  });
                },
              },
            },
          }
        );

        totalRevenueChartRef.current = totalRevenueChart;
        totalRevenueChart.render();

        // Cleanup
        return () => {
          if (reportsChartRef.current) {
            reportsChartRef.current.destroy();
          }
          if (totalRevenueChartRef.current) {
            totalRevenueChartRef.current.destroy();
          }
        };
      });
    }
  }, []);

  // Grafikleri Güncelleme
  // Rapor özeti grafiğini güncelle
  useEffect(() => {
    if (reportsChartRef.current) {
      reportsChartRef.current.updateSeries([
        {
          name: "Rapor Sayısı",
          data: [
            reportData.likedCount,
            reportData.salesCount,
            reportData.passiveCount,
            reportData.cartCount,
          ],
        },
      ]);
    }
  }, [reportData]);

  // Toplam gelir grafiğini güncelle
  useEffect(() => {
    if (totalRevenueChartRef.current && dailyRevenueData) {
      totalRevenueChartRef.current.updateSeries([
        {
          name: "Gelir",
          data: dailyRevenueData,
        },
      ]);
    }
  }, [dailyRevenueData]);

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Hoşgeldiniz Kartı */}
        <div className="row">
          <div className="col-lg-8 mb-4 order-0">
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
                      Fiero Admin Paneline hoş geldiniz. Sol menüden yönetim
                      işlemlerine erişebilirsiniz.
                    </p>
                    <a
                      href="/admin/categories"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Kategori Yönetimi
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="col-lg-4 col-md-4 order-1">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-6 mb-4">
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
                      className="card-title mb-2 animated-number"
                      style={{ fontSize: "1rem" }}
                    >
                      {animatedCounts.mainCategories.toLocaleString()}
                    </h3>
                    <small
                      className="text-muted fw-semibold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Ana Kategori
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-6 mb-4">
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
                      className="card-title text-nowrap mb-1 animated-number"
                      style={{ fontSize: "1rem" }}
                    >
                      {animatedCounts.pendingSupportTickets.toLocaleString()}
                    </h3>
                    <small
                      className="text-warning fw-semibold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Bekleyen Talepler
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rapor Kartları */}
        <div className="row mb-4">
          {/* Stok Raporu Kartı */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div
              className="card h-100 report-card"
              style={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                window.open("/admin/reports/stock-report", "_blank")
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="avatar flex-shrink-0">
                    <span
                      className="avatar-initial rounded bg-success text-white"
                      style={{ animation: "pulse 3s infinite" }}
                    >
                      <i className="bx bx-package"></i>
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-0 animated-number">
                      {animatedCounts.stockItems.toLocaleString()}
                    </div>
                    <small className="text-muted">Stok Kalemi</small>
                  </div>
                </div>
                <h6 className="card-title mb-1">Stok Raporu</h6>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  Anlık stok durumları
                </p>
              </div>
            </div>
          </div>

          {/* Beğenilen Ürünler Kartı */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div
              className="card h-100 report-card"
              style={{
                background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                window.open("/admin/reports/most-liked-products", "_blank")
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="avatar flex-shrink-0">
                    <span
                      className="avatar-initial rounded bg-danger text-white"
                      style={{ animation: "pulse 3s infinite" }}
                    >
                      <i className="bx bx-heart"></i>
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-0 animated-number">
                      {animatedCounts.likedProducts.toLocaleString()}
                    </div>
                    <small className="text-muted">Beğenilen Ürün</small>
                  </div>
                </div>
                <h6 className="card-title mb-1">Beğenilen Ürünler</h6>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  En çok beğenilen ürünler
                </p>
              </div>
            </div>
          </div>

          {/* Satış Raporu Kartı */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div
              className="card h-100 report-card"
              style={{
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                window.open("/admin/reports/product-sales", "_blank")
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="avatar flex-shrink-0">
                    <span
                      className="avatar-initial rounded bg-success text-white"
                      style={{ animation: "pulse 3s infinite" }}
                    >
                      <i className="bx bx-trending-up"></i>
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-0 animated-number">
                      {animatedCounts.salesCount.toLocaleString()}
                    </div>
                    <small className="text-muted">Satış Sayısı</small>
                  </div>
                </div>
                <h6 className="card-title mb-1">Satış Raporu</h6>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  Ürün satış analizi
                </p>
              </div>
            </div>
          </div>

          {/* Pasif Ürünler Kartı */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div
              className="card h-100 report-card"
              style={{
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                window.open("/admin/reports/passive-products", "_blank")
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="avatar flex-shrink-0">
                    <span
                      className="avatar-initial rounded bg-warning text-white"
                      style={{ animation: "pulse 3s infinite" }}
                    >
                      <i className="bx bx-pause-circle"></i>
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-0 animated-number">
                      {animatedCounts.passiveProducts.toLocaleString()}
                    </div>
                    <small className="text-muted">Pasif Ürün</small>
                  </div>
                </div>
                <h6 className="card-title mb-1">Pasif Ürünler</h6>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  Satışta olmayan ürünler
                </p>
              </div>
            </div>
          </div>

          {/* Sepet Analizi Kartı */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div
              className="card h-100 report-card"
              style={{
                background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                window.open("/admin/reports/product-cart", "_blank")
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="avatar flex-shrink-0">
                    <span
                      className="avatar-initial rounded bg-purple text-white"
                      style={{ animation: "pulse 3s infinite" }}
                    >
                      <i className="bx bx-cart"></i>
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-0 animated-number">
                      {animatedCounts.cartItems.toLocaleString()}
                    </div>
                    <small className="text-muted">Sepet Kalemi</small>
                  </div>
                </div>
                <h6 className="card-title mb-1">Sepet Analizi</h6>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  Sepet içerik analizi
                </p>
              </div>
            </div>
          </div>

          {/* Kategori Özeti Kartı */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div
              className="card h-100 report-card"
              style={{
                background: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => window.open("/admin/categories", "_blank")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px) scale(1.01)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="avatar flex-shrink-0">
                    <span
                      className="avatar-initial rounded bg-info text-white"
                      style={{ animation: "pulse 3s infinite" }}
                    >
                      <i className="bx bx-category"></i>
                    </span>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold mb-0 animated-number">
                      {animatedCounts.subCategories.toLocaleString()}
                    </div>
                    <small className="text-muted">Alt Kategori</small>
                  </div>
                </div>
                <h6 className="card-title mb-1">Kategori Yönetimi</h6>
                <p className="card-text mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  {animatedCounts.mainCategories} Ana, {animatedCounts.subCategories} Alt kategori
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="row">
          {/* Rapor Özeti Grafiği */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Rapor Özeti</h5>
              </div>
              <div className="card-body">
                <div id="reportsChart"></div>
              </div>
            </div>
          </div>

          {/* Toplam Gelir Grafiği */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Son 7 Günün Gelir Analizi</h5>
              </div>
              <div className="card-body">
                <div id="totalRevenueChart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-backdrop fade"></div>

      {/* CSS Animasyonları */}
      <style jsx>{`
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

        .animated-number {
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .report-card:hover .animated-number {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

export default AdminHomePage;
