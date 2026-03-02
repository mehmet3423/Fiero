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
import { formatCurrency } from "@/utils/currencyFormatter";

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
    totalRevenue: 0,
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
    totalRevenue: false,
  });

  // Grafik referansları
  const monthlySalesChartRef = useRef<any>(null);

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

  const {
    data: weeklyRevenueData,
    isLoading: isLoadingWeeklyRevenue,
    error: weeklyRevenueError,
  } = useProductSalesReportAll(weeklyRevenueParams);

  // Son 6 ay için aylık tarih aralıklarını hesapla (her ay için ayrı)
  const monthRanges = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - (5 - i) + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      return {
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString(),
        label: monthStart.toLocaleDateString("tr-TR", { month: "short", year: "numeric" }),
      };
    });
  }, []);

  // 6 ayrı aylık API çağrısı (React hook loop kullanamaz, sabit 6 hook)
  const { data: month0Data } = useProductSalesReportAll(monthRanges[0]);
  const { data: month1Data } = useProductSalesReportAll(monthRanges[1]);
  const { data: month2Data } = useProductSalesReportAll(monthRanges[2]);
  const { data: month3Data } = useProductSalesReportAll(monthRanges[3]);
  const { data: month4Data } = useProductSalesReportAll(monthRanges[4]);
  const { data: month5Data } = useProductSalesReportAll(monthRanges[5]);

  // Paginated endpoint ile 7 günlük günlük breakdown (createdOnValue alanı mevcut)
  const weeklyPaginatedParams = useMemo(() => ({
    page: 0,
    pageSize: 500,
    startDate: weeklyRevenueParams.startDate,
    endDate: weeklyRevenueParams.endDate,
  }), [weeklyRevenueParams]);

  const { data: weeklyPaginatedData } = useProductSalesReport(weeklyPaginatedParams);

  // Memoized Data Hesaplamaları
  // Rapor sayılarını birleştir
  // API response yapısı: { data: { count, items, ... }, isSucceed, message }
  // useQuery döndürür: { data: Response } -> Response.data = { count, items, ... }
  const reportData = useMemo(
    () => ({
      stockCount: stockReport?.data?.count ?? 0,
      likedCount: likedProductsReport?.data?.count ?? 0,
      salesCount: salesReport?.data?.count ?? 0,
      passiveCount: passiveProductsReport?.data?.count ?? 0,
      cartCount: cartReport?.data?.count ?? 0,
    }),
    [
      stockReport?.data?.count,
      likedProductsReport?.data?.count,
      salesReport?.data?.count,
      passiveProductsReport?.data?.count,
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
      (ticket: { requestType: number }) => ticket.requestType === 0
    ).length;

    const pendingOrderSupportTickets = allOrderSupportTickets.filter(
      (ticket: { requestType: number }) => ticket.requestType === 0
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

  // Non-paginated response: data array direkt veya data.items veya items
  const getSalesItems = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.items)) return res.data.items;
    if (Array.isArray(res.items)) return res.items;
    return [];
  };

  // Paginated response: data.items (createdOnValue alanı mevcut)
  const getPaginatedItems = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res.data?.items)) return res.data.items;
    if (Array.isArray(res.items)) return res.items;
    return [];
  };

  // Son 7 günlük toplam gelir
  // Non-paginated API zaten tarih filtreli döndürüyor; direkt topla
  const weeklyTotalRevenue = useMemo(() => {
    const items = getSalesItems(weeklyRevenueData);
    return items.reduce((sum: number, item: any) => sum + (item.totalRevenue ?? item.totalAmount ?? 0), 0);
  }, [weeklyRevenueData]);

  // Günlük gelir dağılımı: Paginated endpoint createdOnValue içeriyor
  const dailyRevenueData = useMemo(() => {
    const items = getPaginatedItems(weeklyPaginatedData);
    if (!items.length) return [0, 0, 0, 0, 0, 0, 0];

    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    return days.map((day) => {
      const dayItems = items.filter((item: any) => {
        const dateStr = item.createdOnValue ?? item.saleDate;
        if (!dateStr) return false;
        if (dateStr.startsWith("0001")) return false;
        try {
          const itemDate = new Date(dateStr);
          if (isNaN(itemDate.getTime()) || itemDate.getFullYear() < 2000) return false;
          return (
            itemDate.getFullYear() === day.getFullYear() &&
            itemDate.getMonth() === day.getMonth() &&
            itemDate.getDate() === day.getDate()
          );
        } catch {
          return false;
        }
      });
      return dayItems.reduce((sum: number, item: any) => sum + (item.totalRevenue ?? item.totalAmount ?? 0), 0);
    });
  }, [weeklyPaginatedData]);

  // Aylık gelir: 6 ayrı API çağrısından her ay kendi verisi
  const monthlyChartData = useMemo(() => {
    const monthlyDatas = [month0Data, month1Data, month2Data, month3Data, month4Data, month5Data];
    return {
      categories: monthRanges.map((m) => m.label),
      data: monthlyDatas.map((d) => {
        const items = getSalesItems(d);
        return items.reduce((sum: number, item: any) => sum + (item.totalRevenue ?? item.totalAmount ?? 0), 0);
      }),
    };
  }, [month0Data, month1Data, month2Data, month3Data, month4Data, month5Data, monthRanges]);

  // En çok satan ürünler: 6 aylık tüm monthly datalardan birleştir
  const { topByRevenue, topByQuantity } = useMemo(() => {
    const allMonthlyDatas = [month0Data, month1Data, month2Data, month3Data, month4Data, month5Data];
    const allItems = allMonthlyDatas.flatMap((d) => getSalesItems(d));

    const byProduct = new Map<
      string,
      { title: string; revenue: number; quantity: number }
    >();

    allItems.forEach((item: any) => {
      const key = item.productId ?? item.id ?? item.productTitle ?? "unknown";
      const revenue = item.totalRevenue ?? item.totalAmount ?? 0;
      const qty = item.totalQuantity ?? item.quantity ?? 0;
      const title = item.productTitle ?? item.title ?? "-";
      const existing = byProduct.get(key);
      if (existing) {
        existing.revenue += revenue;
        existing.quantity += qty;
      } else {
        byProduct.set(key, { title, revenue, quantity: qty });
      }
    });

    const arr = Array.from(byProduct.values());
    return {
      topByRevenue: [...arr].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      topByQuantity: [...arr].sort((a, b) => b.quantity - a.quantity).slice(0, 10),
    };
  }, [month0Data, month1Data, month2Data, month3Data, month4Data, month5Data]);

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

  useEffect(() => {
    if (
      weeklyTotalRevenue > 0 &&
      !animationTriggered.current.totalRevenue
    ) {
      animationTriggered.current.totalRevenue = true;
      animateNumber(Math.floor(weeklyTotalRevenue), (value) =>
        setAnimatedCounts((prev) => ({ ...prev, totalRevenue: value }))
      );
    }
  }, [weeklyTotalRevenue, animateNumber]);

  // Grafikleri Oluşturma
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("apexcharts").then((ApexCharts) => {
        // Aylık Satış Geliri Grafiği (6 ay)
        const monthlySalesChartEl = document.querySelector("#monthlySalesChart");
        if (monthlySalesChartEl) {
          const monthlySalesChart = new ApexCharts.default(
            monthlySalesChartEl,
            {
              series: [
                {
                  name: "Gelir",
                  data: [0, 0, 0, 0, 0, 0],
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
                categories: [],
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
              tooltip: {
                y: {
                  formatter: function (val: number) {
                    return new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(val);
                  },
                },
              },
            }
          );
          monthlySalesChartRef.current = monthlySalesChart;
          monthlySalesChart.render();
        }

        // Cleanup
        return () => {
          if (monthlySalesChartRef.current) {
            monthlySalesChartRef.current.destroy();
          }
        };
      });
    }
  }, []);


  // Aylık satış grafiğini güncelle
  useEffect(() => {
    if (
      monthlySalesChartRef.current &&
      monthlyChartData.categories.length > 0
    ) {
      monthlySalesChartRef.current.updateOptions({
        xaxis: { categories: monthlyChartData.categories },
      });
      monthlySalesChartRef.current.updateSeries([
        {
          name: "Gelir",
          data: monthlyChartData.data,
        },
      ]);
    }
  }, [monthlyChartData]);

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

        {/* Canlı Raporlar + Toplam Bakiye */}
        <div className="row mb-4">
          {/* Canlı Raporlar - 5 kart */}
          <div className="col-lg-8 mb-4">
            <div className="row">
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
                window.open("/admin/reports/most-liked-products-report", "_blank")
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
                window.open("/admin/reports/product-sales-report", "_blank")
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
                window.open("/admin/reports/passive-products-report", "_blank")
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
                window.open("/admin/reports/product-cart-report", "_blank")
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
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
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
          </div>

          {/* Toplam Bakiye */}
          <div className="col-lg-4 mb-4">
            <div
              className="card h-100"
              style={{
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
                border: "none",
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
              }}
            >
              <div className="card-body p-4">
                {isLoadingWeeklyRevenue ? (
                  <div className="text-center py-5">
                    <div className="spinner-border spinner-border-lg text-success" />
                    <p className="text-muted mt-3 mb-0">Veriler yükleniyor...</p>
                  </div>
                ) : weeklyRevenueError ? (
                  <div className="text-center py-5">
                    <i className="bx bx-error-circle text-danger" style={{ fontSize: "3rem" }} />
                    <p className="text-danger mt-3 mb-0">Veri yüklenirken bir hata oluştu.</p>
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <h6 style={{ color: "#2e7d32" }}>Toplam Bakiye</h6>
                        <p className="small mb-0" style={{ color: "#388e3c" }}>
                          Son 7 günlük toplam gelir
                        </p>
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <div style={{ fontSize: "2rem", color: "#1b5e20", fontWeight: "700" }}>
                        {formatCurrency(animatedCounts.totalRevenue)}
                      </div>
                      <div className="small mt-1" style={{ color: "#388e3c" }}>
                        {(() => {
                          const today = new Date();
                          const start = new Date(today);
                          start.setDate(today.getDate() - 6);
                          return `${start.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })} – ${today.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}`;
                        })()}
                      </div>
                    </div>
                    <div className="pt-3" style={{ borderTop: "1px solid rgba(76, 175, 80, 0.2)" }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small" style={{ color: "#2e7d32" }}>
                          <i className="bx bx-trending-up me-1"></i>Günlük Ortalama
                        </span>
                        <span className="fw-bold small" style={{ color: "#1b5e20" }}>
                          {formatCurrency(weeklyTotalRevenue / 7)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small" style={{ color: "#2e7d32" }}>
                          <i className="bx bx-bar-chart-alt-2 me-1"></i>Toplam Satış
                        </span>
                        <span className="fw-bold small" style={{ color: "#1b5e20" }}>
                          {reportData.salesCount.toLocaleString("tr-TR")} adet
                        </span>
                      </div>
                      {dailyRevenueData.some((v) => v > 0) && (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="small" style={{ color: "#2e7d32" }}>
                              <i className="bx bx-up-arrow-alt me-1"></i>En Yüksek Gün
                            </span>
                            <span className="fw-bold small" style={{ color: "#1b5e20" }}>
                              {formatCurrency(Math.max(...dailyRevenueData))}
                            </span>
                          </div>
                          <div className="pt-3" style={{ borderTop: "1px solid rgba(76, 175, 80, 0.2)" }}>
                            <div className="d-flex justify-content-between">
                              {dailyRevenueData.slice(-3).map((dayRevenue, index) => {
                                const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
                                const daysAgo = 2 - index;
                                const d = new Date();
                                d.setDate(d.getDate() - daysAgo);
                                const dayName = dayNames[d.getDay()];
                                return (
                                  <div key={index} className="text-center" style={{ flex: 1 }}>
                                    <div className="small mb-1" style={{ color: "#388e3c" }}>{dayName}</div>
                                    <div className="fw-semibold small" style={{ color: "#1b5e20" }}>
                                      {formatCurrency(dayRevenue)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Aylık Satış Geliri Grafiği */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Aylık Satış Geliri</h5>
              </div>
              <div className="card-body">
                <div id="monthlySalesChart"></div>
              </div>
            </div>
          </div>
        </div>

        {/* En Çok Satan Ürünler */}
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">En Çok Satan Ürünler (Gelir)</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ürün</th>
                        <th className="text-end">Gelir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topByRevenue.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            Veri bulunamadı
                          </td>
                        </tr>
                      ) : (
                        topByRevenue.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.title}</td>
                            <td className="text-end fw-semibold">
                              {formatCurrency(item.revenue)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">En Çok Satan Ürünler (Adet)</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ürün</th>
                        <th className="text-end">Adet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topByQuantity.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            Veri bulunamadı
                          </td>
                        </tr>
                      ) : (
                        topByQuantity.map((item, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.title}</td>
                            <td className="text-end fw-semibold">
                              {item.quantity.toLocaleString("tr-TR")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
