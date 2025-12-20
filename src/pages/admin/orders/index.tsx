import { useGetAllOrders } from "@/hooks/services/order/useGetAllOrders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrdersFilters from "@/components/admin/orders/OrdersFilters";
import Link from "next/link";
import { useState } from "react";
import CirclePagination from "@/components/shared/CirclePagination";
import { formatDate } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/currencyFormatter";

interface OrderFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  cargoStatus?: number;
  minPrice?: number;
  maxPrice?: number;
  from?: number;
}

function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<OrderFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  const {
    orders,
    isLoading,
    error,
    totalCount: apiTotalCount,
    totalPages: apiTotalPages,
  } = useGetAllOrders(currentPage, pageSize, appliedFilters);

  // Calculate total amount for an order
  const calculateTotalAmount = (order: any) => {
    // API'den gelen totalPrice'ı kullan
    if (order.totalPrice !== undefined && order.totalPrice !== null) {
      return order.totalPrice;
    }

    // Fallback: orderItems'dan hesapla
    const orderItems = order.orderItems || [];
    if (!orderItems || orderItems.length === 0) return 0;

    return orderItems.reduce((sum: number, item: any) => {
      const price = typeof item.price === "number" ? item.price : 0;
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      return sum + price * quantity;
    }, 0);
  };

  // API'den gelen veriler zaten paginated, client-side pagination gerekmez

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filtreleme fonksiyonları
  const handleFilterChange = (field: keyof OrderFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Otomatik arama yapılmaz, sadece form değeri güncellenir
  };

  const handleSearch = () => {
    // Tarih formatını ISO 8601'e çevir
    const formattedFilters = { ...filters };

    if (formattedFilters.startDate) {
      // Başlangıç tarihini günün başına ayarla (00:00:00)
      const startDate = new Date(formattedFilters.startDate);
      startDate.setHours(0, 0, 0, 0);
      formattedFilters.startDate = startDate.toISOString();
    }

    if (formattedFilters.endDate) {
      // Bitiş tarihini günün sonuna ayarla (23:59:59)
      const endDate = new Date(formattedFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      formattedFilters.endDate = endDate.toISOString();
    }

    setAppliedFilters(formattedFilters); // Filtreleri uygula
    setCurrentPage(1); // Sayfa 1'e dön
  };

  const clearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="card">
        <h5
          className="card-header"
          style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}
        >
          Siparişler
        </h5>
        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h5
          className="card-header"
          style={{ fontSize: "1.2rem", fontWeight: "bold", padding: "20px" }}
        >
          Siparişler
        </h5>
        <div className="alert alert-danger m-3">
          Siparişler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar
          deneyin.
        </div>
      </div>
    );
  }

  // API'den gelen orders zaten doğru sayfa verileri

  return (
    <div className="admin-compact-list">
      <div className="card bg-transparent border-0 mb-3">
        <div className="card-body py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <h4 className="mb-1 fw-bold">Sipariş Yönetimi</h4>
            <p className="mb-0 text-muted" style={{ fontSize: "0.875rem" }}>
              Siparişleri görüntüleyin, filtreleyin ve yönetin.
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i
                className={`bx ${
                  showFilters ? "bx-chevron-up" : "bx-filter"
                } me-1`}
              ></i>
              {showFilters ? "Filtreleri Gizle" : "Filtrele"}
            </button>
          </div>
        </div>
      </div>

      {/* Filtreleme Paneli */}
      {showFilters && (
        <OrdersFilters
          filters={filters}
          showFilters={showFilters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearFilters={clearFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
      )}

      <div className="card shadow-sm">
        {orders.length === 0 ? (
          <div className="text-center p-5">
            <i className="bx bx-shopping-bag fs-1 text-muted mb-3"></i>
            <p className="text-muted">Henüz sipariş bulunmamaktadır.</p>
          </div>
        ) : (
          <>
            <OrdersTable
              orders={orders}
              calculateTotalAmount={calculateTotalAmount}
              currentPage={currentPage}
              pageSize={pageSize}
            />
            {apiTotalPages > 1 && (
              <CirclePagination
                totalCount={apiTotalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                variant="compact"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
