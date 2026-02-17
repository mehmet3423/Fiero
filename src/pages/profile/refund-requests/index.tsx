import CirclePagination from "@/components/shared/CirclePagination";
import StatusBadge from "@/components/shared/StatusBadge";
import { RefundRequestedOrder } from "@/constants/models/Order";
import { useGetRefundRequestsByCurrentUser } from "@/hooks/services/order/useGetRefundRequestsByCurrentUser";
import { formatCurrency } from "@/utils/currencyFormatter";
import { formatDate } from "@/utils/dateFormatter";
import Link from "next/link";
import { useState } from "react";
import { withProfileLayout } from "../_layout";
import { useLanguage } from "@/context/LanguageContext";

function RefundRequestsPage() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const {
    refundRequests,
    isLoading,
    error,
    totalPages,
    totalCount,
  } = useGetRefundRequestsByCurrentUser(currentPage, pageSize);

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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {t("ordersId.error").replace("{message}", (error as Error).message)}
      </div>
    );
  }

  if (!refundRequests || refundRequests.length === 0) {
    return (
      <div className="col-lg-12">
        <div className="my-account-content account-order">
          <div className="text-center py-5">
            <i
              className="bx bx-undo"
              style={{ fontSize: "3rem", color: "#ccc" }}
            />
            <p className="lead mt-3 mb-4">{t("ordersId.noRefundRequests")}</p>
            <Link
              href="/profile/orders"
              className="btn btn-sm"
              style={{
                padding: "8px 16px",
                color: "#fff",
                backgroundColor: "#000",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {t("orders.myOrders")}
            </Link>
          </div>
        </div>
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
                <th className="fw-6">{t("orders.total")}</th>
                <th className="fw-6">{t("orders.status")}</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests.map((refund: RefundRequestedOrder) => (
                <tr key={refund.id}>
                  <td>#{refund.orderNumber}</td>
                  <td>{formatDate(refund.createdOnValue)}</td>
                  <td>{formatCurrency(refund.totalPrice ?? 0)}</td>
                  <td>
                    <StatusBadge status={refund.cargoStatus} type="order" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}

export default withProfileLayout(RefundRequestsPage);
