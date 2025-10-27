import { useGetAllOrders } from "@/hooks/services/order/useGetAllOrders";
import Link from "next/link";
import { useState } from "react";
import CirclePagination from "@/components/shared/CirclePagination";

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

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Geçersiz Tarih";
      }

      // Türkçe ay isimleri
      const months = [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara",
      ];

      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      return "Geçersiz Tarih";
    }
  };
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
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

  // Cargo status helper functions
  const getCargoStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Hazırlanıyor";
      case 1:
        return "Kargoya Verildi";
      case 2:
        return "Teslim Edildi";
      case 3:
        return "İptal Edildi";
      default:
        return "Bilinmeyen";
    }
  };

  const getStatusBadgeClass = (status: number) => {
    switch (status) {
      case 0:
        return "bg-warning";
      case 1:
        return "bg-info";
      case 2:
        return "bg-success";
      case 3:
        return "bg-danger";
      default:
        return "bg-secondary";
    }
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
    <div>
      <div className="card-header mb-4 m-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#566a7f",
              margin: 0,
            }}
          >
            Siparişler
          </h6>
          <button
            className="btn btn-outline-primary btn-sm"
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

      {/* Filtreleme Paneli */}
      {showFilters && (
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="m-3">Filtreleme Seçenekleri</h6>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Arama */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Arama</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sipariş numarası, müşteri adı..."
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Başlangıç Tarihi */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Başlangıç Tarihi</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>

              {/* Bitiş Tarihi */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Bitiş Tarihi</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>

              {/* Kargo Durumu */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Kargo Durumu</label>
                <select
                  className="form-control"
                  value={filters.cargoStatus || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "cargoStatus",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">Tümü</option>
                  <option value="0">Hazırlanıyor</option>
                  <option value="1">Kargoya Verildi</option>
                  <option value="2">Teslim Edildi</option>
                  <option value="3">İptal Edildi</option>
                </select>
              </div>

              {/* Min Fiyat */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Min Fiyat (₺)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>

              {/* Max Fiyat */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Max Fiyat (₺)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1000"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>

              {/* Butonlar */}
              <div className="col-md-6 mb-3 d-flex align-items-end gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Aranıyor...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-search me-1"></i>
                      Ara
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="bx bx-x me-1"></i>
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        {orders.length === 0 ? (
          <div className="text-center p-5">
            <i className="bx bx-shopping-bag fs-1 text-muted mb-3"></i>
            <p className="text-muted">Henüz sipariş bulunmamaktadır.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive text-nowrap ">
              <table className="table">
                <thead>
                  <tr>
                    <th>SİPARİŞ NO</th>
                    <th>MÜŞTERİ</th>
                    <th>TUTAR</th>
                    <th>TARİH</th>
                    <th>DURUM</th>
                    <th>İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.orderNumber}</strong>
                      </td>
                      <td>
                        {order.shippingAddress?.firstName}{" "}
                        {order.shippingAddress?.lastName}
                      </td>

                      <td>{formatCurrency(calculateTotalAmount(order))}</td>
                      <td>{formatDate(order.createdOnValue)}</td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            order.cargoStatus
                          )}`}
                        >
                          {getCargoStatusText(order.cargoStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            className="btn btn-sm btn-outline-primary"
                            href={`/admin/orders/${order.id}`}
                            title="Siparişi Görüntüle"
                          >
                            <i className="bx bx-show-alt"></i>
                          </Link>
                          <Link
                            className="btn btn-sm btn-outline-success"
                            href={`/admin/cargo/create?orderId=${order.id}`}
                            title="Kargo Oluştur"
                          >
                            <i className="bx bx-package"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {apiTotalPages > 1 && (
              <CirclePagination
                totalCount={apiTotalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
