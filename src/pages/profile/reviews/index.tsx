import GeneralModal from "@/components/shared/GeneralModal";
import { DtoReview } from "@/constants/models/Review";
import { useAuth } from "@/hooks/context/useAuth";
import { useDeleteReview } from "@/hooks/services/reviews/useDeleteReview";
import { useUpdateReview } from "@/hooks/services/reviews/useUpdateReview";
import { useGetUserReviews } from "@/hooks/services/user-reviews/useGetUserReviews";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { withProfileLayout } from "../_layout";
import router from "next/router";

function ReviewsPage() {
  const { userProfile } = useAuth();
  const { reviews, isLoading, refetchReviews } = useGetUserReviews(
    userProfile?.id || ""
  );
  const { updateReview, isPending: isUpdating } = useUpdateReview();
  const { deleteReview, isPending: isDeleting } = useDeleteReview();

  // Düzenleme ve silme için state'ler
  const [editingReview, setEditingReview] = useState<DtoReview | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  // Düzenleme formu için state
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    rating: 0,
  });

  // Düzenleme modalını açma fonksiyonu
  const handleEditClick = (review: DtoReview) => {
    setEditingReview(review);
    setEditForm({
      title: review.title,
      content: review.content,
      rating: review.rating,
    });
    $("#editReviewModal").modal("show");
  };

  // Silme modalını açma fonksiyonu
  const handleDeleteClick = (reviewId: string, productId: string) => {
    setDeletingReviewId(reviewId);
    setDeletingProductId(productId);
    $("#deleteConfirmModal").modal("show");
  };

  // Düzenleme formunu kaydetme fonksiyonu
  const handleSaveEdit = async () => {
    if (!editingReview) return;

    try {
      const updatedReview: DtoReview = {
        ...editingReview,
        title: editForm.title,
        content: editForm.content,
        rating: editForm.rating,
      };

      await updateReview(updatedReview);
      $("#editReviewModal").modal("hide");
      setEditingReview(null);
      refetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Yorum güncellenirken bir hata oluştu");
    }
  };

  // Silme işlemini onaylama fonksiyonu
  const handleConfirmDelete = async () => {
    if (!deletingReviewId || !deletingProductId) return;

    try {
      await deleteReview(deletingReviewId, deletingProductId);
      $("#deleteConfirmModal").modal("hide");
      setDeletingReviewId(null);
      setDeletingProductId(null);
      refetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Yorum silinirken bir hata oluştu");
    }
  };

  // Yıldız derecelendirme bileşeni
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="ratings-container">
        <div className="ratings">
          <div
            className="ratings-val"
            style={{ width: `${rating * 20}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Düzenleme formunda yıldız seçme fonksiyonu
  const handleRatingChange = (newRating: number) => {
    setEditForm((prev) => ({ ...prev, rating: newRating }));
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "24px",
              fontSize: "22px",
              fontWeight: "600",
              color: "#333",
              borderBottom: "2px solid #eee",
              paddingBottom: "12px",
            }}
          >
            Yorumlarım
          </h3>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Yükleniyor...</span>
              </div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px",
                    backgroundColor: "#f9f9f9",
                    transition: "box-shadow 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {review.title}
                      </h5>
                      <StarRating rating={review.rating} />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleEditClick(review)}
                        disabled={isUpdating}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #000",
                          borderRadius: "4px",
                          backgroundColor: "#000",
                          color: "#fff",
                          cursor: isUpdating ? "not-allowed" : "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() =>
                          handleDeleteClick(review.id, review.productId)
                        }
                        disabled={isDeleting}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #dc3545",
                          borderRadius: "4px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          cursor: isDeleting ? "not-allowed" : "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "12px",
                    }}
                  >
                    {review.content}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <small
                      style={{
                        fontSize: "14px",
                        color: "#007bff",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => router.push(`/products/${review.productId}`)}
                    >
                      Ürün ID: {review.productId}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p style={{ fontSize: "14px", color: "#555" }}>
                Henüz bir yorum yapmadınız.
              </p>
              <Link
                href="/products"
                style={{
                  padding: "12px 24px",
                  border: "1px solid #007bff",
                  borderRadius: "4px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Ürünlere Göz At
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Düzenleme Modalı */}
      <GeneralModal
        id="editReviewModal"
        title="Yorumu Düzenle"
        size="lg"
        onClose={() => setEditingReview(null)}
        approveButtonText="Güncelle"
        isLoading={isUpdating}
        onApprove={handleSaveEdit}
        showFooter
      >
        <div className="form-group">
          <label>Başlık</label>
          <input
            type="text"
            className="form-control"
            value={editForm.title}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
        <div className="form-group">
          <label>Yorum</label>
          <textarea
            className="form-control"
            rows={5}
            value={editForm.content}
            onChange={(e) =>
              setEditForm((prev) => ({ ...prev, content: e.target.value }))
            }
          ></textarea>
        </div>
        <div className="form-group">
          <label>Değerlendirme</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= editForm.rating ? "active" : ""}`}
                onClick={() => handleRatingChange(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: star <= editForm.rating ? "#fcb941" : "#ccc",
                  marginRight: "5px",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </GeneralModal>

      {/* Silme Onay Modalı */}
      <GeneralModal
        id="deleteConfirmModal"
        title="Yorumu Sil"
        size="sm"
        onClose={() => {
          setDeletingReviewId(null);
          setDeletingProductId(null);
        }}
        onApprove={handleConfirmDelete}
        approveButtonText="Sil"
        isLoading={isDeleting}
        showFooter
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
        </div>
      </GeneralModal>

      <style jsx>{`
        .review-card {
          transition: all 0.3s ease;
          border: 1px solid #eaeaea;
          border-radius: 8px;
        }
        .review-card:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        .ratings-container {
          margin-bottom: 10px;
        }
        .ratings {
          position: relative;
          height: 20px;
          font-size: 14px;
        }
        .ratings::before {
          content: "★★★★★";
          color: #ddd;
        }
        .ratings-val {
          position: absolute;
          top: 0;
          left: 0;
          white-space: nowrap;
          overflow: hidden;
          color: #fcb941;
          height: 100%;
        }
        .ratings-val::before {
          content: "★★★★★";
        }
      `}</style>
    </div>
  );
}

export default withProfileLayout(ReviewsPage);
 
