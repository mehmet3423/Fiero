import ConfirmModal from "@/components/shared/ConfirmModal";
import GeneralModal from "@/components/shared/GeneralModal";
import CirclePagination from "@/components/shared/CirclePagination";
import { Order, OrderItem } from "@/constants/models/Order";
import { useDeleteOrder } from "@/hooks/services/order/useDeleteOrder";
import { useGetUserOrders } from "@/hooks/services/order/useGetUserOrders";
import Link from "next/link";
import { useState } from "react";
import { withProfileLayout } from "../_layout";
import { useLanguage } from "@/context/LanguageContext"; // Import useLanguage

function OrdersPage() {
  const { t } = useLanguage(); // Initialize useLanguage
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Sayfa başına gösterilecek sipariş sayısı
  const {
    orders,
    isLoading,
    error,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
  } = useGetUserOrders(currentPage, pageSize);
  const { deleteOrder, isPending: isDeleting } = useDeleteOrder();

  // Silme işlemi için onay modalı state'i
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleDeleteClick = (orderId: string) => {
    setDeletingOrderId(orderId);
    $("#deleteOrderModal").modal("show");
  };

  const handleConfirmDelete = async () => {
    if (deletingOrderId) {
      await deleteOrder(deletingOrderId);
      $("#deleteOrderModal").modal("hide");
      setDeletingOrderId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("orders.loading")}</span>
        </div>
      </div>
    );
  }

  if (error || !orders || orders.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i
            className="icon-shopping-cart"
            style={{ fontSize: "3rem", color: "#ccc" }}
          ></i>
        </div>
        <p className="lead mb-4">{t("orders.noOrders")}</p>
        <Link href="/products" className="btn btn-outline-primary-2">
          <span>{t("orders.startShopping")}</span>
          <i className="icon-long-arrow-right"></i>
        </Link>
      </div>
    );
  }

  return (
    <div className="col-lg-12">
      <div className="my-account-content account-order">
        <div className="wrap-account-order">
          <table>
            <thead>
              <tr>
                <th className="fw-6">{t("orders.order")}</th>
                <th className="fw-6">{t("orders.date")}</th>
                <th className="fw-6">{t("orders.status")}</th>
                <th className="fw-6">{t("orders.total")}</th>
                <th className="fw-6">{t("orders.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => {
                const totalAmount = order.orderItems?.reduce(
                  (sum: number, item: OrderItem) => {
                    const price = typeof item.price === "number" ? item.price : 0;
                    const quantity = typeof item.quantity === "number" ? item.quantity : 0;
                    return sum + price * quantity;
                  },
                  0
                );
                return (
                  <tr className="tf-order-item" key={order.id}>
                    <td>#{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.cargoStatus}</td>
                    <td>
                      {!isNaN(totalAmount)
                        ? totalAmount.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })
                        : t("orders.zeroAmount")}
                    </td>
                    <td style={{ display: "flex", justifyContent: "space-between" }}>
                      <Link
                        href={`/profile/orders/${order.id}`}
                        className="btn btn-info btn-sm"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px 12px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "4px",
                          color: "#fff",
                          backgroundColor: "#000000ff",
                          border: "none",
                        }}
                      >
                        {t("orders.view")}
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(order.id)}
                        disabled={isDeleting}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px 12px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "4px",
                          marginLeft: "auto",
                        }}
                      >
                        {t("orders.delete")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted" style={{ fontSize: "1.7rem" }}>
              {(currentPage - 1) * pageSize + 1}-{" "}
              {Math.min(currentPage * pageSize, totalCount)} / {totalCount}{" "}
              {t("orders.records")}
            </div>
            <CirclePagination
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Sipariş Silme Onay Modalı */}
      <GeneralModal
        id="deleteOrderModal"
        title=""
        showFooter={false}
        onClose={() => setDeletingOrderId(null)}
      >
        <ConfirmModal
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title={t("orders.confirmDeleteTitle")}
          message={t("orders.confirmDeleteMessage")}
          confirmButtonText={t("orders.confirmDeleteButton")}
          cancelButtonText={t("orders.cancel")}
        />
      </GeneralModal>
    </div>
  );
}

export default withProfileLayout(OrdersPage);