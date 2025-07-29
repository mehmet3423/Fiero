import { useGetAllOrders } from "@/hooks/services/order/useGetAllOrders";
import Link from "next/link";
import { useState } from "react";
import CirclePagination from "@/components/shared/CirclePagination";

function OrdersPage() {
  const { orders, isLoading, error } = useGetAllOrders(1, 10);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    if (!order.orderItems) return 0;

    return order.orderItems.reduce((sum: number, item: any) => {
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

  // Paginate orders
  const paginateOrders = (items: any[]) => {
    if (!items || items.length === 0) return [];

    const sortedItems = [...items].sort(
      (a, b) =>
        new Date(b.createdOnValue).getTime() -
        new Date(a.createdOnValue).getTime()
    );

    const startIndex = (currentPage - 1) * pageSize;
    return sortedItems.slice(startIndex, startIndex + pageSize);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const paginatedOrders = orders ? paginateOrders(orders) : [];

  const totalCount = orders ? orders.length : 0;

  return (
    <div>
      <h6
        className="card-header mb-4 m-3"
        style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#566a7f" }}
      >
        Siparişler
      </h6>
      <div className="card">
        {orders.length === 0 ? (
          <div className="text-center p-5">
            <i className="bx bx-shopping-bag fs-1 text-muted mb-3"></i>
            <p className="text-muted">Henüz sipariş bulunmamaktadır.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive text-nowrap">
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
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.orderNumber}</strong>
                      </td>
                      <td>
                        {order.recipientFirstName} {order.recipientLastName}
                      </td>

                      <td>{formatCurrency(calculateTotalAmount(order))}</td>
                      <td>{formatDate(order.createdOnValue)}</td>
                      <td>
                        <span className={`badge bg-${order.cargoStatus}`}>
                          {order.cargoStatus}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            type="button"
                            className="btn p-0 dropdown-toggle hide-arrow"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bx bx-dots-vertical-rounded"></i>
                          </button>
                          <div className="dropdown-menu">
                            <Link
                              className="dropdown-item"
                              href={`/admin/orders/${order.id}`}
                            >
                              <i className="bx bx-show-alt me-2"></i> Görüntüle
                            </Link>
                            {/* <Link className="dropdown-item" href={`/admin/orders/edit/${order.id}`}>
                          <i className="bx bx-edit-alt me-2"></i> Düzenle
                        </Link>
                        <a className="dropdown-item" href="javascript:void(0);">
                          <i className="bx bx-trash me-2"></i> Sil
                        </a> */}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length > pageSize && (
              <CirclePagination
                totalCount={totalCount}
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
