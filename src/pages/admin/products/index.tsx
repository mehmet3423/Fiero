"use client";
import CirclePagination from "@/components/shared/CirclePagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { SubCategory } from "@/constants/models/Category";
import { Product } from "@/constants/models/Product";
import {
  DiscountSort,
  RatingSort,
  SalesCountSort,
  LikeCountSort,
} from "@/constants/enums/SortOptions";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useDeleteProduct } from "@/hooks/services/products/useDeleteProduct";
import { useGetAllProductsAdmin } from "@/hooks/services/products/useGetAllProductsAdmin";
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
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [sortBy, setSortBy] = useState<string>("none");

  // Pagination için state'ler
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const { categories, isLoading: categoriesLoading } = useCategories();

  // Tek API: GetAllProducts - tüm filtreler desteklenir
  const {
    items: currentProducts,
    count: totalCount,
    isLoading,
  } = useGetAllProductsAdmin({
    page: currentPage - 1,
    pageSize: itemsPerPage,
    searchTerm: searchTerm,
    mainCategoryId: selectedMainCategoryId || undefined,
    subCategoryId: selectedSubCategoryId || undefined,
    isAvailable:
      availabilityFilter === "all"
        ? undefined
        : availabilityFilter === "available",
    discountSort:
      sortBy === "price-asc"
        ? DiscountSort.PriceAsc
        : sortBy === "price-desc"
          ? DiscountSort.PriceDesc
          : DiscountSort.None,
    ratingSort:
      sortBy === "rating-best"
        ? RatingSort.BestFirst
        : sortBy === "rating-worst"
          ? RatingSort.WorstFirst
          : RatingSort.None,
    salesCountSort:
      sortBy === "sales-high"
        ? SalesCountSort.HighToLow
        : sortBy === "sales-low"
          ? SalesCountSort.LowToHigh
          : SalesCountSort.None,
    likeCountSort:
      sortBy === "likes-high"
        ? LikeCountSort.HighToLow
        : sortBy === "likes-low"
          ? LikeCountSort.LowToHigh
          : LikeCountSort.None,
  });

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

  // Aramaya veya filtre değişikliklerine göre pagination sıfırlanır
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedMainCategoryId,
    selectedSubCategoryId,
    searchTerm,
    availabilityFilter,
    sortBy,
  ]);

  // Pagination için toplam sayfa sayısını hesaplama
  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

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

  // Arama kısmını temizleme ve filtreleri sıfırlama
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedMainCategoryId("");
    setSelectedSubCategoryId("");
    setAvailabilityFilter("all");
    setSortBy("none");
    setCurrentPage(1);
  };

  return (
    <div className="content-wrapper overflow-hidden">
      <div className="container-fluid flex-grow-1 container-p-y px-2 px-md-3">
        {/* Header - mobilde alt alta, masaüstünde yan yana */}
        <div className="card bg-transparent border-0 mb-0">
          <div className="card-body mb-0 pb-3 px-0">
            <div className="d-flex flex-column flex-sm-row flex-wrap pt-0 justify-content-between align-items-stretch align-items-sm-center gap-2">
              <h6
                className="card-header mb-0"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#566a7f",
                }}
              >
                Ürün Yönetimi
              </h6>
              <Link
                href="/admin/products/add-product"
                className="btn btn-primary btn-sm flex-shrink-0"
                style={{ fontSize: "0.75rem" }}
              >
                <i className="bx bx-plus me-1"></i>
                Yeni Ürün Ekle
              </Link>
            </div>
          </div>
        </div>

        {/* Filtreler - Swagger GetAllProducts ile uyumlu */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Arama
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
              <div className="col-12 col-md-2">
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
                  <option value="">Tümü</option>
                  {categories?.items?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2">
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
                  <option value="">Tümü</option>
                  {subCategories.map((subCategory: SubCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Durum
                </label>
                <select
                  className="form-select form-select-sm"
                  value={availabilityFilter}
                  onChange={(e) =>
                    setAvailabilityFilter(
                      e.target.value as "all" | "available" | "unavailable"
                    )
                  }
                  style={{ fontSize: "0.75rem" }}
                >
                  <option value="all">Tümü</option>
                  <option value="available">Aktif</option>
                  <option value="unavailable">Pasif</option>
                </select>
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label" style={{ fontSize: "0.75rem" }}>
                  Sıralama
                </label>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ fontSize: "0.75rem" }}
                >
                  <option value="none">Sıralama yok</option>
                  <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                  <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                  <option value="rating-best">Puan (En yüksek)</option>
                  <option value="rating-worst">Puan (En düşük)</option>
                  <option value="sales-high">Satış (En çok)</option>
                  <option value="sales-low">Satış (En az)</option>
                  <option value="likes-high">Beğeni (En çok)</option>
                  <option value="likes-low">Beğeni (En az)</option>
                </select>
              </div>
              {(searchTerm ||
                selectedMainCategoryId ||
                selectedSubCategoryId ||
                availabilityFilter !== "all" ||
                sortBy !== "none") && (
                <div className="col-12 col-md-2 col-lg-1">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>
                    &nbsp;
                  </label>
                  <button
                    className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                    type="button"
                    onClick={handleClearFilters}
                    style={{ fontSize: "0.75rem", marginBottom: "10px" }}
                  >
                    <i className="bx bx-refresh" style={{ fontSize: "1rem" }}></i>
                    <span>Temizle</span>
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
                <div className="card h-100 product-admin-card">
                  <div className="position-relative product-admin-card-img-wrap">
                    {product.isOutlet && (
                      <div
                        className="position-absolute top-0 start-0 m-2"
                        style={{ zIndex: 1 }}
                      >
                        <span className="badge bg-label-primary">Outlet</span>
                      </div>
                    )}
                    <Link
                      href={`/products/${product.id}`}
                      className="d-flex align-items-center justify-content-center overflow-hidden"
                      style={{
                        height: "200px",
                        background: "transparent",
                      }}
                    >
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        src={
                          product.baseImageUrl || "/assets/site/images/no-image.svg"
                        }
                        alt={product.title}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          width: "auto",
                          maxWidth: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                        unoptimized={true}
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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 border-top pt-3 gap-2">
          <div
            className="text-muted mb-0 text-center text-md-start"
            style={{ fontSize: "0.813rem", wordBreak: "break-word" }}
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
        .product-admin-card .product-admin-card-img-wrap {
          background: transparent !important;
        }
        .product-admin-card .card-img-top {
          object-position: center;
        }
        .btn {
          border-radius: 3px;
        }
        .form-select,
        .form-control {
          border-radius: 3px;
          min-width: 0;
          max-width: 100%;
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
