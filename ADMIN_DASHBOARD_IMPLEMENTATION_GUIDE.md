# Admin Dashboard Raporlama Entegrasyonu - Implementasyon Rehberi

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Gereksinimler](#gereksinimler)
3. [Mimari Yapı](#mimari-yapı)
4. [Adım Adım Implementasyon](#adım-adım-implementasyon)
5. [API Entegrasyonları](#api-entegrasyonları)
6. [State Management](#state-management)
7. [Animasyonlar](#animasyonlar)
8. [Grafik Entegrasyonları](#grafik-entegrasyonları)
9. [Örnek Kodlar](#örnek-kodlar)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Genel Bakış

Bu dokümantasyon, admin panel dashboard'una gerçek zamanlı raporlama verilerini entegre etmek için adım adım bir rehber sunar. Sistem, çeşitli rapor verilerini (stok, beğeniler, satışlar, pasif ürünler, sepet analizi) API'lerden çekerek dashboard'da görselleştirir.

### Özellikler

- **Gerçek Zamanlı Veri**: React Query ile otomatik cache ve refetch
- **Animasyonlu Sayılar**: Sayıların yumuşak animasyonlarla gösterilmesi
- **Grafik Görselleştirme**: ApexCharts ile interaktif grafikler
- **Haftalık Gelir Analizi**: Son 7 günün günlük gelir verileri
- **Tıklanabilir Rapor Kartları**: Her kart ilgili rapor sayfasını açar
- **Responsive Tasarım**: Mobil ve desktop uyumlu

---

## 📦 Gereksinimler

### Bağımlılıklar

```bash
npm install @tanstack/react-query apexcharts
```

### Gerekli Hook'lar

- `useStockReport` - Stok raporu için
- `useMostLikedProductsReport` - Beğenilen ürünler için
- `useProductSalesReport` - Satış raporu için
- `usePassiveProductsReport` - Pasif ürünler için
- `useProductCartReport` - Sepet analizi için
- `useMainCategoriesLookUp` - Ana kategori sayısı için
- `useMainCategoriesWithSubCategories` - Alt kategori sayısı için
- `useGetSupportTickets` - Destek talepleri için
- `useGetOrderSupportTickets` - Sipariş destek talepleri için

### API Endpoint'leri

```typescript
// Paginated endpoints (sadece count için)
GET /api/Reports/StockReportPaginated
GET /api/Reports/MostLikedProductsReportPaginated
GET /api/Reports/ProductSalesReportPaginated
GET /api/Reports/PassiveProductsReportPaginated
GET /api/Reports/ProductCartReportPaginated

// Non-paginated endpoint (haftalık gelir için - tüm veriler)
GET /api/Reports/ProductSalesReport

// Diğer endpoint'ler
GET /api/Categories/GetMainCategoryLookUpList
GET /api/Categories/GetAllMainCategories
GET /api/SupportTickets/GetPaginated
GET /api/OrderSupportTickets/GetPaginated
```

---

## 🏗️ Mimari Yapı

### Dosya Yapısı

```
src/
├── pages/
│   └── admin/
│       └── index.tsx                    # Ana dashboard sayfası
├── hooks/
│   └── services/
│       ├── reports/
│       │   ├── useStockReport.ts
│       │   ├── useMostLikedProductsReport.ts
│       │   ├── useProductSalesReport.ts
│       │   ├── useProductSalesReportAll.ts    # Paginationsuz endpoint
│       │   ├── usePassiveProductsReport.ts
│       │   └── useProductCartReport.ts
│       ├── categories/
│       │   ├── useMainCategoriesLookUp.ts
│       │   └── useMainCategoriesWithSubCategories.ts
│       └── support/
│           ├── useGetSupportTicket.ts
│           └── order/
│               └── useGetOrderSupportTickets.ts
└── constants/
    ├── links.ts                          # API endpoint'leri
    └── models/
        └── reports/
            ├── StockReport.ts
            ├── MostLikedProductsReport.ts
            ├── ProductSalesReport.ts
            ├── PassiveProductsReport.ts
            └── ProductCartReport.ts
```

### Veri Akışı

```
API Endpoint
    ↓
Custom Hook (useQuery)
    ↓
Component (AdminHomePage)
    ↓
State Management (useState, useMemo)
    ↓
Animations (useEffect, useCallback)
    ↓
UI Rendering (Cards, Charts)
```

---

## 📝 Adım Adım Implementasyon

### 1. State Management Yapısını Kurmak

```typescript
import { useState, useRef } from "react";

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
}
```

### 2. API Hook'larını Entegre Etmek

```typescript
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
```

**ÖNEMLİ NOT - pageSize Kullanımı:**

- **pageSize: 1** → Sadece `count` değerine ihtiyaç olduğunda (çoğu rapor için)
- **pageSize: 1000** → `items` array'ine ihtiyaç olduğunda (destek talepleri filtreleme)
- API'den gelen `count` değeri her zaman toplam kayıt sayısını verir, pagination'dan bağımsızdır

### 3. Haftalık Gelir Hesaplama

```typescript
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

const { data: weeklyRevenueData } = useProductSalesReportAll(weeklyRevenueParams);
```

### 4. Memoized Data Hesaplamaları

```typescript
import { useMemo } from "react";

// Rapor sayılarını birleştir
const reportData = useMemo(
  () => ({
    stockCount: stockReport?.data?.count || 0,
    likedCount: likedProductsReport?.data?.count || 0,
    salesCount: salesReport?.data?.count || 0,
    passiveCount: passiveProductsReport?.data?.count || 0,
    cartCount: cartReport?.data?.count || 0,
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

    return dayItems.reduce(
      (sum, item) => sum + (item.totalRevenue || 0),
      0
    );
  });

  return dailyTotals;
}, [weeklyRevenueData]);
```

### 5. Animasyon Fonksiyonu

```typescript
import { useCallback } from "react";

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
```

### 6. Animasyonları Tetikleme

```typescript
import { useEffect } from "react";

// Her veri kaynağı için ayrı useEffect
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

// Diğer animasyonlar için aynı pattern...
```

### 7. Grafikleri Oluşturma

```typescript
import { useEffect } from "react";

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
```

### 8. Grafikleri Güncelleme

```typescript
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
```

### 9. Rapor Kartları

```tsx
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

  {/* Diğer rapor kartları için aynı pattern... */}
</div>
```

### 10. CSS Animasyonları

```tsx
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
```

---

## 🔌 API Entegrasyonları

### Paginationsuz Endpoint Hook'u

Haftalık gelir hesaplaması için paginationsuz endpoint kullanılır:

```typescript
// src/hooks/services/reports/useProductSalesReportAll.ts
import { useQuery } from "@tanstack/react-query";
import { GET_PRODUCT_SALES_REPORT_ALL } from "@/constants/links";
import { getToken } from "@/helpers/tokenUtils";
import { ProductSalesItem } from "@/constants/models/reports";

export interface ProductSalesReportAllParams {
  startDate?: string;
  endDate?: string;
  categoryKeyword?: string;
  customerNameKeyword?: string;
  isRegisteredCustomer?: boolean;
  ascending?: boolean;
}

export interface ProductSalesReportAllResponse {
  data?: {
    items: ProductSalesItem[];
  };
  items?: ProductSalesItem[];
  isSucceed: boolean;
  message: string;
}

const fetchProductSalesReportAll = async (
  params?: ProductSalesReportAllParams
): Promise<ProductSalesReportAllResponse> => {
  const url = new URL(GET_PRODUCT_SALES_REPORT_ALL);

  if (params?.startDate) {
    url.searchParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    url.searchParams.append("endDate", params.endDate);
  }

  // ... diğer parametreler

  const token = getToken();
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const responseData = await response.json();

  // "Veri bulunamadı" durumunu handle et
  if (!response.ok) {
    if (
      responseData?.message?.includes("bulunamadı") ||
      responseData?.message?.includes("not found")
    ) {
      return {
        items: [],
        isSucceed: false,
        message: responseData.message || "Veri bulunamadı",
      };
    }
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${responseData?.message || "Unknown error"}`
    );
  }

  return responseData;
};

export const useProductSalesReportAll = (
  params?: ProductSalesReportAllParams
) => {
  return useQuery({
    queryKey: [
      "productSalesReportAll",
      params?.startDate,
      params?.endDate,
      // ... diğer parametreler
    ],
    queryFn: () => fetchProductSalesReportAll(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
```

### Endpoint Tanımları

```typescript
// src/constants/links.ts

// Reports endpoints (Paginated)
export const GET_STOCK_REPORT = `${BASE_URL}api/Reports/StockReportPaginated`;
export const GET_MOST_LIKED_PRODUCTS_REPORT = `${BASE_URL}api/Reports/MostLikedProductsReportPaginated`;
export const GET_PRODUCT_SALES_REPORT = `${BASE_URL}api/Reports/ProductSalesReportPaginated`;
export const GET_PASSIVE_PRODUCTS_REPORT = `${BASE_URL}api/Reports/PassiveProductsReportPaginated`;
export const GET_PRODUCT_CART_REPORT = `${BASE_URL}api/Reports/ProductCartReportPaginated`;

// Reports endpoints (Non-Paginated - for bulk data)
export const GET_PRODUCT_SALES_REPORT_ALL = `${BASE_URL}api/Reports/ProductSalesReport`;
```

---

## 🔄 State Management

### State Yapısı

```typescript
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

// Animasyon tetikleme kontrolü
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
```

### Memoization Stratejisi

Tüm pahalı hesaplamalar `useMemo` ile memoize edilir:

```typescript
// Rapor verileri
const reportData = useMemo(() => ({
  stockCount: stockReport?.data?.count || 0,
  likedCount: likedProductsReport?.data?.count || 0,
  // ...
}), [dependencies]);

// Kategori verileri
const categoryData = useMemo(() => {
  // Hesaplamalar...
}, [dependencies]);

// Destek talepleri
const supportData = useMemo(() => {
  // Filtreleme ve hesaplamalar...
}, [dependencies]);

// Günlük gelir verileri
const dailyRevenueData = useMemo(() => {
  // Tarih karşılaştırmaları ve toplamalar...
}, [weeklyRevenueData]);
```

---

## 🎬 Animasyonlar

### Sayı Animasyonu

```typescript
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
```

### Animasyon Tetikleme Pattern'i

```typescript
// Her veri kaynağı için ayrı useEffect
useEffect(() => {
  if (
    reportData.stockCount > 0 &&
    !animationTriggered.current.stockItems
  ) {
    animationTriggered.current.stockItems = true;
    animateNumber(reportData.stockCount, (value) =>
      setAnimatedCounts((prev) => ({ ...prev, stockItems: value }))
    );
  }
}, [reportData.stockCount, animateNumber]);
```

**Önemli:** `animationTriggered` ref'i sayesinde animasyon sadece bir kez tetiklenir.

---

## 📊 Grafik Entegrasyonları

### ApexCharts Kurulumu

```bash
npm install apexcharts
```

### Grafik Oluşturma Pattern'i

```typescript
useEffect(() => {
  if (typeof window !== "undefined") {
    import("apexcharts").then((ApexCharts) => {
      const chart = new ApexCharts.default(
        document.querySelector("#chartId"),
        {
          // Chart config...
        }
      );

      chartRef.current = chart;
      chart.render();

      // Cleanup
      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      };
    });
  }
}, []);
```

### Grafik Güncelleme

```typescript
useEffect(() => {
  if (chartRef.current && data) {
    chartRef.current.updateSeries([
      {
        name: "Series Name",
        data: data,
      },
    ]);
  }
}, [data]);
```

---

## 💻 Örnek Kodlar

### Tam Örnek: Basit Dashboard

```typescript
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useStockReport } from "@/hooks/services/reports/useStockReport";
import { useMostLikedProductsReport } from "@/hooks/services/reports/useMostLikedProductsReport";

function SimpleDashboard() {
  const [animatedCounts, setAnimatedCounts] = useState({
    stockItems: 0,
    likedProducts: 0,
  });

  const animationTriggered = useRef({
    stockItems: false,
    likedProducts: false,
  });

  // API Hook'ları
  const { data: stockReport } = useStockReport({ page: 0, pageSize: 1 });
  const { data: likedProductsReport } = useMostLikedProductsReport({
    page: 0,
    pageSize: 1,
    ascending: false,
  });

  // Memoized data
  const reportData = useMemo(
    () => ({
      stockCount: stockReport?.data?.count || 0,
      likedCount: likedProductsReport?.data?.count || 0,
    }),
    [stockReport?.data?.count, likedProductsReport?.data?.count]
  );

  // Animasyon fonksiyonu
  const animateNumber = useCallback(
    (target: number, setter: (value: number) => void, duration = 2000) => {
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

  // Animasyonları tetikle
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Stok Kalemi</h5>
              <h2>{animatedCounts.stockItems.toLocaleString()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Beğenilen Ürünler</h5>
              <h2>{animatedCounts.likedProducts.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleDashboard;
```

---

## ✅ Best Practices

### 1. Error Handling

```typescript
const { data, isLoading, error } = useStockReport({ page: 0, pageSize: 1 });

if (error) {
  console.error("Stok raporu yüklenirken hata:", error);
  // Kullanıcıya hata mesajı göster
}

if (isLoading) {
  return <div>Yükleniyor...</div>;
}
```

### 2. Null Safety

Her zaman optional chaining ve nullish coalescing kullanın:

```typescript
const stockCount = stockReport?.data?.count || 0;
const items = weeklyRevenueData?.data?.items || weeklyRevenueData?.items || [];
```

### 3. Memoization

Pahalı hesaplamaları `useMemo` ile memoize edin:

```typescript
const reportData = useMemo(
  () => ({
    stockCount: stockReport?.data?.count || 0,
    // ...
  }),
  [stockReport?.data?.count, /* dependencies */]
);
```

### 4. Query Key Stratejisi

Tüm parametreleri query key'e dahil edin:

```typescript
queryKey: [
  "stockReport",
  params?.categoryKeyword,
  params?.page,
  params?.pageSize,
  params?.ascending,
],
```

### 5. Token Yönetimi

Token'ı her zaman kontrol edin:

```typescript
const token = getToken();
const headers = {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
};
```

### 6. Animasyon Performansı

Animasyonları sadece bir kez tetikleyin:

```typescript
const animationTriggered = useRef({
  stockItems: false,
  // ...
});

useEffect(() => {
  if (reportData.stockCount > 0 && !animationTriggered.current.stockItems) {
    animationTriggered.current.stockItems = true;
    // Animasyonu başlat
  }
}, [reportData.stockCount]);
```

### 7. Grafik Cleanup

Component unmount olduğunda grafikleri temizleyin:

```typescript
useEffect(() => {
  // Grafik oluştur
  return () => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  };
}, []);
```

---

## 🔧 Troubleshooting

### Problem: Veriler yüklenmiyor

**Çözüm:**
1. Network tab'ında API isteklerini kontrol edin
2. Token'ın geçerli olduğundan emin olun
3. API endpoint'lerinin doğru olduğunu kontrol edin
4. `page` ve `pageSize` parametrelerinin gönderildiğinden emin olun

```typescript
// Debug için
console.log("Stock Report Data:", stockReport);
console.log("Token:", getToken());
```

### Problem: 400 Bad Request hatası

**Olası Nedenler:**
1. `page` parametresi eksik → `page: 0` ekleyin
2. Zorunlu parametre eksik (örn: `ascending` for MostLikedProductsReport)
3. Tarih formatı yanlış → ISO string formatı kullanın

**Çözüm:**
```typescript
// Tüm rapor hook'larına page parametresi ekleyin
const { data: stockReport } = useStockReport({ page: 0, pageSize: 1 });

// Zorunlu parametreleri kontrol edin
const { data: likedReport } = useMostLikedProductsReport({
  page: 0,
  pageSize: 1,
  ascending: false, // Zorunlu
});
```

### Problem: "Veri bulunamadı" mesajı 400 hatası olarak dönüyor

**Çözüm:**
API bazen "veri bulunamadı" durumunu 400 status code ile döndürür. Bu durumu handle edin:

```typescript
const responseData = await response.json();

if (!response.ok) {
  // "Veri bulunamadı" durumunu handle et
  if (
    responseData?.message?.includes("bulunamadı") ||
    responseData?.message?.includes("not found")
  ) {
    return {
      items: [],
      isSucceed: false,
      message: responseData.message,
    };
  }
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

### Problem: Animasyonlar çalışmıyor

**Çözüm:**
1. `animationTriggered` ref'inin doğru çalıştığını kontrol edin
2. Verilerin yüklendiğinden emin olun
3. `useEffect` dependency array'ini kontrol edin

```typescript
// Debug için
useEffect(() => {
  console.log("Report Data:", reportData);
  console.log("Animation Triggered:", animationTriggered.current);
}, [reportData]);
```

### Problem: Grafikler render olmuyor

**Çözüm:**
1. DOM element'inin mevcut olduğundan emin olun
2. ApexCharts'ın doğru yüklendiğini kontrol edin
3. `useEffect` içinde `typeof window !== "undefined"` kontrolü yapın

```typescript
useEffect(() => {
  if (typeof window !== "undefined") {
    const chartElement = document.querySelector("#reportsChart");
    if (!chartElement) {
      console.error("Chart element not found!");
      return;
    }
    // Grafik oluştur
  }
}, []);
```

### Problem: pageSize limiti

**Çözüm:**
- Sadece `count` değerine ihtiyaç varsa → `pageSize: 1` kullanın
- `items` array'ine ihtiyaç varsa → Paginationsuz endpoint kullanın veya `pageSize: 100` (max limit)

```typescript
// Count için
const { data: stockReport } = useStockReport({ page: 0, pageSize: 1 });
const count = stockReport?.data?.count || 0;

// Items için (paginationsuz endpoint)
const { data: allData } = useProductSalesReportAll({
  startDate,
  endDate,
});
const items = allData?.items || allData?.data?.items || [];
```

---

## 📌 Önemli Notlar

1. **pageSize Kullanımı:**
   - `pageSize: 1` → Sadece `count` değerine ihtiyaç olduğunda
   - Paginationsuz endpoint → `items` array'ine ihtiyaç olduğunda
   - API'den gelen `count` değeri her zaman toplam kayıt sayısını verir

2. **Tarih Formatı:**
   - ISO string formatı kullanın: `2026-01-05T21:00:00.000Z`
   - Tarih karşılaştırmalarında sadece tarih kısmını kullanın (saat değil)

3. **Response Yapıları:**
   - Paginated endpoint'ler: `{ data: { count, items, ... }, isSucceed, message }`
   - Paginationsuz endpoint'ler: `{ items: [...], isSucceed, message }` veya `{ data: { items: [...] }, ... }`

4. **Error Handling:**
   - "Veri bulunamadı" mesajları normal durumlar olabilir, hata olarak handle etmeyin
   - 400 status code bazen "veri yok" anlamına gelebilir

5. **Performance:**
   - Tüm hesaplamaları `useMemo` ile memoize edin
   - Animasyonları sadece bir kez tetikleyin (`useRef` ile kontrol)
   - Grafikleri cleanup fonksiyonunda destroy edin

---

## 🚀 Hızlı Başlangıç Checklist

- [ ] Bağımlılıkları yükle (`@tanstack/react-query`, `apexcharts`)
- [ ] API endpoint'lerini tanımla (`links.ts`)
- [ ] Model tiplerini oluştur (`models/reports/`)
- [ ] Hook'ları oluştur (`hooks/services/reports/`)
- [ ] Paginationsuz endpoint hook'u oluştur (haftalık gelir için)
- [ ] State management yapısını kur
- [ ] Animasyon fonksiyonunu ekle
- [ ] Memoized data hesaplamalarını yap
- [ ] Grafikleri oluştur ve güncelle
- [ ] Rapor kartlarını ekle
- [ ] CSS animasyonlarını ekle
- [ ] Error handling ekle
- [ ] Test et

---

## 📚 Ek Kaynaklar

- [React Query Documentation](https://tanstack.com/query/latest)
- [ApexCharts Documentation](https://apexcharts.com/docs/)
- [React Hooks Best Practices](https://react.dev/reference/react)

---

**Not:** Bu dokümantasyon genel bir implementasyon rehberidir. Projenize özel API yapılarına göre adapte edilmelidir.
