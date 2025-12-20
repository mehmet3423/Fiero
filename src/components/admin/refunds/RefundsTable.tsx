import StatusBadge from "@/components/shared/StatusBadge";
import { RefundRequestedOrder } from "@/constants/models/Order";
import { formatCurrency } from "@/utils/currencyFormatter";
import { formatDate } from "@/utils/dateFormatter";
import Link from "next/link";

interface RefundsTableProps {
  refundRequests: RefundRequestedOrder[];
  currentPage: number;
  pageSize: number;
}

export default function RefundsTable({
  refundRequests,
  currentPage,
  pageSize,
}: RefundsTableProps) {
  if (!refundRequests || refundRequests.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i
            className="bx bx-undo"
            style={{ fontSize: "3rem", color: "#ccc" }}
          ></i>
          <p className="text-muted mt-2">Henüz iade talebi bulunmamaktadır</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover table-striped table-sm align-middle text-nowrap small">
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>E-posta</th>
                <th>Toplam Tutar</th>
                <th>Ürün Sayısı</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {refundRequests.map((refund, index) => (
                <tr key={refund.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>
                    <strong>#{refund.orderNumber}</strong>
                  </td>
                  <td>
                    {refund.shippingAddress ? (
                      <div>
                        <div>
                          {refund.shippingAddress.firstName ?? "-"}{" "}
                          {refund.shippingAddress.lastName ?? ""}
                        </div>
                        <small className="text-muted">
                          {refund.recipientPhoneNumber}
                        </small>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <small>{refund.email}</small>
                  </td>
                  <td>
                    <strong>{formatCurrency(refund.totalPrice || 0)}</strong>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {refund.orderProducts?.length || 0} Ürün
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={refund.cargoStatus} type="order" />
                  </td>
                  <td>{formatDate(refund.createdOnValue)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        href={`/admin/refunds/${refund.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="İade Detayını Görüntüle"
                      >
                        <i className="bx bx-show-alt"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

