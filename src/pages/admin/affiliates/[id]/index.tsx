import GeneralModal from "@/components/shared/GeneralModal";
import BackButton from "@/components/shared/BackButton";
import { AffiliateCollectionType } from "@/constants/enums/affiliate/AffiliateCollectionType";
import { AffiliateStatus } from "@/constants/enums/AffiliateStatus";
import { AffiliateCollection } from "@/constants/models/affiliate/Collection";
import { useGetAffiliateUserByAffiliateUserId } from "@/hooks/services/admin-affiliate/useGetAffiliateUserByAffiliateUserId";
import { useGetCollectionsByAffiliateUserId } from "@/hooks/services/admin-affiliate/useGetCollectionsByAffiliateUserId";
import {
  useUpdateCategoryBasedCollection,
  useUpdateCollectionBasedCollection,
  useUpdateCombinationBasedCollection,
  useUpdateProductBasedCollection,
} from "@/hooks/services/admin-affiliate/useUpdateAffiliateCollection";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants/enums/QueryKeys";

function AffiliateUserDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"collections" | "commissions">(
    "collections"
  );
  const [selectedCollectionType, setSelectedCollectionType] =
    useState<AffiliateCollectionType | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCollection, setEditCollection] =
    useState<AffiliateCollection | null>(null);
  const [editForm, setEditForm] = useState({
    isActive: true,
    collectionCommissionRate: 0,
    startDate: null as string | null,
    expirationDate: null as string | null,
    salesCountLimit: 0,
    totalSalesAmountLimit: 0,
  });

  const {
    affiliateUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetAffiliateUserByAffiliateUserId(id as string);
  const {
    affiliateCollections,
    isLoading: isCollectionsLoading,
    error: collectionsError,
  } = useGetCollectionsByAffiliateUserId(id as string, selectedCollectionType);
  // Update hooks
  const { updateProductBasedCollection, isPending: isProductPending } =
    useUpdateProductBasedCollection();
  const { updateCollectionBasedCollection, isPending: isCollectionPending } =
    useUpdateCollectionBasedCollection();
  const { updateCombinationBasedCollection, isPending: isCombinationPending } =
    useUpdateCombinationBasedCollection();
  const { updateCategoryBasedCollection, isPending: isCategoryPending } =
    useUpdateCategoryBasedCollection();

  // ID değiştiğinde state'leri sıfırla ve cache'i temizle
  useEffect(() => {
    // Cache'i temizle - yeni kullanıcı verileri yüklensin
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.AFFILIATE_USER_BY_ID],
    });
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.AFFILIATE_COLLECTION_BY_AFFILIATE_USER_ID],
    });

    // State'leri sıfırla
    setActiveTab("collections");
    setSelectedCollectionType(null);
    setEditModalOpen(false);
    setEditCollection(null);
    setEditForm({
      isActive: true,
      collectionCommissionRate: 0,
      startDate: null,
      expirationDate: null,
      salesCountLimit: 0,
      totalSalesAmountLimit: 0,
    });
  }, [id, queryClient]);

  const handleEditClick = (collection: AffiliateCollection) => {
    setEditCollection(collection);
    let commissionRate = 0;

    if (collection.productBasedAffiliateItems?.length > 0) {
      commissionRate =
        collection.productBasedAffiliateItems[0]?.commissionRate ?? 0;
    } else if (collection.collectionBasedAffiliateItems?.length > 0) {
      commissionRate = collection.collectionCommissionRate ?? 0;
    } else if (collection.combinationBasedAffiliateItems?.length > 0) {
      commissionRate = collection.collectionCommissionRate ?? 0;
    } else if (collection.categoryBasedAffiliateItems?.length > 0) {
      commissionRate =
        collection.categoryBasedAffiliateItems[0]?.commissionRate ?? 0;
    }

    setEditForm({
      isActive: collection.isActive,
      collectionCommissionRate: commissionRate,
      startDate: collection.startDate,
      expirationDate: collection.expirationDate,
      salesCountLimit: collection.salesCountLimit ?? 0,
      totalSalesAmountLimit: collection.totalSalesAmountLimit ?? 0,
    });
    $("#editCollectionModal").modal("show");
    setEditModalOpen(true);
  };

  const handleUpdateCollection = async () => {
    try {
      if (!editCollection) return;

      if (editForm.salesCountLimit < 1) {
        toast.error("Satış adedi limiti 1'den küçük olamaz");
        return;
      }

      if (editForm.totalSalesAmountLimit < 1) {
        toast.error("Toplam satış tutarı limiti 1'den küçük olamaz");
        return;
      }

      const basePayload = {
        id: editCollection.id,
        name: editCollection.name,
        description: editCollection.description,
        startDate: editForm.startDate || "",
        expirationDate: editForm.expirationDate || "",
        salesCountLimit: editForm.salesCountLimit,
        totalSalesAmountLimit: editForm.totalSalesAmountLimit,
        isActive: editForm.isActive,
      };

      if (editCollection.productBasedAffiliateItems?.length > 0) {
        await updateProductBasedCollection({
          ...basePayload,
          updateCollectionItems: editCollection.productBasedAffiliateItems.map(
            (item) => ({
              id: item.id,
              affiliateCollectionId: item.affiliateCollectionId,
              productId: item.productId,
              commissionRate: item.commissionRate,
            })
          ),
        });
      } else if (editCollection.collectionBasedAffiliateItems?.length > 0) {
        await updateCollectionBasedCollection({
          ...basePayload,
          collectionCommissionRate: editForm.collectionCommissionRate,
          collectionItems: editCollection.collectionBasedAffiliateItems.map(
            (item) => ({
              id: item.id,
              affiliateCollectionId: item.affiliateCollectionId,
              productId: item.productId,
            })
          ),
        });
      } else if (editCollection.combinationBasedAffiliateItems?.length > 0) {
        await updateCombinationBasedCollection({
          ...basePayload,
          collectionCommissionRate: editForm.collectionCommissionRate,
          collectionItems: editCollection.combinationBasedAffiliateItems.map(
            (item) => ({
              id: item.id,
              affiliateCollectionId: item.affiliateCollectionId,
              productId: item.productId,
            })
          ),
        });
      } else if (editCollection.categoryBasedAffiliateItems?.length > 0) {
        await updateCategoryBasedCollection({
          ...basePayload,
          collectionItems: editCollection.categoryBasedAffiliateItems.map(
            (item) => ({
              id: item.id,
              affiliateCollectionId: item.affiliateCollectionId,
              mainCategoryId: item.mainCategoryId!,
              subCategoryId: item.subCategoryId!,
              commissionRate: item.commissionRate,
            })
          ),
        });
      }

      setEditModalOpen(false);
      $("#editCollectionModal").modal("hide");
      setEditForm({
        isActive: true,
        collectionCommissionRate: 0,
        startDate: null as string | null,
        expirationDate: null as string | null,
        salesCountLimit: 0,
        totalSalesAmountLimit: 0,
      });
    } catch (e) {
    }
  };

  const handleItemCommissionChange = (
    itemId: string,
    value: number,
    type: AffiliateCollectionType
  ) => {
    if (!editCollection) return;

    if (type === AffiliateCollectionType.ProductBased) {
      const updatedItems = editCollection.productBasedAffiliateItems.map(
        (item) =>
          item.id === itemId ? { ...item, commissionRate: value } : item
      );
      setEditCollection({
        ...editCollection,
        productBasedAffiliateItems: updatedItems,
      });
    } else if (type === AffiliateCollectionType.CategoryBased) {
      const updatedItems = editCollection.categoryBasedAffiliateItems.map(
        (item) =>
          item.id === itemId ? { ...item, commissionRate: value } : item
      );
      setEditCollection({
        ...editCollection,
        categoryBasedAffiliateItems: updatedItems,
      });
    }
  };

  if (isUserLoading || isUserLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (collectionsError || userError || !affiliateUser) {
    return (
      <div>
        Bir hata oluştu: {collectionsError?.message || userError?.message}
      </div>
    );
  }

  return (
    <div className="page-content py-4">
      {/* Geri Tuşu */}
      <div className="mb-3">
        <BackButton href="/admin/affiliates" />
      </div>

      {/* User Info Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="p-4">
          <div className="row">
            <div className="col-md-8">
              <h4 className="mb-3">{affiliateUser?.applicationUser?.name}</h4>
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-envelope me-2 text-muted"></i>
                <span className="text-muted">
                  {affiliateUser.applicationUser.email}
                </span>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <span
                className={`badge ${affiliateUser.status === AffiliateStatus.Approved
                    ? "bg-success"
                    : "bg-warning"
                  }`}
              >
                {affiliateUser.status === AffiliateStatus.Approved
                  ? "Onaylandı"
                  : "Onaylanmadı"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "collections" ? "active" : ""
              }`}
            onClick={() => setActiveTab("collections")}
          >
            <i className="fas fa-box"></i>
            Koleksiyonlar
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "commissions" ? "active" : ""
              }`}
            onClick={() => setActiveTab("commissions")}
          >
            <i className="fas fa-money-bill me-2"></i>
            Komisyonlar
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div style={{ fontSize: "0.813rem" }}>
        {activeTab === "collections" && (
          <div className="card border-0 shadow-sm">
            <div className="p-4">
              <div className="row mb-4">
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedCollectionType || ""}
                    onChange={(e) =>
                      setSelectedCollectionType(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    style={{ fontSize: "0.813rem" }}
                  >
                    <option value="">Tüm Koleksiyonlar</option>
                    <option value={AffiliateCollectionType.ProductBased}>
                      Ürün Bazlı
                    </option>
                    <option value={AffiliateCollectionType.CombinationBased}>
                      Kombinasyon Bazlı
                    </option>
                    <option value={AffiliateCollectionType.CategoryBased}>
                      Kategori Bazlı
                    </option>
                    <option value={AffiliateCollectionType.CollectionBased}>
                      Koleksiyon Bazlı
                    </option>
                  </select>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Koleksiyon Adı</th>
                      <th>Açıklama</th>
                      <th>Oluşturulma Tarihi</th>
                      <th>URL</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliateCollections?.map((collection) => (
                      <tr key={collection.id}>
                        <td>{collection.name}</td>
                        <td>{collection.description}</td>
                        <td>
                          {new Date(
                            collection.createdOnValue
                          ).toLocaleDateString("tr-TR")}
                        </td>
                        <td>{collection.url}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEditClick(collection)}
                          >
                            Düzenle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "commissions" && (
          <div
            className="card border-0 shadow-sm"
            style={{ fontSize: "0.813rem" }}
          >
            <div className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Koleksiyon</th>
                      <th>Tutar</th>
                      <th>Tarih</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliateUser.affiliateCommissions.map((commission) => (
                      <tr key={commission.id}>
                        <td>{commission.collectionName}</td>
                        <td>{commission.amount.toFixed(2)} ₺</td>
                        <td>
                          {new Date(commission.createdAt).toLocaleDateString(
                            "tr-TR"
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${commission.status === "PAID"
                                ? "bg-success"
                                : "bg-warning"
                              }`}
                          >
                            {commission.status === "PAID"
                              ? "Ödendi"
                              : "Beklemede"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        <GeneralModal
          id="editCollectionModal"
          title="Koleksiyonu Düzenle"
          size="lg"
          onClose={() => setEditModalOpen(false)}
          approveButtonText="Kaydet"
          onApprove={handleUpdateCollection}
          showFooter
        >
          {editCollection && (
            <>
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body p-4" style={{ fontSize: "1rem" }}>
                  <h6 className="card-title mb-4 text-primary fw-semibold">
                    Koleksiyon Bilgileri
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-tag me-2 text-muted"></i>
                        <div>
                          <small className="text-muted d-block">
                            Koleksiyon Adı
                          </small>
                          <span className="small">{editCollection.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-link me-2 text-muted"></i>
                        <div className="w-100">
                          <small className="text-muted d-block">URL</small>
                          <div
                            className="d-flex align-items-center justify-content-between bg-light rounded p-2 cursor-pointer hover-effect"
                            onClick={() => {
                              navigator.clipboard.writeText(editCollection.url);
                              toast.success("URL kopyalandı");
                            }}
                            style={{
                              cursor: "pointer",
                              border: "2px solid #e9ecef",
                            }}
                          >
                            <span className="small text-truncate me-2">
                              {editCollection.url}
                            </span>
                            <i className="fas fa-copy text-primary"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {editCollection.earningType !==
                  AffiliateCollectionType.ProductBased &&
                  editCollection.earningType !==
                  AffiliateCollectionType.CategoryBased && (
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Komisyon Oranı</label>
                        <input
                          type="number"
                          className="form-control"
                          min={0}
                          max={1}
                          step={0.01}
                          value={editForm.collectionCommissionRate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditForm((f) => ({
                              ...f,
                              collectionCommissionRate: Number(e.target.value),
                            }))
                          }
                        />
                        <small className="form-text text-muted">
                          0 ile 1 arasında bir değer girin (örn: 0.1, 0.2, 0.5)
                        </small>
                      </div>
                    </div>
                  )}

                <div
                  className={`${editCollection.earningType ===
                      AffiliateCollectionType.ProductBased ||
                      editCollection.earningType ===
                      AffiliateCollectionType.CategoryBased
                      ? "col-md-12"
                      : "col-md-6 "
                    }`}
                >
                  <div className="form-group mb-3">
                    <label className="form-label">Satış Adedi Limiti</label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      value={editForm.salesCountLimit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditForm((f) => ({
                          ...f,
                          salesCountLimit: Number(e.target.value),
                        }))
                      }
                    />
                    <small className="form-text text-muted">
                      Koleksiyon için maksimum satış adedi
                    </small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Toplam Satış Tutarı Limiti
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      value={editForm.totalSalesAmountLimit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditForm((f) => ({
                          ...f,
                          totalSalesAmountLimit: Number(e.target.value),
                        }))
                      }
                    />
                    <small className="form-text text-muted">
                      Koleksiyon için maksimum satış tutarı
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Başlangıç Tarihi</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="startDate"
                      value={editForm.startDate ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          startDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Bitiş Tarihi</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="expirationDate"
                      value={editForm.expirationDate ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          expirationDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Aktiflik</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActive"
                        checked={editForm.isActive}
                        onChange={() =>
                          setEditForm((f) => ({ ...f, isActive: !f.isActive }))
                        }
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        {editForm.isActive ? "Aktif" : "Pasif"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ürün/Kategori Listesi - Sadece ürün ve kategori bazlı koleksiyonlarda gösterilecek */}
              {editCollection &&
                (editCollection.productBasedAffiliateItems?.length > 0 ||
                  editCollection.categoryBasedAffiliateItems?.length > 0) && (
                  <div className="mt-4">
                    <h5 className="mb-3">
                      {editCollection.productBasedAffiliateItems?.length > 0
                        ? "Ürünler"
                        : "Kategoriler"}
                    </h5>
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <table className="table table-hover">
                        <thead className="sticky-top bg-white">
                          <tr>
                            {editCollection.productBasedAffiliateItems?.length >
                              0 ? (
                              <>
                                <th style={{ width: "80px" }}>Resim</th>
                                <th>Ürün Adı</th>
                                <th>Fiyat</th>
                                <th>Komisyon Oranı</th>
                              </>
                            ) : (
                              <>
                                <th>Kategori</th>
                                <th>Komisyon Oranı</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {editCollection.productBasedAffiliateItems?.map(
                            (item) => (
                              <tr key={item.id}>
                                <td>
                                  <img
                                    src={
                                      item.product.baseImageUrl ||
                                      "/images/no-image.png"
                                    }
                                    alt={item.product.title}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      objectFit: "cover",
                                    }}
                                    className="rounded"
                                  />
                                </td>
                                <td>{item.product.title}</td>
                                <td>{item.product.price} ₺</td>
                                <td>
                                  <div
                                    className="input-group"
                                    style={{ width: "150px" }}
                                  >
                                    <input
                                      type="number"
                                      className="form-control"
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={item.commissionRate ?? 0}
                                      onChange={(e) =>
                                        handleItemCommissionChange(
                                          item.id,
                                          Number(e.target.value),
                                          AffiliateCollectionType.ProductBased
                                        )
                                      }
                                    />
                                    <span className="input-group-text">%</span>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                          {editCollection.categoryBasedAffiliateItems?.map(
                            (item) => (
                              <tr key={item.id}>
                                <td>
                                  {item.mainCategory
                                    ? item.mainCategory.name
                                    : item.subCategory?.name ||
                                    "Kategori bulunamadı"}
                                </td>
                                <td>
                                  <div
                                    className="input-group"
                                    style={{ width: "150px" }}
                                  >
                                    <input
                                      type="number"
                                      className="form-control"
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={item.commissionRate ?? 0}
                                      onChange={(e) =>
                                        handleItemCommissionChange(
                                          item.id,
                                          Number(e.target.value),
                                          AffiliateCollectionType.CategoryBased
                                        )
                                      }
                                    />
                                    <span className="input-group-text">%</span>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </>
          )}
        </GeneralModal>
      </div>

      <style jsx>{`
        .hover-effect {
          transition: all 0.2s ease;
        }
        .hover-effect:hover {
          background-color: #e9ecef !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .hover-effect:active {
          transform: translateY(0);
        }
        .text-truncate {
          max-width: 300px;
        }
      `}</style>
    </div>
  );
}

export default AffiliateUserDetailPage;
