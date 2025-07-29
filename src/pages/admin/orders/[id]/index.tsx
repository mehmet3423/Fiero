import { OrderItem } from "@/constants/models/Order";
import { useGetOrderById } from "@/hooks/services/order/useGetOrderById";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function AdminOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { order, isLoading, error } = useGetOrderById({
    orderId: id as string,
  });

  const [activeTab, setActiveTab] = useState<"details" | "items" | "customer">(
    "details"
  );

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
  const calculateTotalAmount = () => {
    if (!order?.orderItems || !order.orderItems) return 0;

    return order.orderItems.reduce((sum: number, item: OrderItem) => {
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

  if (isLoading) {
    return (
      <div className="card shadow-sm">
        <div className="d-flex justify-content-center align-items-center p-4">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "1.5rem", height: "1.5rem" }}
          >
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-3">
          <div className="alert alert-danger py-2 mb-2">
            Sipariş bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra
            tekrar deneyin.
          </div>
          <Link
            href="/admin/orders"
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="bx bx-arrow-back me-1"></i> Siparişlere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex-grow-1 container-p-y">
      <h5 className="fw-bold py-2 mb-3">
        <span className="text-muted fw-light">Siparişler /</span> Sipariş Detayı
      </h5>
      <div className="btn-group gap-2 mb-3">
        <Link
          href="/admin/orders"
          className="btn btn-primary btn-sm py-1 px-2"
          style={{ fontSize: "0.7rem" }}
        >
          <i className="bx bx-arrow-back me-1"></i> Geri
        </Link>
        {/* <Link href={`/admin/orders/edit/${order.id}`} className="btn btn-primary btn-sm py-1 px-2" style={{ fontSize: "0.7rem" }}>
                                <i className="bx bx-edit me-1"></i> Düzenle
                            </Link> */}
      </div>

      {/* Üst Bilgi Kartı */}
      <div className="card shadow-sm mb-3 p-3">
        <div className="card-header py-2 d-flex justify-content-between align-items-center">
          <h6 className=" fs-6">Sipariş #{order.orderNumber}</h6>
        </div>
        <div className="card-body py-2 px-3">
          <div className="row g-2">
            <div className="col-md-4 mb-0">
              <div className="d-flex align-items-center">
                <div
                  className="avatar flex-shrink-0 me-2"
                  style={{ width: "28px", height: "28px" }}
                >
                  <span
                    className="avatar-initial rounded bg-label-primary"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <i className="bx bx-calendar"></i>
                  </span>
                </div>
                <div>
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Sipariş Tarihi
                  </small>
                  <div style={{ fontSize: "0.8rem" }}>
                    {formatDate(order.createdOnValue)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-0">
              <div className="d-flex align-items-center">
                <div
                  className="avatar flex-shrink-0 me-2"
                  style={{ width: "28px", height: "28px" }}
                >
                  <span
                    className="avatar-initial rounded bg-label-success"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <i className="bx bx-money"></i>
                  </span>
                </div>
                <div>
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Toplam Tutar
                  </small>
                  <div style={{ fontSize: "0.8rem" }}>
                    {formatCurrency(calculateTotalAmount())}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-0">
              <div className="d-flex align-items-center">
                <div
                  className="avatar flex-shrink-0 me-2"
                  style={{ width: "28px", height: "28px" }}
                >
                  <span
                    className="avatar-initial rounded bg-label-info"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <i className="bx bx-package"></i>
                  </span>
                </div>
                <div>
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Ürün Sayısı
                  </small>
                  <div style={{ fontSize: "0.8rem" }}>
                    {order.orderItems.length} Ürün
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Menü */}
      <div className="nav-align-top mb-3">
        <ul
          className="nav nav-tabs nav-fill"
          role="tablist"
          style={{ fontSize: "0.8rem" }}
        >
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link py-1 ${
                activeTab === "details" ? "active" : ""
              }`}
              onClick={() => setActiveTab("details")}
            >
              <i className="bx bx-detail me-1"></i> Sipariş Detayları
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link py-1 ${
                activeTab === "items" ? "active" : ""
              }`}
              onClick={() => setActiveTab("items")}
            >
              <i className="bx bx-package me-1"></i> Ürünler
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link py-1 ${
                activeTab === "customer" ? "active" : ""
              }`}
              onClick={() => setActiveTab("customer")}
            >
              <i className="bx bx-user me-1"></i> Müşteri Bilgileri
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {/* Sipariş Detayları Tab */}
          <div
            className={`tab-pane fade ${
              activeTab === "details" ? "show active" : ""
            }`}
          >
            <div className="card shadow-sm">
              <div className="table-responsive text-nowrap">
                <table
                  className="table table-borderless mb-0"
                  style={{ fontSize: "0.8rem" }}
                >
                  <tbody>
                    <tr>
                      <td className="text-muted py-2" style={{ width: "30%" }}>
                        Sipariş Numarası
                      </td>
                      <td className="py-2">{order.orderNumber}</td>
                    </tr>

                    <tr>
                      <td className="text-muted py-2">Sipariş Tarihi</td>
                      <td className="py-2">
                        {formatDate(order.createdOnValue)}
                      </td>
                    </tr>

                    <tr>
                      <td className="text-muted py-2">Toplam Tutar</td>
                      <td className="py-2">
                        {formatCurrency(calculateTotalAmount())}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Son Güncelleme</td>
                      <td className="py-2">
                        {order.modifiedOnValue
                          ? formatDate(order.modifiedOnValue)
                          : "Güncelleme yok"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ürünler Tab */}
          <div
            className={`tab-pane fade ${
              activeTab === "items" ? "show active" : ""
            }`}
          >
            <div className="card shadow-sm">
              <div className="table-responsive text-nowrap">
                {order.orderItems.length > 0 ? (
                  <table className="table mb-0" style={{ fontSize: "0.8rem" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }} className="py-2"></th>
                        <th className="py-2">Ürün</th>
                        <th className="py-2">Birim Fiyat</th>
                        <th className="py-2">Adet</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {order.orderItems.map((item: OrderItem) => (
                        <tr key={item.id}>
                          <td className="py-2">
                            <span className="fw-medium">
                              {item.product?.title || "Ürün Adı Bulunamadı"}
                            </span>
                            <small
                              className="d-block text-muted"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Ürün Kodu: {item.orderItemNumber}
                            </small>
                          </td>
                          <td className="py-2">{formatCurrency(item.price)}</td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                      <tr className="table-active">
                        <td colSpan={3} className="text-end fw-medium py-2">
                          Toplam:
                        </td>
                        <td className="fw-bold py-2">
                          {formatCurrency(calculateTotalAmount())}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-muted py-5">
                    <i className="bx bx-package fs-1 d-block mb-3"></i>
                    Ürünler burada gösterilecek
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Müşteri Bilgileri Tab */}
          <div
            className={`tab-pane fade ${
              activeTab === "customer" ? "show active" : ""
            }`}
          >
            <div className="card shadow-sm">
              <div className="table-responsive text-nowrap">
                <table
                  className="table table-borderless mb-0"
                  style={{ fontSize: "0.8rem" }}
                >
                  <tbody>
                    <tr>
                      <td className="text-muted py-2" style={{ width: "30%" }}>
                        Müşteri Adı
                      </td>
                      <td className="py-2">
                        {order.recipientFirstName} {order.recipientLastName}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Telefon</td>
                      <td className="py-2">{order.recipientPhoneNumber}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Adres</td>
                      <td className="py-2">
                        {order.address.city} {order.address.district}
                        {order.address.country}
                        {order.address.fullAddress} {order.address.postalCode}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Müşteri ID</td>
                      <td className="py-2">
                        {order.customerId || "Misafir Kullanıcı"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
