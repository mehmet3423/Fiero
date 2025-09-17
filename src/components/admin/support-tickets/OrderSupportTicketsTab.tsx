import {
  OrderSupportRequestType,
  OrderSupportRequestTypeLabels,
} from "@/constants/enums/support-ticket/OrderSupportTicket/OrderSupportRequestType";
import {
  OrderSupportTicketStatusLabels,
  OrderSupportTicketStatusColors,
} from "@/constants/enums/support-ticket/OrderSupportTicket/OrderSupportStatus";
import { useGetOrderSupportTickets } from "@/hooks/services/support/order/useGetOrderSupportTickets";
import { useUpdateOrderSupportTicket } from "@/hooks/services/support/useUpdateOrderSupportTicket";
import { useDeleteSupportTicket } from "@/hooks/services/support/useDeleteSupportTicket";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import CirclePagination from "@/components/shared/CirclePagination";
import { toast } from "react-hot-toast";

export default function OrderSupportTicketsTab() {
  const router = useRouter();
  const { query } = router;

  // URL query parametrelerinden başlangıç değerlerini al
  const [displayPage, setDisplayPage] = useState(
    query.page ? Number(query.page) : 1
  );
  const [pageSize, setPageSize] = useState(
    query.pageSize ? Number(query.pageSize) : 10
  );

  const [requestType, setRequestType] = useState<number | undefined>(
    query.requestType !== undefined ? Number(query.requestType) : undefined
  );
  const [title, setTitle] = useState<string | undefined>(
    query.title as string | undefined
  );
  // Arama için geçici state
  const [searchTitle, setSearchTitle] = useState<string | undefined>(
    query.title as string | undefined
  );
  const [from, setFrom] = useState<string | undefined>(
    query.from as string | undefined
  );

  // Debounced search title - 500ms bekleyip sonra arama yapacak
  const debouncedTitle = useDebounce(searchTitle, 500);

  // API'den destek taleplerini al
  const { tickets, totalCount, isLoading, error, refetch } =
    useGetOrderSupportTickets({
      page: displayPage - 1,
      pageSize,
      requestType,
      title: debouncedTitle,
      from,
    });

  const deleteMutation = useDeleteSupportTicket();
  const updateMutation = useUpdateOrderSupportTicket();
  // Search title değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setDisplayPage(1);
  }, [debouncedTitle]);

  // URL güncellemelerini kaldırdık - sadece state yönetimi

  // Delete işlemi
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Update modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [updateFormData, setUpdateFormData] = useState({
    requestType: 0,
    supportTicketStatus: 0,
    title: "",
    description: "",
    orderItemId: "",
  });

  const handleDeleteClick = (ticketId: string) => {
    setDeletingTicketId(ticketId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTicketId) return;

    try {
      await deleteMutation.deleteSupportTicket(deletingTicketId);
      toast.success("Destek talebi başarıyla silindi");
      setShowDeleteModal(false);
      setDeletingTicketId(null);
      // Verileri yeniden yükle
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Silme işlemi başarısız oldu");
    }
  };

  // Update functions
  const handleEditClick = (ticket: any) => {
    setEditingTicket(ticket);
    setUpdateFormData({
      requestType: ticket.requestType,
      supportTicketStatus: ticket.supportTicketStatus,
      title: ticket.title,
      description: ticket.description || "",
      orderItemId: ticket.orderItemId || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!editingTicket) return;

    try {
      await updateMutation.updateOrderSupportTicket({
        id: editingTicket.id,
        ...updateFormData,
      });
      toast.success("Destek talebi başarıyla güncellendi");
      setShowUpdateModal(false);
      setEditingTicket(null);
      // Verileri yeniden yükle
      refetch();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Güncelleme işlemi başarısız oldu");
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setDisplayPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setDisplayPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setRequestType(undefined);
    setTitle(undefined);
    setSearchTitle("");
    setFrom(undefined);
    setDisplayPage(1);
    setPageSize(10);
  };

  if (error) {
    return <div className="alert alert-danger">Destek talebi bulunamadı. </div>;
  }

  return (
    <div>
      {/* Kompakt Filtreler */}
      <div className="card mb-3">
        <div className="card-body py-2">
          <div className="row g-2 align-items-end">
            {/* Başlık Arama */}
            <div className="col-md-4">
              <label className="form-label small mb-1">Başlık Ara</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Başlık ara..."
                value={searchTitle || ""}
                onChange={(e) => setSearchTitle(e.target.value || undefined)}
              />
            </div>

            {/* Talep Türü */}
            <div className="col-md-3">
              <label className="form-label small mb-1">Tür</label>
              <select
                className="form-select form-select-sm"
                value={requestType ?? ""}
                onChange={(e) =>
                  setRequestType(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              >
                <option value="">Tümü</option>
                {Object.entries(OrderSupportRequestTypeLabels).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Tarihten */}
            <div className="col-md-2">
              <label className="form-label small mb-1">Tarih</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={from || ""}
                onChange={(e) => setFrom(e.target.value || undefined)}
              />
            </div>

            {/* Sayfa Boyutu */}
            <div className="col-md-1">
              <label className="form-label small mb-1">Sayfa</label>
              <select
                className="form-select form-select-sm"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={handleResetFilters}
              >
                <i className="bx bx-refresh me-1"></i>
                Temizle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="card">
        <div className="card-header py-2">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold m-3 small">
              Sipariş Destek Talepleri ({totalCount})
            </span>
          </div>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-4">
              <i className="bx bx-info-circle display-4 text-muted"></i>
              <p className="mt-2 text-muted">
                Henüz sipariş destek talebi bulunmuyor.
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table
                  className="table table-striped table-sm"
                  style={{ fontSize: "0.875rem" }}
                >
                  <style jsx>{`
                    .table td,
                    .table th {
                      padding: 0.5rem 0.75rem;
                      vertical-align: middle;
                    }
                  `}</style>
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Talep Türü</th>
                      <th>Durum</th>
                      <th>Sipariş ID</th>
                      <th>Oluşturulma Tarihi</th>
                      <th>Müşteri ID</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <div className="fw-semibold">{ticket.title}</div>
                          {ticket.description && (
                            <small className="text-muted">
                              {ticket.description.length > 50
                                ? `${ticket.description.substring(0, 50)}...`
                                : ticket.description}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {OrderSupportRequestTypeLabels[
                              ticket.requestType as keyof typeof OrderSupportRequestTypeLabels
                            ] || "Bilinmiyor"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              OrderSupportTicketStatusColors[
                                ticket.supportTicketStatus as keyof typeof OrderSupportTicketStatusColors
                              ] || "secondary"
                            }`}
                          >
                            {OrderSupportTicketStatusLabels[
                              ticket.supportTicketStatus as keyof typeof OrderSupportTicketStatusLabels
                            ] || "Bilinmiyor"}
                          </span>
                        </td>
                        <td>
                          {ticket.orderItemId ? (
                            <span>#{ticket.orderItemId}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {new Date(ticket.createdOnValue).toLocaleDateString(
                            "tr-TR"
                          )}
                        </td>
                        <td>{ticket.customerId}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                router.push(
                                  `/admin/order-support-tickets/${ticket.id}`
                                )
                              }
                              title="Görüntüle"
                            >
                              <i className="bx bx-show"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleEditClick(ticket)}
                              title="Düzenle"
                            >
                              <i className="bx bx-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteClick(ticket.$id)}
                              title="Sil"
                            >
                              <i className="bx bx-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Circle Pagination */}
              <CirclePagination
                totalCount={totalCount}
                currentPage={displayPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Destek Talebini Sil</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <i className="bx bx-error-circle display-4 text-danger mb-3"></i>
                  <p>Bu destek talebini silmek istediğinizden emin misiniz?</p>
                  <p className="text-muted">Bu işlem geri alınamaz.</p>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Siliniyor...
                    </>
                  ) : (
                    "Sil"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Destek Talebini Güncelle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Başlık</label>
                    <input
                      type="text"
                      className="form-control"
                      value={updateFormData.title}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Talep Türü</label>
                    <select
                      className="form-select"
                      value={updateFormData.requestType}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          requestType: Number(e.target.value),
                        })
                      }
                    >
                      {Object.entries(OrderSupportRequestTypeLabels).map(
                        ([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Durum</label>
                    <select
                      className="form-select"
                      value={updateFormData.supportTicketStatus}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          supportTicketStatus: Number(e.target.value),
                        })
                      }
                    >
                      {Object.entries(OrderSupportTicketStatusLabels).map(
                        ([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sipariş ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={updateFormData.orderItemId}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          orderItemId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Açıklama</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={updateFormData.description}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateSubmit}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Güncelleniyor...
                    </>
                  ) : (
                    "Güncelle"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
