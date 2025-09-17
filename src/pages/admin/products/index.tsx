"use client";
import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { SubCategory } from "@/constants/models/Category";
import { Product } from "@/constants/models/Product";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useDeleteProduct } from "@/hooks/services/products/useDeleteProduct";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useProductsByCategory } from "@/hooks/services/products/useProductsByCategory";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

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

  // Tüm ürünleri getiren hook'u çağırıyoruz
  const { data: allProducts, isLoading: allProductsLoading } =
    useGetAllProducts({
      page: currentPage - 1, // API 0 tabanlı, UI 1 tabanlı
      pageSize: itemsPerPage,
      searchTerm: searchTerm, // Arama terimini API'ye gönder
      mainCategoryId:
        selectedMainCategoryId && !selectedSubCategoryId
          ? selectedMainCategoryId
          : undefined, // Ana kategori seçiliyse ve alt kategori seçili değilse filtrele
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

  // Yükleniyor durumu - alt kategori seçiliyse productsLoading, değilse allProductsLoading
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
                  <div className="position-relative">
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
                        width={0}
                        height={0}
                        sizes="100vw"
                        src={
                          product.baseImageUrl || "/assets/images/no-image.jpg"
                        }
                        alt={product.title}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "contain" }}
                      />
                    </Link>
                    <div
                      className="position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 1 }}
                    >
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => handleEdit(product)}
                          disabled={isDeleting}
                          style={{ fontSize: "0.75rem" }}
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting}
                          style={{ fontSize: "0.75rem" }}
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
      `}</style>
    </div>
  );
}

export default ProductsAdminPage;
