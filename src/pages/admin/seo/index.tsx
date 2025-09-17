import { useGetSeoList } from "@/hooks/services/admin-seo/useGetSeoList";
import { useDeleteSeo } from "@/hooks/services/admin-seo/useDeleteSeo";
import { useState, useRef } from "react";
import Link from "next/link";
import CirclePagination from "@/components/shared/CirclePagination";
import { useReportPagination } from "@/hooks/shared/useReportPagination";
import GeneralModal from "@/components/shared/GeneralModal";
import { useMainCategoriesWithSubCategories } from "@/hooks/services/categories/useMainCategoriesWithSubCategories";
import { useBasicProductList } from "@/hooks/services/products/useBasicProductList";

interface SeoListItem {
  id: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonical: string;
  robotsMetaTag: string;
  ogTitle: string;
  ogDescription: string;
  isIndexed: boolean;
  isFollowed: boolean;
  productId?: string;
  mainCategoryId?: string;
  subCategoryId?: string;
}

interface SeoFilters {
  filterType?: "all" | "general" | "product" | "category";
  mainCategoryId?: string;
  subCategoryId?: string;
  productId?: string;
  search?: string;
}

function SeoManagementPage() {
  const {
    displayPage,
    pageSize,
    filters,
    changePage,
    updateFilters,
    clearFilters,
    getApiParams,
  } = useReportPagination<SeoFilters>({
    defaultPageSize: 10,
  });

  // Local state for form input
  const [localFilterType, setLocalFilterType] = useState<
    "all" | "general" | "category"
  >(filters.filterType === "product" ? "all" : filters.filterType || "all");

  const { data: mainCategories, isLoading: mainCategoriesLoading } =
    useMainCategoriesWithSubCategories();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const selectedMainCatObj = mainCategories.find(
    (cat) => cat.id === selectedMainCategory
  );

  const subCategories = selectedMainCatObj
    ? selectedMainCatObj.subCategories
    : [];
  const subCategoriesLoading = mainCategoriesLoading && !!selectedMainCategory;

  // Product filter state and hook
  const { products: productList, loading: productsLoading } =
    useBasicProductList();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  // Search state and hook
  const [searchValue, setSearchValue] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ana kategori değiştiğinde filtreye ekle
  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedMainCategory(value);
    setSelectedSubCategory("");
    setSelectedProduct("");
    updateFilters({ mainCategoryId: value, subCategoryId: undefined });
  };

  // Ürün değiştiğinde filtreye ekle
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProduct(value);
    updateFilters({ productId: value || undefined });
  };

  // Filtre tipi değiştiğinde ürün filtresini sıfırla
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterType = e.target.value as any;
    setLocalFilterType(newFilterType);
    updateFilters({ filterType: newFilterType });
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedProduct("");
  };

  // Search değiştiğinde filtreyi güncelle
  const handleSearch = () => {
    updateFilters({ search: searchValue });
  };

  // Enter'a basınca arama
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Transform filters for API
  const apiParams = {
    ...getApiParams(),
    ProductId: selectedProduct || undefined,
    MainCategoryId: selectedMainCategory || undefined,
    SubCategoryId: selectedSubCategory || undefined,
    Search: filters.search || undefined,
  };

  const { seoList, totalCount, pageCount, isLoading, refetch } =
    useGetSeoList(apiParams);
  const { deleteSeo, isPending: isDeleting } = useDeleteSeo();
  const [deletingSeoId, setDeletingSeoId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingSeoId(id);
    $("#deleteConfirmModal").modal("show");
  };

  const handleConfirmDelete = async () => {
    if (deletingSeoId) {
      await deleteSeo(deletingSeoId);
      $("#deleteConfirmModal").modal("hide");
      setDeletingSeoId(null);
      refetch();
    }
  };

  const getSeoType = (item: SeoListItem) => {
    if (item.productId) return "Ürün";
    if (item.mainCategoryId) return "Kategori";
    return "Genel";
  };

  const getSeoTypeColor = (item: SeoListItem) => {
    if (item.productId) return "badge bg-info";
    if (item.mainCategoryId) return "badge bg-warning";
    return "badge bg-primary";
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="row g-3">
        <div className="col-12">
          {/* Header */}
          <div
            className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center"
            style={{ padding: "20px" }}
          >
            <h6
              className="mb-0"
              style={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              SEO Yönetimi
            </h6>
            <Link href="/admin/seo/create" className="btn btn-primary btn-sm">
              Yeni SEO Ekle
            </Link>
          </div>

          {/* Filters */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Arama</label>
                  <div className="input-group">
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="form-control"
                      placeholder="Başlık, meta başlık veya slug ile ara..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSearch}
                    >
                      Ara
                    </button>
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Ana Kategori</label>
                  <select
                    className="form-select"
                    value={selectedMainCategory}
                    onChange={handleMainCategoryChange}
                    disabled={mainCategoriesLoading}
                  >
                    <option value="">Tümü</option>
                    {mainCategories &&
                      mainCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Alt Kategori</label>
                  <select
                    className="form-select"
                    value={selectedSubCategory}
                    onChange={(e) => {
                      setSelectedSubCategory(e.target.value);
                      updateFilters({ subCategoryId: e.target.value });
                    }}
                    disabled={subCategoriesLoading}
                  >
                    <option value="">Tümü</option>
                    {Array.isArray(subCategories) &&
                      subCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Ürüne Göre Filtrele</label>
                  <select
                    className="form-select"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    disabled={productsLoading}
                  >
                    <option value="">Tümü</option>
                    {productList &&
                      productList?.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SEO List */}
          <div className="card">
            <div className="card-body">
              {selectedMainCategory && !selectedSubCategory ? (
                <div className="text-center py-4 text-warning">
                  Lütfen bir alt kategori seçiniz.
                </div>
              ) : isLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              ) : seoList.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">Henüz SEO kaydı bulunmuyor.</p>
                  <Link href="/admin/seo/create" className="btn btn-primary">
                    İlk SEO Kaydını Oluştur
                  </Link>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Tip</th>
                          <th>Başlık</th>
                          <th>Meta Başlık</th>
                          <th>Açıklama</th>
                          <th>Durum</th>
                          <th>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seoList.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span className={getSeoTypeColor(item)}>
                                {getSeoType(item)}
                              </span>
                            </td>
                            <td>
                              <div className="fw-medium">
                                {item.title || "-"}
                              </div>
                              {item.canonical && (
                                <small className="text-muted">
                                  {item.canonical}
                                </small>
                              )}
                            </td>
                            <td>{item.metaTitle || "-"}</td>
                            <td>
                              <div
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {item.metaDescription ||
                                  item.description ||
                                  "-"}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column gap-1">
                                <span
                                  className={`badge ${
                                    item.isIndexed
                                      ? "bg-success"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {item.isIndexed ? "İndeksli" : "İndekssiz"}
                                </span>
                                <span
                                  className={`badge ${
                                    item.isFollowed
                                      ? "bg-success"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {item.isFollowed ? "Takipli" : "Takipsiz"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  href={`/admin/seo/edit/${item.id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Düzenle
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={isDeleting}
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalCount > pageSize && (
                    <div className="d-flex justify-content-center p-3 border-top">
                      <CirclePagination
                        currentPage={displayPage}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={(page) => {
                          changePage(page);
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <GeneralModal
        id="deleteConfirmModal"
        title="SEO Kaydını Sil"
        size="sm"
        onClose={() => setDeletingSeoId(null)}
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
            Bu SEO kaydını silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </p>
        </div>
      </GeneralModal>

      <style jsx>{`
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
        }

        .card-header {
          padding: 0.75rem;
          background-color: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #444;
        }

        .form-control,
        .form-select {
          font-size: 0.813rem;
          padding: 0.375rem 0.5rem;
          border: 1px solid #d0d0d0;
        }

        .btn {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
        }

        .btn-sm {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .table {
          font-size: 0.875rem;
        }

        .badge {
          font-size: 0.7rem;
        }

        .page-content {
          padding: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.75rem;
          }

          .btn-sm {
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
          }
        }
      `}</style>
    </div>
  );
}

export default SeoManagementPage;
