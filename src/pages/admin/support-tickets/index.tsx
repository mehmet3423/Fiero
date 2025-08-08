import { GeneralSupportRequestType } from "@/constants/enums/GeneralRequestType";
import { useDeleteSupportTicket } from "@/hooks/services/support/useDeleteSupportTicket";
import { useGetSupportTickets } from "@/hooks/services/support/useGetSupportTicket";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import GeneralModal from "@/components/shared/GeneralModal";

export default function AdminSupportTicketsPage() {
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
  // Diğer state'lerin yanına ekleyin
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // API'den destek taleplerini al
  const { tickets, totalCount, isLoading, error } = useGetSupportTickets({
    page: displayPage - 1,
    pageSize,
    requestType,
    title,
    from,
  });

  const deleteMutation = useDeleteSupportTicket();

  // URL'yi güncelle
  useEffect(() => {
    const queryParams: Record<string, string> = {};

    if (displayPage !== 1) queryParams.page = displayPage.toString();
    if (pageSize !== 10) queryParams.pageSize = pageSize.toString();
    if (requestType !== undefined)
      queryParams.requestType = requestType.toString();
    if (title) queryParams.title = title;
    if (from !== undefined) queryParams.from = from;

    router.push(
      {
        pathname: router.pathname,
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  }, [displayPage, pageSize, requestType, title, from, router]);

  const handlePageChange = (newPage: number) => {
    setDisplayPage(newPage);
  };

  const handleRequestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRequestType(value === "all" ? undefined : Number(value));
    setDisplayPage(1);
  };

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hem geçici state'i hem de asıl state'i güncelle
    const value = e.target.value || undefined;
    setSearchTitle(value);
    setTitle(value);
    // Her değişiklikte sayfa 1'e dön
    setDisplayPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submit edildiğinde sayfa 1'e dön (artık title güncellemesine gerek yok)
    setDisplayPage(1);
  };

  const handleExport = () => {
    // Dışa aktarma işlemi burada yapılacak
    alert("Dışa aktarma özelliği henüz uygulanmadı");
  };

  const handleClearFilters = () => {
    setRequestType(undefined);
    setTitle(undefined);
    setSearchTitle(undefined);
    setFrom(undefined);
    setDisplayPage(1);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

  const handleDelete = (ticketId: string) => {
    setDeletingTicketId(ticketId);
    setShowDeleteModal(true);
    $("#deleteTicketModal").modal("show");
  };

  const handleConfirmDelete = async () => {
    if (!deletingTicketId) return;

    try {
      await deleteMutation.deleteSupportTicket(deletingTicketId);
      toast.success("Destek talebi başarıyla silindi");
      $("#deleteTicketModal").modal("hide");
      setShowDeleteModal(false);
      setDeletingTicketId(null);
    } catch (error) {
      toast.error("Silme işlemi sırasında bir hata oluştu");
    }
  };

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="card">
        <h6
          className="card-header"
          style={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Destek Talepleri
        </h6>

        <div className="d-flex justify-content-center align-items-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content py-4">
      {/* İstatistik Kutuları */}
      <div
        className="card-header pt-2 bg-transparent border-0 d-flex justify-content-between align-items-center"
        style={{ padding: "20px" }}
      >
        <h5 className="mb-0" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Destek Talepleri
        </h5>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="mb-2 mt-2" style={{ fontSize: "1.25rem" }}>
                  {totalCount}
                </h3>
                <p className="mb-0 text-muted" style={{ fontSize: "0.813rem" }}>
                  Toplam Talep
                </p>
              </div>
              <div className="text-primary">
                <i className="bx bx-message-square-dots fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="mb-2 mt-2" style={{ fontSize: "1.25rem" }}>
                  0
                </h3>
                <p className="mb-0 text-muted" style={{ fontSize: "0.813rem" }}>
                  Bekleyen
                </p>
              </div>
              <div className="text-warning">
                <i className="bx bx-time-five fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="mb-2 mt-2" style={{ fontSize: "1.25rem" }}>
                  0
                </h3>
                <p className="mb-0 text-muted" style={{ fontSize: "0.813rem" }}>
                  Yanıtlanan
                </p>
              </div>
              <div className="text-success">
                <i className="bx bx-check-circle fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <h3 className="mb-2 mt-2" style={{ fontSize: "1.25rem" }}>
                  0
                </h3>
                <p className="mb-0 text-muted" style={{ fontSize: "0.813rem" }}>
                  Kapatılan
                </p>
              </div>
              <div className="text-secondary">
                <i className="bx bx-x-circle fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Kart - Tablo */}
      <div className="card">
        <div
          className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center"
          style={{ padding: "10px" }}
        ></div>

        <div className="card-body">
          {/* Arama Formu */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Başlık ara..."
                value={searchTitle || ""}
                onChange={handleTitleSearch}
                style={{ fontSize: "0.813rem" , height: "40px"}}
              />
            </div>
            <div className="col-md-3 ">
              <select
                className="form-select form-select-sm"
                value={requestType?.toString() || "all"}
                onChange={handleRequestTypeChange}
                style={{ fontSize: "0.813rem", height: "40px" }}
              >
                <option value="all">Tüm Sorunlar</option>
                <option value="0">Diğer Sorunlar</option>
                <option value="1">Teknik Sorunlar</option>
                <option value="2">Geri Bildirimler</option>
                <option value="3">Hesap Sorunları</option>
              </select>
            </div>
            {/* <div className="col-auto">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleSearchSubmit}
              >
                <i className="bx bx-search me-1 m"></i>
                Ara
              </button>
            </div> */}
            {(requestType !== undefined || searchTitle) && (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary mb-2"
                  onClick={handleClearFilters}
                >
                  <i className="bx bx-refresh me-1"></i>
                  Temizle
                </button>
              </div>
            )}
          </div>

          {/* Tablo */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ fontSize: "0.813rem" }}>Başlık</th>
                  <th style={{ fontSize: "0.813rem" }}>Açıklama</th>
                  <th style={{ fontSize: "0.813rem" }}>Talep Türü</th>
                  <th style={{ fontSize: "0.813rem" }}>Durum</th>
                  <th style={{ fontSize: "0.813rem", textAlign: "center" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <i className="bx bx-info-circle fs-3 text-muted mb-2"></i>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.813rem" }}
                      >
                        Destek talebi bulunamadı
                      </p>
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td style={{ fontSize: "0.813rem" }}>
                        {ticket.title.length > 30
                          ? `${ticket.title.substring(0, 30)}...`
                          : ticket.title
                        }
                      </td>
                      <td style={{ fontSize: "0.813rem" }}>
                        {(ticket.description || "").length > 250
                          ? `${(ticket.description || "").substring(0, 250)}...`
                          : ticket.description || "Açıklama yok"
                        }
                      </td>
                      <td style={{ fontSize: "0.813rem" }}>
                        {GeneralSupportRequestType[ticket.requestType]}
                      </td>
                      <td>
                        <span
                          className={`badge bg-${ticket.status === 1 ? "success" : "warning"
                            }`}
                          style={{ fontSize: "0.75rem" }}
                        >
                          {ticket.status === 1 ? "Yanıtlandı" : "Bekliyor"}
                        </span>
                      </td>
                      <td className="d-flex flex-direction-row gap-1">
                        <button
                          className="btn btn-link btn-sm text-danger"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => handleDelete(ticket.id.toString())}
                          disabled={deleteMutation.isPending}
                        >
                          <i className="bx bx-trash me-1"></i>
                          
                        </button>

                        <button
                          className="btn btn-link btn-sm text-primary"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowDetailModal(true);
                            $("#ticketDetailModal").modal("show");
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <i className="bx bx-edit me-1"></i>
                          
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !error && totalPages > 0 && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top">
              <div className="small" style={{ fontSize: "0.813rem" }}>
                Toplam {totalCount} kayıttan {(displayPage - 1) * pageSize + 1}-
                {Math.min(displayPage * pageSize, totalCount)} arası
                gösteriliyor
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${displayPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      style={{ width: "5px" }}
                      onClick={() => handlePageChange(displayPage - 1)}
                      disabled={displayPage === 1}
                    >
                      <i className="bx bx-chevron-left"></i>
                    </button>
                  </li>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (displayPage <= 3) {
                      pageNum = i + 1;
                    } else if (displayPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = displayPage - 2 + i;
                    }
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${displayPage === pageNum ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            backgroundColor:
                              displayPage === pageNum
                                ? "#040404"
                                : "transparent",
                            color: displayPage === pageNum ? "#fff" : "#697a8d",
                            border: "1px solid #d9dee3",
                            minWidth: "32px",
                            padding: "0.375rem 0.75rem",
                            fontSize: "0.75rem",
                          }}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  <li
                    className={`page-item ${displayPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      style={{ width: "5px" }}
                      onClick={() => handlePageChange(displayPage + 1)}
                      disabled={displayPage === totalPages}
                    >
                      <i className="bx bx-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <GeneralModal
        id="deleteTicketModal"
        title="Destek Talebi Sil"
        size="sm"
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingTicketId(null);
        }}
        onApprove={handleConfirmDelete}
        approveButtonText="Evet, Sil"
        isLoading={deleteMutation.isPending}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="bx bx-error-circle mb-2"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h6 style={{ fontSize: "0.9rem" }}>Emin misiniz?</h6>
          <p className="text-muted" style={{ fontSize: "0.813rem" }}>
            Bu destek talebini silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
        </div>
      </GeneralModal>

      {/* Ticket Detail Modal */}
      <GeneralModal
        id="ticketDetailModal"
        title="Destek Talebi Detayı"
        size="xl"
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTicket(null);
        }}
        showFooter={false}
      >
        {selectedTicket && (
          <div className="d-flex flex-column flex-xl-row" style={{  zIndex: 1000 }}>

            <div className="col-xl-8 col-sm-12">
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                  Başlık:
                </label>
                <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                  {selectedTicket.title}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                  Açıklama:
                </label>
                <div
                  className="p-3 bg-light rounded"
                  style={{
                    fontSize: "0.9rem",
                    minHeight: "100px",
                    maxHeight: "300px",
                    overflowY: "auto"
                  }}
                >
                  {selectedTicket.description || "Açıklama bulunmuyor."}
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-sm-12 m-5">
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                  Talep Türü:
                </label>
                <p className="mb-5" style={{ fontSize: "0.9rem" }}>
                  {GeneralSupportRequestType[selectedTicket.requestType]}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{ fontSize: "0.9rem" }}>
                  Durum:
                </label>
                <p className="mb-0">
                  <span
                    className={`badge bg-${selectedTicket.status === 1 ? "success" : "warning"}`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {selectedTicket.status === 1 ? "Yanıtlandı" : "Bekliyor"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </GeneralModal>

      <style jsx>{`
        .pagination {
          margin: 0;
        }

        .page-link {
          border: 1px solid #d9dee3;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          color: #697a8d;
          background-color: transparent;
        }

        .page-link:hover {
          background-color: #e7e7ff;
          color: #696cff;
          border-color: #d9dee3;
        }

        .page-item.active .page-link {
          background-color: #696cff;
          border-color: #696cff;
          color: #fff;
        }

        .page-item.disabled .page-link {
          color: #697a8d;
          pointer-events: none;
          background-color: transparent;
          border-color: #d9dee3;
        }

        .page-link i {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
