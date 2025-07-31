import { useState, useMemo } from "react";
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

  const {
    collections,
    isLoading: collectionsLoading,
    pagination,
    refetchCollections,
  } = useGetAffiliateCollections({ noPagination: true });

  const { deleteCollection, isPending: deleteCollectionPending } =
    useDeleteCollection();

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
        <div className="card">
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

              {/* Collection Count Info */}
              <div className="collection-info">
                {/* Collection Type Filter */}
                <div className="filter-section">
                  <select
                    className="form-select form-select-sm bg-transparent text-dark border-0"
                    value={selectedCollectionType || ""}
                    onChange={(e) =>
                      setSelectedCollectionType(
                        e.target.value
                          ? (Number(e.target.value) as AffiliateCollectionType)
                          : null
                      )
                    }
                    style={{
                      minWidth: "100px",
                      marginRight: "10px",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <option value="">Tüm Koleksiyonlar</option>
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
                <small className="text-muted" style={{ marginLeft: "10px" }}>
                  {selectedCollectionType
                    ? `${filteredCollections.length} koleksiyon`
                    : `Toplam ${collections?.length || 0} koleksiyon`}
                </small>
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
                  <div key={collection.id} className="col-lg-6 col-xl-6 mb-4">
                    <div
                      className={"collection-card card h-100  "}
                      style={{
                        cursor: "pointer",
                        opacity: collection.isActive ? 1 : 0.7,
                      }}
                      onClick={() => handleViewCollection(collection.id)}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="collection-header flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <div className="collection-icon me-3">
                                <i className="bx bx-collection"></i>
                              </div>
                              <h5
                                className="card-title mb-0 fw-bold ml-4 font-weight-bold"
                                style={{ fontSize: "1.5rem" }}
                              >
                                {collection.name}
                              </h5>
                            </div>
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn-light dropdown-toggle border-0 bg-transparent border-none shadow-none"
                              type="button"
                              data-bs-toggle="dropdown"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCollection(collection);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  <i className="bx bx-edit me-2 text-primary"></i>
                                  Düzenle
                                </a>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <a
                                  className="dropdown-item text-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(collection.id);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  <i className="bx bx-trash me-2"></i>
                                  Sil
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <p
                          className="collection-description text-muted text-dark font-weight-normal"
                          style={{ fontSize: "1.2rem" }}
                        >
                          {collection.description}
                        </p>
                      </div>
                      <div className="d-flex flex-wrap align-items-center gap-2 m-3">
                        <span
                          className="badge text-dark"
                          style={{ fontSize: "1.2rem" }}
                        >
                          <i
                            className="bx bx-package me-1"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                          {getCollectionTypeText(getCollectionType(collection))}
                        </span>
                        <span
                          className="badge text-dark"
                          style={{ fontSize: "1.2rem" }}
                        >
                          {getItemCount(collection)}
                        </span>
                      </div>

                      {/* Date Information */}
                      <div className="px-3 pb-3 ml-2">
                        <small className="text-muted d-block">
                          <i className="bx bx-calendar me-1"></i>
                          {new Date(collection.startDate).toLocaleDateString(
                            "tr-TR"
                          )}{" "}
                          -{" "}
                          {new Date(
                            collection.expirationDate
                          ).toLocaleDateString("tr-TR")}
                        </small>
                        {collection.totalEarnedCommission > 0 && (
                          <small className="text-success d-block mt-1">
                            <i className="bx bx-money me-1"></i>
                            Kazanılan:{" "}
                            {collection.totalEarnedCommission.toFixed(2)}₺
                          </small>
                        )}
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
          .card {
            border-radius: 0.75rem;
            border: 1px solid #eee;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          }

          .collection-card {
            transition: all 0.3s ease;
            border: 1px solid #e8e8e8;
            position: relative;
            overflow: hidden;
          }

          .collection-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
            border-color: #d0d0d0;
          }

          .collection-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #040404, #333);
          }

          .collection-icon {
            width: 40px;
            height: 40px;
            background: rgb(129, 157, 171);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .collection-icon i {
            color: white;
            font-size: 1.2rem;
          }

          .collection-header h5 {
            color: #2c3e50;
            font-size: 1.1rem;
            line-height: 1.3;
          }

          .collection-description {
            font-size: 0.9rem;
            line-height: 1.5;
            color: #6c757d;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 2.7rem;
          }

          .dropdown-toggle {
            opacity: 0.7;
            transition: opacity 0.2s ease;
          }

          .collection-card:hover .dropdown-toggle {
            opacity: 1;
          }

          .dropdown-menu {
            border: none;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            padding: 0.5rem 0;
          }

          .dropdown-item {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }

          .dropdown-item:hover {
            background: #f8f9fa;
            transform: translateX(2px);
          }

          .dropdown-divider {
            margin: 0.25rem 0;
          }

          .inactive-collection {
            background-color: #f8f9fa !important;
            border-color: #e9ecef !important;
          }

          .inactive-collection:hover {
            transform: none !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
            border-color: #e9ecef !important;
          }

          .inactive-collection .collection-header h5 {
            color: #6c757d !important;
          }

          .inactive-collection .collection-description {
            color: #adb5bd !important;
          }
        `}</style>
      </div>
    </AffiliateGuard>
  );
}
