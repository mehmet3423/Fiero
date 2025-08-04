"use client";
import CirclePagination from "@/components/shared/CirclePagination";
import ConfirmModal from "@/components/shared/ConfirmModal";
import GeneralModal from "@/components/shared/GeneralModal";
import { SubCategory } from "@/constants/models/Category";
import { Product } from "@/constants/models/Product";
import { ProductSpecification } from "@/constants/models/ProductSpecification";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useDeleteProduct } from "@/hooks/services/products/useDeleteProduct";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useProductsByCategory } from "@/hooks/services/products/useProductsByCategory";
import { useAddProductSpecification } from "@/hooks/services/product-specifications/useAddProductSpecification";
import { useDeleteProductSpecification } from "@/hooks/services/product-specifications/useDeleteProductSpecification";
import { useGetProductSpecifications } from "@/hooks/services/product-specifications/useGetProductSpecifications";
import { useUpdateProductSpecification } from "@/hooks/services/product-specifications/useUpdateProductSpecification";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

function ProductsAdminPage() {
  const router = useRouter();
  const [selectedMainCategoryId, setSelectedMainCategoryId] =
    useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination için state'ler
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Sayfa başına gösterilen ürün sayısını 20'ye çıkardık

  // Ürün özellikleri için state'ler
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [localSpecifications, setLocalSpecifications] = useState<any[] | null>(
    null
  );

  // Add Specification Modal state
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Edit Specification Modal state
  const [editingSpec, setEditingSpec] = useState<ProductSpecification | null>(
    null
  );
  const [editSpecName, setEditSpecName] = useState("");
  const [editSpecValue, setEditSpecValue] = useState("");

  // Delete Specification Modal state
  const [deletingSpecificationId, setDeletingSpecificationId] = useState<
    string | null
  >(null);

  // Tüm ürünleri getiren hook'u çağırıyoruz
  const { data: allProducts, isLoading: allProductsLoading } =
    useGetAllProducts({
      page: currentPage - 1, // API 0 tabanlı, UI 1 tabanlı
      pageSize: itemsPerPage,
      searchTerm: searchTerm, // Arama terimini API'ye gönder
    });

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProductsByCategory(
    selectedSubCategoryId,
    {
      page: currentPage - 1,
      pageSize: itemsPerPage,
      searchTerm: searchTerm, // Arama terimini API'ye gönder
    }
  );

  // Ürün özellikleri hook'ları
  const {
    productSpecifications,
    isLoading: specificationsLoading,
    refetchProductSpecifications,
  } = useGetProductSpecifications(selectedProductId);

  const { addProductSpecification, isPending: addProductSpecificationLoading } =
    useAddProductSpecification();
  const {
    updateProductSpecification,
    isPending: updateProductSpecificationLoading,
  } = useUpdateProductSpecification();
  const {
    deleteProductSpecification,
    isPending: deleteProductSpecificationLoading,
  } = useDeleteProductSpecification();

  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  // Seçili main kategoriyi bul
  const selectedMainCategory = useMemo(() => {
    if (!categories?.items) return null;
    return categories.items.find((cat) => cat.id === selectedMainCategoryId);
  }, [categories, selectedMainCategoryId]);

  // Alt kategorileri bul
  const subCategories = useMemo(() => {
    if (!selectedMainCategory?.subCategories) return [];
    return selectedMainCategory.subCategories;
  }, [selectedMainCategory]);

  // Main kategori değiştiğinde sub kategori seçimini sıfırla
  useEffect(() => {
    setSelectedSubCategoryId("");
  }, [selectedMainCategoryId]);

  // Aramaya veya kategori filtrelerine göre pagination sıfırlanır
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMainCategoryId, selectedSubCategoryId, searchTerm]);

  // Ürün özellikleri değiştiğinde local state'i güncelle
  useEffect(() => {
    if (productSpecifications) {
      setLocalSpecifications(productSpecifications);
    }
  }, [productSpecifications]);

  const displaySpecifications = localSpecifications || productSpecifications;

  // Pagination için toplam sayfa sayısını hesaplama
  const totalPages = selectedSubCategoryId
    ? Math.ceil((products?.count || 0) / itemsPerPage)
    : Math.ceil((allProducts?.count || 0) / itemsPerPage);

  // Mevcut sayfada gösterilecek ürünler - API'den gelen ürünleri kullan
  const currentProducts =
    selectedSubCategoryId && products?.items
      ? products.items
      : allProducts?.items || [];

  // Sayfa değiştirme işlemi
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`);
  };

  const handleDelete = (productId: string) => {
    setDeletingProductId(productId);
    $("#deleteConfirmModal").modal("show");
  };

  const handleConfirmDelete = async () => {
    if (deletingProductId) {
      await deleteProduct(deletingProductId);
      $("#deleteConfirmModal").modal("hide");
      setDeletingProductId(null);
    }
  };

  // Ürün özellikleri fonksiyonları
  const handleProductSpecificationsClick = (productId: string) => {
    setSelectedProductId(productId);
    setLocalSpecifications(null);
    $("#productSpecificationsModal").modal("show");
  };

  const handleAddSpecification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !newSpecName || !newSpecValue) return;

    try {
      await addProductSpecification(
        selectedProductId,
        newSpecName,
        newSpecValue
      );
      $("#addSpecificationModal").modal("hide");
      setNewSpecName("");
      setNewSpecValue("");
      toast.success("Özellik başarıyla eklendi");
    } catch (error) {
      console.error("Error adding specification:", error);
      toast.error("Özellik eklenirken bir hata oluştu");
    }
  };

  const handleEditClick = (spec: ProductSpecification) => {
    setEditingSpec(spec);
    setEditSpecName(spec.name);
    setEditSpecValue(spec.value);
    $("#editSpecificationModal").modal("show");
  };

  const handleEditSpecification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpec || !editSpecName || !editSpecValue || !selectedProductId)
      return;

    try {
      await updateProductSpecification(
        editingSpec.id,
        editSpecName,
        editSpecValue,
        selectedProductId
      );
      $("#editSpecificationModal").modal("hide");
      setEditingSpec(null);
      setEditSpecName("");
      setEditSpecValue("");
      toast.success("Özellik başarıyla güncellendi");
    } catch (error) {
      console.error("Error updating specification:", error);
      toast.error("Özellik güncellenirken bir hata oluştu");
    }
  };

  const handleDeleteClick = (specId: string) => {
    setDeletingSpecificationId(specId);
    $("#deleteSpecificationModal").modal("show");
  };

  const handleDeleteSpecification = async () => {
    if (!deletingSpecificationId || !selectedProductId) return;

    try {
      // Check if this is the last specification for this product
      const isLastSpecification =
        displaySpecifications && displaySpecifications.length === 1;

      await deleteProductSpecification(
        deletingSpecificationId,
        selectedProductId
      );
      $("#deleteSpecificationModal").modal("hide");
      setDeletingSpecificationId(null);

      // If it was the last specification and the backend might return 400,
      // manually update the local state to show an empty list
      if (isLastSpecification) {
        setLocalSpecifications([]);

        // Try to refetch after a delay, but if it fails, we'll still have an empty array in the UI
        setTimeout(() => {
          refetchProductSpecifications().catch(() => {
            // If refetch fails, we already have an empty array in the UI
            console.log("Refetch failed, but UI is already updated");
          });
        }, 300);
      }

      toast.success("Özellik başarıyla silindi");
    } catch (error) {
      console.error("Error deleting specification:", error);
      toast.error("Özellik silinirken bir hata oluştu");
    }
  };

  // Yükleniyor durumu
  const isLoading = selectedSubCategoryId
    ? productsLoading
    : allProductsLoading;

  // Arama kısmını temizleme ve filtreleri sıfırlama
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedMainCategoryId("");
    setSelectedSubCategoryId("");
    setCurrentPage(1);
  };

  // Sayfa bilgisi gösterimi için toplam ürün sayısı
  const totalCount = selectedSubCategoryId
    ? products?.count || 0
    : allProducts?.count || 0;

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Header */}
        <div className="card bg-transparent border-0 mb-0">
          <div className="card-body mb-0 pb-3 ">
            <div className="d-flex pt-0 justify-content-between align-items-center ">
              <h6
                className="card-header"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#566a7f",
                  marginLeft: "-10px",
                  backgroundColor: "transparent",
                }}
              >
                Ürün Yönetimi
              </h6>
              <Link
                href="/admin/products/add-product"
                className="btn btn-primary btn-sm"
                style={{ fontSize: "0.75rem" }}
              >
                <i className="bx bx-plus me-1"></i>
                Yeni Ürün Ekle
              </Link>
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Ürün Ara
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ürün adı veya barkod..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ fontSize: "0.75rem" }}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Ana Kategori
                </label>
                <select
                  className="form-select form-select-sm"
                  value={selectedMainCategoryId}
                  onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                  disabled={categoriesLoading}
                  style={{ fontSize: "0.75rem" }}
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories?.items?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Alt Kategori
                </label>
                <select
                  className="form-select form-select-sm"
                  value={selectedSubCategoryId}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  disabled={!selectedMainCategoryId}
                  style={{ fontSize: "0.75rem" }}
                >
                  <option value="">Tüm Alt Kategoriler</option>
                  {subCategories.map((subCategory: SubCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
              {(searchTerm ||
                selectedMainCategoryId ||
                selectedSubCategoryId) && (
                <div className="col-md-2">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>
                    &nbsp;
                  </label>
                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    type="button"
                    onClick={handleClearFilters}
                    style={{ fontSize: "0.75rem", marginBottom: "10px" }}
                  >
                    <i className="bx bx-refresh me-1"></i>
                    Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ürün Listesi */}
        {isLoading ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="row g-3 mb-4">
            {currentProducts.map((product: Product) => (
              <div
                key={product.id}
                className="col-12 col-sm-6 col-md-4 col-xl-3"
              >
                <div className="card h-100">
                  <div
                    className="position-relative d-flex justify-content-center align-items-center"
                    style={{ height: "200px", padding: "10px" }}
                  >
                    {product.isOutlet && (
                      <div
                        className="position-absolute top-0 start-0 m-2"
                        style={{ zIndex: 1 }}
                      >
                        <span className="badge bg-label-primary">Outlet</span>
                      </div>
                    )}
                    <Link href={`/products/${product.id}`}>
                      <Image
                        width={180}
                        height={180}
                        src={
                          product.baseImageUrl || "/assets/images/no-image.jpg"
                        }
                        alt={product.title}
                        style={{
                          maxHeight: "180px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          borderRadius: "4px",
                        }}
                      />
                    </Link>
                    <div
                      className="position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 1 }}
                    >
                      <div className="d-flex flex-column gap-1">
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() =>
                            handleProductSpecificationsClick(product.id)
                          }
                          disabled={isDeleting}
                          style={{ fontSize: "0.75rem" }}
                          title="Ürün Özellikleri"
                        >
                          <i className="bx bx-list-ul text-info"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => handleEdit(product)}
                          disabled={isDeleting}
                          style={{ fontSize: "0.75rem" }}
                          title="Düzenle"
                        >
                          <i className="bx bx-edit text-primary"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting}
                          style={{ fontSize: "0.75rem" }}
                          title="Sil"
                        >
                          <i className="bx bx-trash text-danger"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <h6
                      className="card-title mb-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {product.title}
                    </h6>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span
                        className="badge bg-label-primary"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Stok: {product.sellableQuantity}
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                        {product.price.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </span>
                    </div>
                    <small
                      className="text-muted d-block mt-2"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Barkod: {product.barcodeNumber}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="bx bx-package mb-2"
                style={{ fontSize: "3rem", color: "#d9dee3" }}
              ></i>
              <h6 style={{ fontSize: "0.9rem" }}>Ürün bulunamadı</h6>
              <p className="text-muted mb-3" style={{ fontSize: "0.8rem" }}>
                Henüz ürün eklenmemiş veya filtrelere uygun ürün
                bulunmamaktadır.
              </p>
              <Link
                href="/admin/products/add-product"
                className="btn btn-primary btn-sm"
                style={{ fontSize: "0.75rem" }}
              >
                <i className="bx bx-plus me-1"></i>
                Yeni Ürün Ekle
              </Link>
            </div>
          </div>
        )}

        {/* Sayfa bilgisi gösterimi */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 border-top pt-3">
          <div
            className="text-muted mb-3 mb-md-0"
            style={{ fontSize: "0.813rem" }}
          >
            {searchTerm
              ? `"${searchTerm}" aramasına uygun ${totalCount} ürün bulundu - Sayfa ${currentPage}/${totalPages}`
              : `Toplam ${totalCount} ürün içinden ${
                  (currentPage - 1) * itemsPerPage + 1
                }-${Math.min(
                  currentPage * itemsPerPage,
                  totalCount
                )} arası gösteriliyor`}
          </div>

          {/* CirclePagination componentini sadece birden fazla sayfa varsa göster */}
          {totalCount > itemsPerPage && (
            <CirclePagination
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={itemsPerPage}
              onPageChange={(page) => handlePageChange(page)}
            />
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <GeneralModal
        id="deleteConfirmModal"
        title="Ürün Sil"
        size="sm"
        onClose={() => setDeletingProductId(null)}
        onApprove={handleConfirmDelete}
        approveButtonText="Evet, Sil"
        isLoading={isDeleting}
        showFooter={true}
      >
        <div className="text-center">
          <i
            className="bx bx-error-circle mb-2"
            style={{ fontSize: "3rem", color: "#ff3e1d" }}
          ></i>
          <h6 style={{ fontSize: "0.9rem" }}>Emin misiniz?</h6>
          <p className="text-muted" style={{ fontSize: "0.8rem" }}>
            Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>
      </GeneralModal>

      {/* Product Specifications Modal */}
      <GeneralModal
        id="productSpecificationsModal"
        title="Ürün Özellikleri"
        size="lg"
        onClose={() => setSelectedProductId(null)}
        showFooter={false}
      >
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => $("#addSpecificationModal").modal("show")}
          >
            <i className="icon-plus me-1"></i>
            Yeni Özellik Ekle
          </button>
        </div>

        {specificationsLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        ) : (
          <div className="specifications-container">
            {displaySpecifications && displaySpecifications.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i
                  className="icon-info-circle mb-2"
                  style={{ fontSize: "2rem" }}
                ></i>
                <p>Bu ürün için henüz özellik eklenmemiş</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "45%" }}>Özellik</th>
                      <th style={{ width: "45%" }}>Değer</th>
                      <th style={{ width: "10%" }} className="text-end">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySpecifications &&
                      displaySpecifications.map(
                        (spec: ProductSpecification) => (
                          <tr key={spec.$id}>
                            <td className="spec-name">
                              <div className="fw-medium text-dark">
                                {spec.name}
                              </div>
                            </td>
                            <td className="spec-value">
                              <div className="text-secondary">{spec.value}</div>
                            </td>
                            <td className="text-end" style={{ width: "10%" }}>
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  className="btn btn-sm btn-outline-primary p-0"
                                  title="Düzenle"
                                  onClick={() => handleEditClick(spec)}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    minWidth: "unset",
                                  }}
                                >
                                  <i
                                    className="icon-edit"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                </button>
                                <button
                                  className="btn btn-sm p-0"
                                  title="Sil"
                                  onClick={() => handleDeleteClick(spec.id)}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    minWidth: "unset",
                                  }}
                                >
                                  <i
                                    className="bx bxs-trash"
                                    style={{ fontSize: "12px" }}
                                  ></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </GeneralModal>

      {/* Add Specification Modal */}
      <GeneralModal
        id="addSpecificationModal"
        title="Yeni Özellik Ekle"
        size="sm"
        onClose={() => {
          setNewSpecName("");
          setNewSpecValue("");
        }}
        approveButtonText="Ekle"
        isLoading={addProductSpecificationLoading}
        showFooter={true}
        formId="addSpecificationForm"
      >
        <form id="addSpecificationForm" onSubmit={handleAddSpecification}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.75rem" }}>
              Özellik Adı
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={newSpecName}
              onChange={(e) => setNewSpecName(e.target.value)}
              placeholder="Örneğin: Renk, Boyut, Ağırlık"
              style={{ fontSize: "0.75rem" }}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.75rem" }}>
              Özellik Değeri
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Örneğin: Kırmızı, L, 1kg"
              style={{ fontSize: "0.75rem" }}
              required
            />
          </div>
        </form>
      </GeneralModal>

      {/* Edit Specification Modal */}
      <GeneralModal
        id="editSpecificationModal"
        title="Özellik Düzenle"
        size="sm"
        onClose={() => {
          setEditingSpec(null);
          setEditSpecName("");
          setEditSpecValue("");
        }}
        approveButtonText="Güncelle"
        isLoading={updateProductSpecificationLoading}
        showFooter={true}
        formId="editSpecificationForm"
      >
        <form id="editSpecificationForm" onSubmit={handleEditSpecification}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.75rem" }}>
              Özellik Adı
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={editSpecName}
              onChange={(e) => setEditSpecName(e.target.value)}
              placeholder="Örneğin: Renk, Boyut, Ağırlık"
              style={{ fontSize: "0.75rem" }}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: "0.75rem" }}>
              Özellik Değeri
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={editSpecValue}
              onChange={(e) => setEditSpecValue(e.target.value)}
              placeholder="Örneğin: Kırmızı, L, 1kg"
              style={{ fontSize: "0.75rem" }}
              required
            />
          </div>
        </form>
      </GeneralModal>

      {/* Delete Specification Modal */}
      <div
        className="modal fade"
        id="deleteSpecificationModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Özellik Sil</h5>
              <i
                data-bs-dismiss="modal"
                aria-label="Close"
                className="icon-close"
                onClick={() => setDeletingSpecificationId(null)}
                style={{ cursor: "pointer", color: "red" }}
              ></i>
            </div>
            <div className="modal-body p-5">
              <ConfirmModal
                onConfirm={handleDeleteSpecification}
                isLoading={deleteProductSpecificationLoading}
                title="Emin misiniz?"
                message="Bu özellik silinecektir. Bu işlem geri alınamaz."
                confirmButtonText="Evet, Sil"
                cancelButtonText="İptal"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          border-radius: 0.5rem;
          border: 1px solid #eee;
          box-shadow: none;
        }
        .btn {
          border-radius: 3px;
        }
        .form-select,
        .form-control {
          border-radius: 3px;
        }
        .badge {
          font-weight: 500;
          padding: 0.35em 0.65em;
        }
        .bg-label-primary {
          background-color: #e7e7ff;
          color: #696cff;
        }
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
          padding: 0.25rem;
          font-size: 0.75rem;
          color: #697a8d;
        }
        .page-item.active .page-link {
          background-color: #696cff;
          border-color: #696cff;
          color: #fff;
        }
        .page-item.disabled .page-link {
          color: #adb5bd;
          opacity: 0.65;
        }
        .page-link i {
          font-size: 1rem;
        }

        .specifications-container {
          max-height: 60vh;
          overflow-y: auto;
          border-radius: 8px;
        }

        .table {
          margin-bottom: 0;
          border-collapse: separate;
          border-spacing: 0;
        }

        .table th {
          background: #f8f9fa;
          font-weight: 600;
          padding: 1rem;
          border-bottom: 2px solid #e9ecef;
          white-space: nowrap;
        }

        .table td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #e9ecef;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .spec-name,
        .spec-value {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-group {
          gap: 0.5rem;
        }

        .btn-group .btn {
          padding: 0.4rem 0.6rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-group .btn i {
          font-size: 1rem;
        }

        .btn-group .btn:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .spec-name,
          .spec-value {
            max-width: 150px;
          }

          .table td,
          .table th {
            padding: 0.75rem;
          }

          .btn-group .btn {
            padding: 0.3rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductsAdminPage;
