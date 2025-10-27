import React, { useState, useEffect } from "react";
import { useGetCommentList } from "@/hooks/services/reviews/useGetCommentList";
import { useApproveComment } from "@/hooks/services/reviews/useApproveComment";
import { useRejectComment } from "@/hooks/services/reviews/useRejectComment";
import { CommentItem } from "@/constants/models/Review";
import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { CommentStatus } from "@/constants/enums/CommentStatus";

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Arama input'u için ayrı state
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    CommentStatus.All
  );
  const [targetRatings, setTargetRatings] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvingComment, setApprovingComment] = useState<string | null>(null);
  const [rejectingComment, setRejectingComment] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(
    null
  );

  // Yeni filtreleme state'leri
  const [customerId, setCustomerId] = useState("");
  const [customerIdInput, setCustomerIdInput] = useState(""); // Arama input'u için ayrı state
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [searchTextInput, setSearchTextInput] = useState(""); // Arama input'u için ayrı state
  const [showFilters, setShowFilters] = useState(false); // Filtrelerin görünürlüğü

  const {
    data: commentsData,
    pagination,
    isLoading,
    refetch,
  } = useGetCommentList({
    productId: searchTerm || undefined,
    customerId: customerId || undefined,
    CommentStatusFilter: statusFilter ? parseInt(statusFilter) : undefined,
    TargetRatings: targetRatings.length > 0 ? targetRatings : undefined,
    isDeleted: isDeleted,
    search: searchText || undefined,
    page: currentPage - 1, // Frontend 1-based, backend 0-based
    pageSize: 20,
    from: 0,
  });

  const { approveComment, isPending: isApproving } = useApproveComment();
  const { rejectComment, isPending: isRejecting } = useRejectComment();

  // Arama fonksiyonları
  const handleProductSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleCustomerSearch = () => {
    setCustomerId(customerIdInput);
    setCurrentPage(1);
  };

  const handleTextSearch = () => {
    setSearchText(searchTextInput);
    setCurrentPage(1);
  };

  // Enter tuşu ile arama
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleProductSearch();
    }
  };

  const handleCustomerKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomerSearch();
    }
  };

  const handleTextKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTextSearch();
    }
  };

  // Status filter değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Target ratings değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [targetRatings]);

  // Eğer mevcut sayfada hiç item yoksa ve sayfa 1'den büyükse, önceki sayfaya git
  useEffect(() => {
    if (pagination && currentPage > 1) {
      const hasItems = commentsData && commentsData.length > 0;
      if (!hasItems && pagination.hasPrevious) {
        setCurrentPage(currentPage - 1);
      }
    }
  }, [commentsData, currentPage, pagination]);

  const handleApproveComment = async (commentId: string) => {
    try {
      await approveComment(commentId);
      setApprovingComment(null);
      // @ts-ignore
      if (window.$) window.$("#approveCommentModal").modal("hide");
      refetch();
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      await rejectComment(commentId);
      setRejectingComment(null);
      // @ts-ignore
      if (window.$) window.$("#rejectCommentModal").modal("hide");
      refetch();
    } catch (error) {
      console.error("Error rejecting comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApprovalStatusText = (approved: boolean | null) => {
    if (approved === null) {
      return "Beklemede";
    } else if (approved === true) {
      return "Onaylandı";
    } else {
      return "Reddedildi";
    }
  };

  const getApprovalStatusBadgeClass = (approved: boolean | null) => {
    if (approved === null) {
      return "badge bg-warning";
    } else if (approved === true) {
      return "badge bg-label-success";
    } else {
      return "badge bg-danger";
    }
  };

  const handleRatingToggle = (rating: number) => {
    setTargetRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  if (isLoading) {
    return (
      <div className="content-wrapper">
        <div className="container-l flex-grow-1 container-p-y">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center py-2">
                <h6 className="card-title m-3">
                  Yorum Yönetimi
                  {pagination && (
                    <span className="badge bg-primary ms-2">
                      {pagination.count}
                    </span>
                  )}
                </h6>
                <div className="d-flex gap-2 m-3">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="bx bx-filter me-1"></i>
                    Filtreler
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => refetch()}
                  >
                    <i className="bx bx-refresh"></i>
                  </button>
                </div>
              </div>

              <div className="card-body p-3">
                {/* Filtreler - Koşullu Görünüm */}
                {showFilters && (
                  <div className="border rounded p-3 mb-3 bg-light">
                    <div className="row mb-3">
                      {/* Ürün ID Arama */}
                      <div className="col-md-3">
                        <div className="form-group mb-2">
                          <label className="form-label small">
                            Ürün ID ile Ara
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Ürün ID girin..."
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              onKeyPress={handleKeyPress}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm"
                              type="button"
                              onClick={handleProductSearch}
                            >
                              <i className="bx bx-search"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Müşteri ID Arama */}
                      <div className="col-md-3">
                        <div className="form-group mb-2">
                          <label className="form-label small">
                            Müşteri ID ile Ara
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Müşteri ID girin..."
                              value={customerIdInput}
                              onChange={(e) =>
                                setCustomerIdInput(e.target.value)
                              }
                              onKeyPress={handleCustomerKeyPress}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm"
                              type="button"
                              onClick={handleCustomerSearch}
                            >
                              <i className="bx bx-search"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Metin Arama */}
                      <div className="col-md-3">
                        <div className="form-group mb-2">
                          <label className="form-label small">
                            Metin ile Ara
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Yorum içeriğinde ara..."
                              value={searchTextInput}
                              onChange={(e) =>
                                setSearchTextInput(e.target.value)
                              }
                              onKeyPress={handleTextKeyPress}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm"
                              type="button"
                              onClick={handleTextSearch}
                            >
                              <i className="bx bx-search"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Durum Filtresi */}
                      <div className="col-md-3">
                        <div className="form-group mb-2">
                          <label className="form-label small">
                            Durum Filtresi
                          </label>
                          <select
                            className="form-select form-select-sm"
                            style={{ fontSize: "0.75rem" }}
                            value={statusFilter || ""}
                            onChange={(e) =>
                              setStatusFilter(e.target.value || undefined)
                            }
                          >
                            <option value="">Tümü</option>
                            <option value={CommentStatus.Waiting}>
                              Beklemede
                            </option>
                            <option value={CommentStatus.Approved}>
                              Onaylandı
                            </option>
                            <option value={CommentStatus.NotApproved}>
                              Reddedildi
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* İkinci Satır Filtreler */}
                    <div className="row mb-3">
                      {/* Puan Filtresi */}
                      <div className="col-md-4">
                        <div className="form-group mb-2">
                          <label className="form-label small">
                            Puan Filtresi
                          </label>
                          <div className="d-flex gap-1 flex-wrap">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                className={`btn btn-sm ${
                                  targetRatings.includes(rating)
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                                }`}
                                onClick={() => handleRatingToggle(rating)}
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              >
                                {rating}★
                              </button>
                            ))}
                            {targetRatings.length > 0 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setTargetRatings([])}
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              >
                                Temizle
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Silinmiş Durumu */}
                      <div className="col-md-4">
                        <div className="form-group mb-2">
                          <label className="form-label small mb-3">
                            Silinmiş Durumu
                          </label>
                          <select
                            className="form-select form-select-sm"
                            style={{ fontSize: "0.75rem" }}
                            value={
                              isDeleted === undefined
                                ? ""
                                : isDeleted.toString()
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              setIsDeleted(
                                value === "" ? undefined : value === "true"
                              );
                            }}
                          >
                            <option value="">Tümü</option>
                            <option value="false">Aktif</option>
                            <option value="true">Silinmiş</option>
                          </select>
                        </div>
                      </div>

                      {/* Filtreleri Temizle */}
                      <div className="col-md-4">
                        <div className="form-group ">
                          <label className="form-label small">&nbsp;</label>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm w-100"
                            onClick={() => {
                              setSearchInput("");
                              setSearchTerm("");
                              setCustomerIdInput("");
                              setCustomerId("");
                              setSearchTextInput("");
                              setSearchText("");
                              setStatusFilter(undefined);
                              setTargetRatings([]);
                              setIsDeleted(undefined);
                              setCurrentPage(1);
                            }}
                          >
                            <i className="bx bx-refresh me-1"></i>
                            Tüm Filtreleri Temizle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yorumlar Tablosu */}
                <div className="table-responsive">
                  <table className="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th>Müşteri</th>
                        <th>Başlık</th>
                        <th>İçerik</th>
                        <th>Puan</th>
                        <th>Durum</th>
                        <th>Tarih</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commentsData && commentsData.length > 0 ? (
                        commentsData.map((comment) => (
                          <tr
                            key={comment.id}
                            onClick={() => setSelectedComment(comment)}
                          >
                            <td>
                              <div>
                                <strong className="small">
                                  {comment.customerName}
                                </strong>
                                <br />
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "0.7rem" }}
                                >
                                  {comment.customerId}
                                </small>
                              </div>
                            </td>

                            <td>
                              <div
                                className="text-truncate small"
                                style={{ maxWidth: "120px" }}
                              >
                                {comment.title}
                              </div>
                            </td>
                            <td>
                              <div
                                className="text-truncate small"
                                style={{ maxWidth: "150px" }}
                              >
                                {comment.content}
                              </div>
                            </td>
                            <td>
                              <span className="small">{comment.rating}/5</span>
                            </td>
                            <td>
                              <span
                                className={getApprovalStatusBadgeClass(
                                  comment.approved
                                )}
                                style={{ fontSize: "0.8rem" }}
                              >
                                {getApprovalStatusText(comment.approved)}
                              </span>
                            </td>
                            <td>
                              <small style={{ fontSize: "0.7rem" }}>
                                {new Date(
                                  comment.createdOnValue || ""
                                ).toLocaleDateString("tr-TR")}
                              </small>
                            </td>
                            <td>
                              <div
                                className="btn-group btn-group-sm"
                                role="group"
                              >
                                <button
                                  className="btn  btn-sm btn-outline-primary "
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedComment(comment);
                                    // @ts-ignore
                                    if (window.$)
                                      window
                                        .$("#commentDetailModal")
                                        .modal("show");
                                  }}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    marginRight: "0.5rem",
                                  }}
                                  title="Detayları Görüntüle"
                                >
                                  <i className="bx bx-show"></i>
                                </button>
                                <button
                                  className="btn btn-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setApprovingComment(comment.id);
                                    // @ts-ignore
                                    if (window.$)
                                      window
                                        .$("#approveCommentModal")
                                        .modal("show");
                                  }}
                                  disabled={isApproving}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    backgroundColor: "#a5f57d",
                                  }}
                                  title="Onayla"
                                >
                                  <i className="bx bx-check text-dark"></i>
                                </button>
                                <button
                                  className="btn btn-sm text-dark"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRejectingComment(comment.id);
                                    // @ts-ignore
                                    if (window.$)
                                      window
                                        .$("#rejectCommentModal")
                                        .modal("show");
                                  }}
                                  disabled={isRejecting}
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    backgroundColor: "#f55353",
                                  }}
                                  title="Reddet"
                                >
                                  <i className="bx bx-x"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            <div className="text-muted">
                              <i className="bx bx-message-square-detail fs-1"></i>
                              <p className="mt-2">Henüz yorum bulunmuyor</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.count > 0 && (
                  <div className="d-flex justify-content-center mt-3">
                    <CirclePagination
                      currentPage={currentPage} // Frontend state'ini direkt kullan
                      totalCount={pagination.count}
                      pageSize={pagination.size}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onaylama Modal */}
      <GeneralModal
        id="approveCommentModal"
        title="Yorumu Onayla"
        onClose={() => setApprovingComment(null)}
        onApprove={() =>
          approvingComment && handleApproveComment(approvingComment)
        }
        approveButtonText="Onayla"
        isLoading={isApproving}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="bx bx-check-circle"
            style={{ fontSize: "3rem", color: "#28a745" }}
          ></i>
          <h4 className="mt-3">Yorumu Onayla</h4>
          <p className="text-muted">
            Bu yorumu onaylamak istediğinizden emin misiniz?
          </p>
        </div>
      </GeneralModal>

      {/* Reddetme Modal */}
      <GeneralModal
        id="rejectCommentModal"
        title="Yorumu Reddet"
        onClose={() => setRejectingComment(null)}
        onApprove={() =>
          rejectingComment && handleRejectComment(rejectingComment)
        }
        approveButtonText="Reddet"
        isLoading={isRejecting}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="bx bx-x-circle"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3  ">Yorumu Reddet</h4>
          <p className="text-muted">
            Bu yorumu reddetmek istediğinizden emin misiniz?
          </p>
        </div>
      </GeneralModal>

      {/* Yorum Detay Modal */}
      <GeneralModal
        id="commentDetailModal"
        title="Yorum Detayları"
        onClose={() => setSelectedComment(null)}
        size="lg"
        showFooter={false}
      >
        {selectedComment && (
          <div className="row">
            <div className="col-md-8">
              <div className="mb-3">
                <h6 className="text-muted">Başlık</h6>
                <p className="mb-0 text-dark">{selectedComment.title}</p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted">İçerik</h6>
                <p className="mb-0 text-dark">{selectedComment.content}</p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted">Puan</h6>
                <div className="d-flex align-items-center text-dark">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`bx ${
                        index < selectedComment.rating
                          ? "bxs-star text-warning"
                          : "bx-star text-muted"
                      } me-1`}
                    />
                  ))}
                  <span className="ms-2">({selectedComment.rating}/5)</span>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted">Müşteri Bilgileri</h6>
                <p className="mb-1 text-dark">
                  <strong>Ad:</strong> {selectedComment.customerName}
                </p>
                <p className="mb-0 text-dark">
                  <strong>ID:</strong> {selectedComment.customerId}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted">Ürün Bilgileri</h6>
                <p className="mb-0 text-dark">
                  <strong>Ürün ID:</strong> {selectedComment.productId}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted">Tarih Bilgileri</h6>
                <p className="mb-1 text-dark">
                  <strong>Oluşturulma:</strong>{" "}
                  {formatDate(selectedComment.createdOnValue)}
                </p>
                {selectedComment.modifiedOnValue && (
                  <p className="mb-0 text-dark">
                    <strong>Güncellenme:</strong>{" "}
                    {formatDate(selectedComment.modifiedOnValue)}
                  </p>
                )}
              </div>
            </div>

            <div className="col-md-4">
              {selectedComment.imageUrl && (
                <div className="mb-3">
                  <h6 className="text-muted">Yorum Resmi</h6>
                  <img
                    src={selectedComment.imageUrl}
                    alt="Yorum resmi"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "200px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  className="btn text-dark"
                  style={{ backgroundColor: "#a5e981" }}
                  onClick={() => {
                    setApprovingComment(selectedComment.id);
                    setSelectedComment(null);
                    // @ts-ignore
                    if (window.$) window.$("#commentDetailModal").modal("hide");
                    // @ts-ignore
                    if (window.$)
                      window.$("#approveCommentModal").modal("show");
                  }}
                  disabled={isApproving}
                >
                  <i className="bx bx-check me-1 text-dark"></i>
                  Yorumu Onayla
                </button>

                <button
                  className="btn text-dark"
                  style={{ backgroundColor: "#f55353" }}
                  onClick={() => {
                    setRejectingComment(selectedComment.id);
                    setSelectedComment(null);
                    // @ts-ignore
                    if (window.$) window.$("#commentDetailModal").modal("hide");
                    // @ts-ignore
                    if (window.$) window.$("#rejectCommentModal").modal("show");
                  }}
                  disabled={isRejecting}
                >
                  <i className="bx bx-x me-1 text-dark"></i>
                  Yorumu Reddet
                </button>
              </div>
            </div>
          </div>
        )}
      </GeneralModal>
    </div>
  );
}
