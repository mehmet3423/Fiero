import { useState, useMemo, useEffect } from "react";
import { AffiliateCollection } from "@/constants/models/Affiliate";
import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateApplicationStatus";
import { useGetAffiliateCollections } from "@/hooks/services/affiliate/useGetAffiliateCollections";
import { useDeleteCollection } from "@/hooks/services/affiliate/useDeleteCollection";
import CreateCollectionModal from "@/components/affiliate/CreateCollectionModal";
import UpdateCollectionModal from "@/components/affiliate/UpdateCollectionModal";
import CollectionDetailModal from "@/components/affiliate/CollectionDetailModal";
import GeneralModal from "@/components/shared/GeneralModal";
import AffiliateGuard from "@/guards/AffiliateGuard";
import toast from "react-hot-toast";

interface AffiliateCollectionsPageProps {
  affiliateUserId: string;
}

export default function AffiliateCollectionsPage({
  affiliateUserId,
}: AffiliateCollectionsPageProps) {
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] =
    useState(false);
  const [isUpdateCollectionModalOpen, setIsUpdateCollectionModalOpen] =
    useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<AffiliateCollection | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [deletingCollectionId, setDeletingCollectionId] = useState<
    string | null
  >(null);
  const [selectedCollectionType, setSelectedCollectionType] =
    useState<AffiliateCollectionType | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const {
    collections,
    isLoading: collectionsLoading,
    pagination,
    refetchCollections,
  } = useGetAffiliateCollections({ noPagination: true });

  const { deleteCollection, isPending: deleteCollectionPending } =
    useDeleteCollection();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  // Utility Functions
  const getCollectionTypeText = (type: AffiliateCollectionType): string => {
    const typeTexts = {
      [AffiliateCollectionType.Product]: "Ürün Bazlı",
      [AffiliateCollectionType.Collection]: "Koleksiyon Bazlı",
      [AffiliateCollectionType.Combination]: "Kombinasyon Bazlı",
      [AffiliateCollectionType.Category]: "Kategori Bazlı",
    };
    return typeTexts[type] || "Bilinmeyen";
  };

  const getCollectionType = (
    collection: AffiliateCollection
  ): AffiliateCollectionType => {
    // Use earningType field from backend for more reliable type detection
    switch (collection.earningType) {
      case 1:
        return AffiliateCollectionType.Product;
      case 2:
        return AffiliateCollectionType.Combination;
      case 3:
        return AffiliateCollectionType.Category;
      case 4:
        return AffiliateCollectionType.Collection;
      default:
        // Fallback to old logic if earningType is not available
        if (collection.productBasedAffiliateItems?.length > 0) {
          return AffiliateCollectionType.Product;
        } else if (collection.categoryBasedAffiliateItems?.length > 0) {
          return AffiliateCollectionType.Category;
        } else if (collection.combinationBasedAffiliateItems?.length > 0) {
          return AffiliateCollectionType.Combination;
        } else if (collection.collectionBasedAffiliateItems?.length > 0) {
          return AffiliateCollectionType.Collection;
        }
        return AffiliateCollectionType.Product;
    }
  };

  // Filtered Collections
  const filteredCollections = useMemo(() => {
    if (!collections) return [];

    if (selectedCollectionType === null) {
      return collections;
    }

    return collections.filter((collection) => {
      const collectionType = getCollectionType(collection);
      return collectionType === selectedCollectionType;
    });
  }, [collections, selectedCollectionType]);

  const handleEditCollection = (collection: AffiliateCollection) => {
    setSelectedCollection(collection);
    setIsUpdateCollectionModalOpen(true);
  };

  const handleViewCollection = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (collectionId: string) => {
    setDeletingCollectionId(collectionId);
    $("#deleteCollectionModal").modal("show");
  };

  const handleConfirmDelete = async () => {
    if (deletingCollectionId) {
      await deleteCollection(deletingCollectionId);
      $("#deleteCollectionModal").modal("hide");
      setDeletingCollectionId(null);
      refetchCollections();
    }
  };

  const getItemCount = (collection: AffiliateCollection): string => {
    const collectionType = getCollectionType(collection);
    switch (collectionType) {
      case AffiliateCollectionType.Product:
        return `${collection.productBasedAffiliateItems?.length || 0} Öğe`;
      case AffiliateCollectionType.Category:
        return `${collection.categoryBasedAffiliateItems?.length || 0} Öğe`;
      case AffiliateCollectionType.Combination:
        return `${collection.combinationBasedAffiliateItems?.length || 0} Öğe`;
      case AffiliateCollectionType.Collection:
        return `${collection.collectionBasedAffiliateItems?.length || 0} Öğe`;
      default:
        return "0 Öğe";
    }
  };

  return (
    <AffiliateGuard>
      <div className="affiliate-collections-content">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => setIsCreateCollectionModalOpen(true)}
                >
                  <i className="bx bx-plus me-2"></i>
                  Yeni Koleksiyon
                </button>
              </div>

              {/* Collection Filter and Count */}
              <div className="d-flex align-items-center gap-3">
                {/* Collection Type Filter */}
                <div className="filter-section">
                  <select
                    className="form-select form-select-sm border rounded-pill px-3 shadow-none"
                    value={selectedCollectionType || ""}
                    onChange={(e) =>
                      setSelectedCollectionType(
                        e.target.value
                          ? (Number(e.target.value) as AffiliateCollectionType)
                          : null
                      )
                    }
                    style={{ minWidth: "180px" }}
                  >
                    <option value="">
                      <i className="bx bx-filter-alt me-1"></i>Tüm Koleksiyonlar
                    </option>
                    <option value={AffiliateCollectionType.Product}>
                      Ürün Bazlı
                    </option>
                    <option value={AffiliateCollectionType.Category}>
                      Kategori Bazlı
                    </option>
                    <option value={AffiliateCollectionType.Combination}>
                      Kombinasyon Bazlı
                    </option>
                    <option value={AffiliateCollectionType.Collection}>
                      Koleksiyon Bazlı
                    </option>
                  </select>
                </div>
                
                {/* Collection Count Badge */}
                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                  <i className="bx bx-list-ul me-1"></i>
                  {selectedCollectionType
                    ? `${filteredCollections.length} koleksiyon`
                    : `${collections?.length || 0} koleksiyon`}
                </span>
              </div>
            </div>

            {collectionsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Yükleniyor...</span>
                </div>
              </div>
            ) : collections && collections.length > 0 ? (
              <div className="row">
                {filteredCollections.map((collection) => (
                  <div key={collection.id} className="col-lg-4 col-md-6 col-sm-12 mb-3">
                    <div
                      className={`card h-100 shadow-sm border position-relative overflow-hidden ${!collection.isActive ? 'bg-white' : 'bg-white'}`}
                      style={{
                        cursor: "pointer",
                        opacity: collection.isActive ? 1 : 0.7,
                        transition: "all 0.3s ease",
                        borderRadius: "0.75rem",
                        borderTop: "4px solid #040404",
                        border: "1px solid #e8e8e8"
                      }}
                      onClick={() => handleViewCollection(collection.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                              <div>
                                <h6
                                  className="card-title mb-0 fw-bold text-dark"
                                  style={{ fontSize: "1rem", lineHeight: "1.2" }}
                                >
                                  {collection.name}
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="dropdown position-relative">
                            <button
                              className="btn btn-sm border-0 bg-light"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === collection.id ? null : collection.id);
                              }}
                              style={{ 
                                fontSize: "1rem",
                                padding: "2px 6px",
                                color: "#666",
                                borderRadius: "4px"
                              }}
                            >
                              ⋮
                            </button>
                            {openDropdownId === collection.id && (
                              <div 
                                className="position-absolute bg-white border rounded shadow-sm"
                                style={{ 
                                  top: "100%",
                                  right: "0",
                                  zIndex: 1000,
                                  minWidth: "80px",
                                  fontSize: "0.75rem",
                                  marginTop: "2px"
                                }}
                              >
                                <div
                                  className="py-1 px-2 border-bottom"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(null);
                                    handleEditCollection(collection);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    borderBottom: "1px solid #eee"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                                >
                                  Düzenle
                                </div>
                                <div
                                  className="py-1 px-2 text-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(null);
                                    handleDeleteClick(collection.id);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "0.75rem"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                                >
                                  Sil
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <p
                          className="text-muted mb-2"
                          style={{ 
                            fontSize: "0.8rem",
                            lineHeight: "1.3",
                            color: "#6c757d",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "1.8rem"
                          }}
                        >
                          {collection.description}
                        </p>
                      </div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mx-2 mb-2">
                        <span
                          className="badge bg-light text-dark border"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <i
                            className="bx bx-package me-1"
                            style={{ fontSize: "0.7rem" }}
                          ></i>
                          {getItemCount(collection)}
                        </span>
                        {collection.totalEarnedCommission > 0 && (
                          <span className="badge bg-success text-white" style={{ fontSize: "0.7rem" }}>
                            <i className="bx bx-money me-1"></i>
                            {collection.totalEarnedCommission.toFixed(2)}₺
                          </span>
                        )}
                      </div>

                      {/* Date Information */}
                      <div className="border-top pt-1 px-2 pb-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted" style={{ fontSize: "0.65rem" }}>
                            <i className="bx bx-calendar me-1"></i>
                            {new Date(collection.startDate).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit' })} - {new Date(collection.expirationDate).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit' })}
                          </small>
                          <span 
                            className="badge" 
                            style={{ 
                              fontSize: "0.65rem",
                              backgroundColor: getCollectionType(collection) === 1 ? "#e8f0fe" : 
                                             getCollectionType(collection) === 2 ? "#f0f4ff" : 
                                             getCollectionType(collection) === 3 ? "#f5f5f5" : "#faf7ff",
                              color: getCollectionType(collection) === 1 ? "#1565c0" : 
                                     getCollectionType(collection) === 2 ? "#3949ab" : 
                                     getCollectionType(collection) === 3 ? "#5f6368" : "#7c4dff",
                              border: "1px solid #e9ecef"
                            }}
                          >
                            {getCollectionTypeText(getCollectionType(collection))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="empty-state">
                  <i
                    className="bx bx-collection"
                    style={{ fontSize: "4rem", color: "#ccc" }}
                  ></i>
                  {selectedCollectionType ? (
                    <>
                      <h5 className="mt-3 text-muted">
                        {getCollectionTypeText(selectedCollectionType)}{" "}
                        koleksiyon bulunamadı
                      </h5>
                      <p className="text-muted">
                        Bu türde koleksiyon bulunmuyor. Farklı bir tür seçin
                        veya yeni koleksiyon oluşturun.
                      </p>
                      <button
                        className="btn btn-outline-dark me-2"
                        onClick={() => setSelectedCollectionType(null)}
                      >
                        Tüm Koleksiyonları Göster
                      </button>
                    </>
                  ) : (
                    <>
                      <h5 className="mt-3 text-muted">
                        Henüz koleksiyon oluşturmadınız
                      </h5>
                      <p className="text-muted">
                        İlk koleksiyonunuzu oluşturmak için Yeni Koleksiyon
                        butonuna tıklayın.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateCollectionModal
          isOpen={isCreateCollectionModalOpen}
          onClose={() => setIsCreateCollectionModalOpen(false)}
          onSuccess={() => {
            refetchCollections();
          }}
          affiliateUserId={affiliateUserId}
        />

        <UpdateCollectionModal
          isOpen={isUpdateCollectionModalOpen}
          onClose={() => {
            setIsUpdateCollectionModalOpen(false);
            setSelectedCollection(null);
          }}
          onSuccess={() => {
            refetchCollections();
          }}
          collection={selectedCollection}
        />

        <CollectionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCollectionId(null);
          }}
          collectionId={selectedCollectionId}
        />

        {/* Delete Confirmation Modal */}
        <GeneralModal
          id="deleteCollectionModal"
          title="Koleksiyon Sil"
          size="sm"
          onClose={() => setDeletingCollectionId(null)}
          onApprove={handleConfirmDelete}
          approveButtonText="Evet, Sil"
          approveButtonClassName="btn-danger"
          isLoading={deleteCollectionPending}
          showFooter={true}
        >
          <div className="text-center">
            <i
              className="bx bx-error-circle mb-2"
              style={{ fontSize: "3rem", color: "#dc3545" }}
            ></i>
            <h4 className="mt-3">Emin misiniz?</h4>
            <p className="text-muted">
              Bu koleksiyonu silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </p>
          </div>
        </GeneralModal>

        <style jsx>{`
          .affiliate-collections-content {
            padding: 1.5rem 0;
          }

          /* Card hover effects */
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
          }

          /* Collection card specific hover */
          .col-lg-4 .card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12) !important;
          }

          /* Empty state */
          .empty-state {
            padding: 3rem 2rem;
          }

          /* Button hover effects */
          .btn:hover {
            transform: translateY(-1px);
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .affiliate-collections-content {
              padding: 0.75rem 0;
            }

            .col-lg-4 {
              margin-bottom: 1rem;
            }

            .empty-state {
              padding: 2rem 1rem;
            }
          }
        `}</style>
      </div>
    </AffiliateGuard>
  );
}
