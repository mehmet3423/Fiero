import RefundActionModal from "@/components/admin/refunds/RefundActionModal";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetRefundRequestedOrderItems } from "@/hooks/services/order/useGetRefundRequestedOrderItems";
import { formatCurrency } from "@/utils/currencyFormatter";
import { formatDate } from "@/utils/dateFormatter";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function RefundDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [currentPage] = useState(1);
  const pageSize = 100;

  const { refundRequests, isLoading, error, refetchRefundRequests } =
    useGetRefundRequestedOrderItems(currentPage, pageSize);

  const refundRequest = useMemo(() => {
    if (!id || !refundRequests) return null;
    return refundRequests.find((r) => r.id === id) || null;
  }, [id, refundRequests]);
  console.log("  refundRequest:", refundRequest);
  const [activeTab, setActiveTab] = useState<
    "details" | "items" | "customer" | "addresses"
  >("details");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const handleActionSuccess = () => {
    refetchRefundRequests?.();
    router.push("/admin/refunds");
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

  if (error || !refundRequest) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-3">
          <div className="alert alert-danger py-2 mb-2">
            İade talebi bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra
            tekrar deneyin.
          </div>
          <Link
            href="/admin/refunds"
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="bx bx-arrow-back me-1"></i> İade Taleplerine Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 container-p-y">
      <h5 className="fw-bold py-2 mb-3">
        <span className="text-muted fw-light">İade Yönetimi /</span> İade Detayı
      </h5>
      <div className="btn-group gap-2 mb-3">
        <Link
          href="/admin/refunds"
          className="btn btn-primary btn-sm py-1 px-2"
          style={{ fontSize: "0.7rem" }}
        >
          <i className="bx bx-arrow-back me-1"></i> Geri
        </Link>
        <button
          type="button"
          className="btn btn-success btn-sm py-1 px-2"
          style={{ fontSize: "0.7rem" }}
          onClick={() => setIsActionModalOpen(true)}
          disabled={!refundRequest}
        >
          <i className="bx bx-task me-1"></i> Talebi İşle
        </button>
      </div>

      {/* Üst Bilgi Kartı */}
      <div className="card shadow-sm mb-3 p-3">
        <div className="card-header py-2 d-flex justify-content-between align-items-center">
          <h6 className="fs-6">
            İade Talebi - Sipariş #{refundRequest.orderNumber}
          </h6>
        </div>
        <div className="card-body py-2 px-3">
          <div className="row g-2">
            <div className="col-md-3 mb-0">
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
                    Talep Tarihi
                  </small>
                  <div style={{ fontSize: "0.8rem" }}>
                    {formatDate(refundRequest.createdOnValue)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-0">
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
                    {formatCurrency(refundRequest.totalPrice)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-0">
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
                    {refundRequest.orderProducts?.length || 0} Ürün
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-0">
              <div className="d-flex align-items-center">
                <div
                  className="avatar flex-shrink-0 me-2"
                  style={{ width: "28px", height: "28px" }}
                >
                  <span
                    className="avatar-initial rounded bg-label-warning"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <i className="bx bx-info-circle"></i>
                  </span>
                </div>
                <div>
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Durum
                  </small>
                  <div style={{ fontSize: "0.8rem" }}>
                    <StatusBadge
                      status={refundRequest.cargoStatus}
                      type="order"
                    />
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
              className={`nav-link py-1 ${activeTab === "details" ? "active" : ""
                }`}
              onClick={() => setActiveTab("details")}
            >
              <i className="bx bx-detail me-1"></i> İade Detayları
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link py-1 ${activeTab === "items" ? "active" : ""
                }`}
              onClick={() => setActiveTab("items")}
            >
              <i className="bx bx-package me-1"></i> Ürünler
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link py-1 ${activeTab === "customer" ? "active" : ""
                }`}
              onClick={() => setActiveTab("customer")}
            >
              <i className="bx bx-user me-1"></i> Müşteri Bilgileri
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link py-1 ${activeTab === "addresses" ? "active" : ""
                }`}
              onClick={() => setActiveTab("addresses")}
            >
              <i className="bx bx-map me-1"></i> Adresler
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {/* İade Detayları Tab */}
          <div
            className={`tab-pane fade ${activeTab === "details" ? "show active" : ""
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
                      <td className="py-2">
                        <strong>#{refundRequest.orderNumber}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">E-posta</td>
                      <td className="py-2">{refundRequest.email}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Talep Tarihi</td>
                      <td className="py-2">
                        {formatDate(refundRequest.createdOnValue)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Toplam Tutar</td>
                      <td className="py-2">
                        {formatCurrency(refundRequest.totalPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Kargo Ücreti</td>
                      <td className="py-2">
                        {formatCurrency(refundRequest.cargoPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Durum</td>
                      <td className="py-2">
                        <StatusBadge
                          status={refundRequest.cargoStatus}
                          type="order"
                        />
                      </td>
                    </tr>
                    {refundRequest.couponCode && (
                      <tr>
                        <td className="text-muted py-2">Kupon Kodu</td>
                        <td className="py-2">
                          <span className="badge bg-info">
                            {refundRequest.couponCode}
                          </span>
                        </td>
                      </tr>
                    )}
                    {refundRequest.isGiftWrap && (
                      <tr>
                        <td className="text-muted py-2">Hediye Paketi</td>
                        <td className="py-2">
                          <span className="badge bg-success">Evet</span>
                          {refundRequest.giftWrapMessage && (
                            <div className="mt-1 small text-muted">
                              Not: {refundRequest.giftWrapMessage}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                    {refundRequest.cargoTrackingNumber && (
                      <tr>
                        <td className="text-muted py-2">Kargo Takip Kodu</td>
                        <td className="py-2">
                          <span className="badge bg-primary">
                            {refundRequest.cargoTrackingNumber}
                          </span>
                        </td>
                      </tr>
                    )}
                    {refundRequest.cargoCompany && (
                      <tr>
                        <td className="text-muted py-2">Kargo Şirketi</td>
                        <td className="py-2">{refundRequest.cargoCompany}</td>
                      </tr>
                    )}
                    {refundRequest.modifiedOnValue && (
                      <tr>
                        <td className="text-muted py-2">Son Güncelleme</td>
                        <td className="py-2">
                          {formatDate(refundRequest.modifiedOnValue)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ürünler Tab */}
          <div
            className={`tab-pane fade ${activeTab === "items" ? "show active" : ""
              }`}
          >
            <div className="card shadow-sm">
              <div className="table-responsive text-nowrap">
                {refundRequest.orderProducts &&
                  refundRequest.orderProducts.length > 0 ? (
                  <table className="table mb-0" style={{ fontSize: "0.8rem" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }} className="py-2"></th>
                        <th className="py-2">Ürün</th>
                        <th className="py-2">Birim Fiyat</th>
                        <th className="py-2">Adet</th>
                        <th className="py-2">Toplam</th>
                        <th className="py-2">Not</th>
                        <th className="py-2">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {refundRequest.orderProducts.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2">
                            {item.baseImageUrl ? (
                              <img
                                src={item.baseImageUrl}
                                alt={item.productTitle || "Ürün"}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "1px solid #eee",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "40px",
                                  height: "40px",
                                  background: "#f5f5f5",
                                  borderRadius: "4px",
                                  border: "1px solid #eee",
                                }}
                              ></span>
                            )}
                          </td>
                          <td className="py-2">
                            <span className="fw-medium">
                              {item.productTitle || "Ürün Adı Bulunamadı"}
                            </span>
                            <small
                              className="d-block text-muted"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Ürün Kodu: {item.orderItemNumber}
                            </small>
                          </td>
                          <td className="py-2">
                            {formatCurrency(
                              item.orderItemPrice || item.price || 0
                            )}
                          </td>
                          <td className="py-2">{item.quantity}</td>
                          <td className="py-2">
                            {formatCurrency(
                              (item.orderItemPrice || item.price || 0) *
                              item.quantity
                            )}
                          </td>
                          <td className="py-2">
                            {item.note ? (
                              <small className="text-muted">{item.note}</small>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="py-2">
                            <StatusBadge
                              status={item.cargoStatus}
                              type="order"
                            />
                          </td>
                        </tr>
                      ))}
                      <tr className="table-active">
                        <td colSpan={4} className="text-end fw-medium py-2">
                          Toplam:
                        </td>
                        <td className="fw-bold py-2">
                          {formatCurrency(refundRequest.totalPrice)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-muted py-5">
                    <i className="bx bx-package fs-1 d-block mb-3"></i>
                    Ürün bulunamadı
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Müşteri Bilgileri Tab */}
          <div
            className={`tab-pane fade ${activeTab === "customer" ? "show active" : ""
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
                        Ad Soyad
                      </td>
                      <td className="py-2">
                        {refundRequest.recipientFirstName || "-"}{" "}
                        {refundRequest.recipientLastName || ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">E-posta</td>
                      <td className="py-2">{refundRequest.email}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Telefon</td>
                      <td className="py-2">
                        {refundRequest.recipientPhoneNumber}
                      </td>
                    </tr>
                    {refundRequest.recipientIdentityNumber && (
                      <tr>
                        <td className="text-muted py-2">TC Kimlik No</td>
                        <td className="py-2">
                          {refundRequest.recipientIdentityNumber}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-muted py-2">Müşteri ID</td>
                      <td className="py-2">
                        {refundRequest.customerId || "Misafir Kullanıcı"}
                      </td>
                    </tr>
                    {refundRequest.corporateCompanyName && (
                      <>
                        <tr>
                          <td className="text-muted py-2">Şirket Adı</td>
                          <td className="py-2">
                            {refundRequest.corporateCompanyName}
                          </td>
                        </tr>
                        {refundRequest.corporateTaxNumber && (
                          <tr>
                            <td className="text-muted py-2">Vergi No</td>
                            <td className="py-2">
                              {refundRequest.corporateTaxNumber}
                            </td>
                          </tr>
                        )}
                        {refundRequest.corporateTaxOffice && (
                          <tr>
                            <td className="text-muted py-2">Vergi Dairesi</td>
                            <td className="py-2">
                              {refundRequest.corporateTaxOffice}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Adresler Tab */}
          <div
            className={`tab-pane fade ${activeTab === "addresses" ? "show active" : ""
              }`}
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-header py-2">
                    <h6 className="mb-0 fs-6">Fatura Adresi</h6>
                  </div>
                  <div className="card-body">
                    {refundRequest.billingAddress ? (
                      <div style={{ fontSize: "0.8rem" }}>
                        <p className="mb-1">
                          <strong>
                            {refundRequest.billingAddress.firstName}{" "}
                            {refundRequest.billingAddress.lastName}
                          </strong>
                        </p>
                        <p className="mb-1 text-muted">
                          {refundRequest.billingAddress.phoneNumber}
                        </p>
                        <p className="mb-0">
                          {refundRequest.billingAddress.fullAddress}
                          <br />
                          {refundRequest.billingAddress.district}{" "}
                          {refundRequest.billingAddress.city} /{" "}
                          {refundRequest.billingAddress.country}
                          <br />
                          {refundRequest.billingAddress.postalCode}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted">Adres bilgisi bulunamadı</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm">
                  <div className="card-header py-2">
                    <h6 className="mb-0 fs-6">Teslimat Adresi</h6>
                  </div>
                  <div className="card-body">
                    {refundRequest.shippingAddress ? (
                      <div style={{ fontSize: "0.8rem" }}>
                        <p className="mb-1">
                          <strong>
                            {refundRequest.shippingAddress.firstName}{" "}
                            {refundRequest.shippingAddress.lastName}
                          </strong>
                        </p>
                        <p className="mb-1 text-muted">
                          {refundRequest.shippingAddress.phoneNumber}
                        </p>
                        <p className="mb-0">
                          {refundRequest.shippingAddress.fullAddress}
                          <br />
                          {refundRequest.shippingAddress.district}{" "}
                          {refundRequest.shippingAddress.city} /{" "}
                          {refundRequest.shippingAddress.country}
                          <br />
                          {refundRequest.shippingAddress.postalCode}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted">Adres bilgisi bulunamadı</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RefundActionModal
        refundRequest={refundRequest}
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}

export default RefundDetailPage;
