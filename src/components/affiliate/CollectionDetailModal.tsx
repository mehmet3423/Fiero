import GeneralModal from "@/components/shared/GeneralModal";
import { AffiliateCollection } from "@/constants/models/Affiliate";
import { useGetAffiliateCollectionById } from "@/hooks/services/affiliate/useGetAffiliateCollectionById";
import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateApplicationStatus";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CollectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string | null;
}

const getCollectionTypeText = (collection: AffiliateCollection): string => {
  if (collection.productBasedAffiliateItems?.length > 0) {
    return "Ürün Bazlı";
  } else if (collection.categoryBasedAffiliateItems?.length > 0) {
    return "Kategori Bazlı";
  } else if (collection.combinationBasedAffiliateItems?.length > 0) {
    return "Kombinasyon Bazlı";
  } else if (collection.collectionBasedAffiliateItems?.length > 0) {
    return "Koleksiyon Bazlı";
  }
  return "Bilinmeyen";
};

const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
  isOpen,
  onClose,
  collectionId,
}) => {
  const { collection, isLoading } = useGetAffiliateCollectionById(
    collectionId || ""
  );
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      $("#collectionDetailModal").modal("show");
    } else {
      $("#collectionDetailModal").modal("hide");
    }

    // Modal kapatılma olaylarını dinle
    const handleModalHide = () => {
      onClose();
    };

    $("#collectionDetailModal").on("hidden.bs.modal", handleModalHide);

    // Cleanup
    return () => {
      $("#collectionDetailModal").off("hidden.bs.modal", handleModalHide);
    };
  }, [isOpen, onClose]);

  if (!collectionId) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("URL başarıyla kopyalandı");
      setIsCopied(true);
      // 2 saniye sonra ikonu geri döndür
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("URL kopyalanırken hata oluştu");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:02:54.8957314") {
      return "Belirtilmemiş";
    }
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <GeneralModal
      id="collectionDetailModal"
      title="Koleksiyon Detayları"
      showFooter={false}
      onClose={onClose}
      size="xl"
    >
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Yükleniyor...</span>
          </div>
        </div>
      ) : collection ? (
        // Check if collection is active before showing content

        <div className="collection-detail">
          {/* Header */}
          <div className="collection-header mb-3">
            <div className="row">
              <div className="col-md-8">
                <h3 className="collection-title mb-2">{collection.name}</h3>

                <p className="collection-description text-muted">
                  {collection.description}
                </p>
                <div className="d-flex mt-5 ">
                  <span
                    className="badge text-dark  small"
                    style={{
                      border: "1px solid #ced4da",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "12px",
                      color: "#2c3e50",
                    }}
                  >
                    {getCollectionTypeText(collection)}
                  </span>
                </div>
              </div>

              <div className="col-md-4 text-end">
                <div className="stats-card p-3 bg-light rounded">
                  <div className="stat-item mb-2">
                    <small className="text-muted">Satış Sayısı</small>
                    <h5 className="mb-0">{collection.salesCount}</h5>
                  </div>
                  <div className="stat-item">
                    <small className="text-muted">Oluşturulma Tarihi</small>
                    <p className="mb-0 small">
                      {formatDate(collection.createdOnValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* URL Section */}
          <div className="url-section mb-4">
            <label className="form-label fw-bold">Koleksiyon URL'si </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={
                  collection.isActive
                    ? collection.url
                    : "URL artık aktif değil."
                }
                readOnly
                style={{
                  cursor: collection.isActive ? "pointer" : "not-allowed",
                }}
                onClick={() =>
                  collection.isActive && copyToClipboard(collection.url)
                }
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() =>
                  collection.isActive && copyToClipboard(collection.url)
                }
                disabled={!collection.isActive}
                style={{
                  border: "1px solid #ced4da",
                  borderLeft: "none",
                  maxHeight: "40px",
                }}
              >
                {isCopied ? (
                  <i
                    className="bx bx-check text-success"
                    style={{ fontSize: "28px" }}
                  ></i>
                ) : (
                  <i className="bx bx-copy" style={{ fontSize: "16px" }}></i>
                )}
              </button>
            </div>
          </div>

          {/* Products Section */}
          {collection.productBasedAffiliateItems &&
            collection.productBasedAffiliateItems.length > 0 && (
              <div className="products-section mb-4">
                <h5 className="section-title mb-3">
                  <i className="bx bx-package me-2"></i>
                  Ürünler ({collection.productBasedAffiliateItems.length})
                </h5>
                <div className="row">
                  {collection.productBasedAffiliateItems.map((item) => (
                    <div key={item.id} className="col-lg-12 mb-3">
                      <div className="product-card card">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.product?.baseImageUrl ||
                                "/placeholder-image.jpg"
                              }
                              alt={item.product?.title}
                              className="product-image me-3 mr-5"
                              style={{
                                width: "100px",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="product-title mb-1  ">
                                {item.product?.title}
                              </h6>
                              <p className="product-price">
                                {item.product?.price?.toFixed(2)} ₺
                              </p>
                              <small className="text-muted">
                                <i className="bx bx-merge me-1"></i>
                                Kombinasyon Ürünü
                              </small>
                            </div>
                            <div className="d-flex gap-2">
                              <small className="text-muted">
                                Komisyon: %
                                {(item.commissionRate * 100).toFixed(1)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Categories Section */}
          {collection.categoryBasedAffiliateItems &&
            collection.categoryBasedAffiliateItems.length > 0 && (
              <div className="categories-section mb-4 ">
                <h5 className="section-title mb-3">
                  <i className="bx bx-category me-2"></i>
                  Kategoriler ({collection.categoryBasedAffiliateItems.length})
                </h5>
                <div className="row">
                  {collection.categoryBasedAffiliateItems.map((item) => (
                    <div key={item.id} className="col-lg-6 col-md-6 mb-3">
                      <div className="category-card card">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <div className="category-icon me-3">
                              <i className="bx bx-category-alt"></i>
                            </div>
                            <div>
                              <h6 className="category-name mb-1">
                                {item.mainCategory?.name ||
                                  item.subCategory?.name}
                              </h6>
                              <small className="text-muted">
                                {item.mainCategory
                                  ? "Ana Kategori"
                                  : "Alt Kategori"}
                              </small>
                              <br />
                              <small className="text-muted">
                                Komisyon: %
                                {(item.commissionRate * 100).toFixed(1)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Collection Based Items */}
          {collection.collectionBasedAffiliateItems &&
            collection.collectionBasedAffiliateItems.length > 0 && (
              <div className="collection-items-section mb-4">
                <h5 className="section-title mb-3">
                  <i className="bx bx-collection me-2"></i>
                  Koleksiyon Öğeleri (
                  {collection.collectionBasedAffiliateItems.length})
                </h5>
                <div className="row">
                  {collection.collectionBasedAffiliateItems.map((item) => (
                    <div key={item.id} className="col-lg-12 mb-3">
                      <div className="product-card card">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.product?.baseImageUrl ||
                                "/placeholder-image.jpg"
                              }
                              alt={item.product?.title}
                              className="product-image me-3 mr-5"
                              style={{
                                width: "100px",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="product-title mb-1  ">
                                {item.product?.title}
                              </h6>
                              <p className="product-price">
                                {item.product?.price?.toFixed(2)} ₺
                              </p>
                              <small className="text-muted">
                                <i className="bx bx-merge me-1"></i>
                                Kombinasyon Ürünü
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Combination Based Items */}
          {collection.combinationBasedAffiliateItems &&
            collection.combinationBasedAffiliateItems.length > 0 && (
              <div className="combination-items-section mb-4">
                <h5 className="section-title mb-3">
                  <i className="bx bx-merge me-2"></i>
                  Kombinasyon Öğeleri (
                  {collection.combinationBasedAffiliateItems.length})
                </h5>
                <div className="row">
                  {collection.combinationBasedAffiliateItems.map((item) => (
                    <div key={item.id} className="col-lg-12 mb-3">
                      <div className="product-card card">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.product?.baseImageUrl ||
                                "/placeholder-image.jpg"
                              }
                              alt={item.product?.title}
                              className="product-image me-3 mr-5"
                              style={{
                                width: "100px",
                                height: "auto",
                                objectFit: "cover",
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="product-title mb-1  ">
                                {item.product?.title}
                              </h6>
                              <p className="product-price">
                                {item.product?.price?.toFixed(2)} ₺
                              </p>
                              <small className="text-muted">
                                <i className="bx bx-merge me-1"></i>
                                Kombinasyon Ürünü
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Commission Details */}
          {collection.affiliateCommissions &&
            collection.affiliateCommissions.length > 0 && (
              <div className="commissions-section">
                <h5 className="section-title mb-3">
                  <i className="bx bx-money me-2"></i>
                  Komisyon Geçmişi ({collection.affiliateCommissions.length})
                </h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Miktar</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collection.affiliateCommissions.map(
                        (commission, index) => (
                          <tr key={index}>
                            <td>
                              {formatDate(commission.createdOnValue || "")}
                            </td>
                            <td>{commission.amount?.toFixed(2)} ₺</td>
                            <td>
                              <span className="badge bg-success">
                                Onaylandı
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* Empty State */}
          {(!collection.productBasedAffiliateItems ||
            collection.productBasedAffiliateItems.length === 0) &&
            (!collection.categoryBasedAffiliateItems ||
              collection.categoryBasedAffiliateItems.length === 0) &&
            (!collection.collectionBasedAffiliateItems ||
              collection.collectionBasedAffiliateItems.length === 0) &&
            (!collection.combinationBasedAffiliateItems ||
              collection.combinationBasedAffiliateItems.length === 0) && (
              <div className="text-center py-5">
                <i
                  className="bx bx-package"
                  style={{ fontSize: "4rem", color: "#ccc" }}
                ></i>
                <h5 className="mt-3 text-muted">
                  Bu koleksiyonda öğe bulunmuyor
                </h5>
                <p className="text-muted">
                  Koleksiyonu düzenleyerek öğe ekleyebilirsiniz.
                </p>
              </div>
            )}
        </div>
      ) : (
        <div className="text-center py-5">
          <i
            className="bx bx-error"
            style={{ fontSize: "4rem", color: "#dc3545" }}
          ></i>
          <h5 className="mt-3 text-danger">Koleksiyon bulunamadı</h5>
          <p className="text-muted">
            Bu koleksiyon mevcut değil veya erişim izniniz yok.
          </p>
        </div>
      )}

      <style jsx>{`
        .collection-detail {
          max-height: 70vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding-left: 10px;
          padding-right: 10px;
        }

        .collection-title {
          color: #2c3e50;
          font-weight: 600;
        }

        .collection-description {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .stats-card {
          border: 1px solid #e9ecef;
        }

        .section-title {
          color: #495057;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 0.5rem;
        }

        .product-card,
        .category-card {
          transition: all 0.2s ease;
          border: 1px solid #e9ecef;
        }

        .product-card:hover,
        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
        }

        .product-title {
          color: #2c3e50;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .product-price {
          color: #28a745;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .category-icon {
          width: 20px;
          height: 20px;
          margin-top: -56px;
          margin-right: 5px;
          background: linear-gradient(135deg, #040404, #040404);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }

        .category-name {
          color: #2c3e50;
          font-weight: 500;
        }

        .url-section .input-group .form-control {
          background-color: #f8f9fa;
          font-family: "Courier New", monospace;
        }

        .collection-detail::-webkit-scrollbar {
          width: 6px;
        }

        .collection-detail::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .collection-detail::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .collection-detail::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        @media (max-width: 768px) {
          .collection-detail {
            max-height: 60vh;
          }

          .product-image {
            width: 50px;
            height: 50px;
          }

          .stats-card {
            margin-top: 1rem;
          }
        }
      `}</style>
    </GeneralModal>
  );
};

export default CollectionDetailModal;
