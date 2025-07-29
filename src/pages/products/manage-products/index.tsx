"use client";
import GeneralModal from "@/components/shared/GeneralModal";
import { PathEnums } from "@/constants/enums/PathEnums";
import { Product } from "@/constants/models/Product";
import { useCategories } from "@/hooks/services/categories/useCategories";
import { useDeleteProduct } from "@/hooks/services/products/useDeleteProduct";
import { useGetAllProducts } from "@/hooks/services/products/useGetAllProducts";
import { useProductsByCategory } from "@/hooks/services/products/useProductsByCategory";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const ManageProductsPage: React.FC = () => {
  const [selectedMainCategoryId, setSelectedMainCategoryId] =
    useState<string>("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] =
    useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products: categoryProducts, isLoading: productsLoading } =
    useProductsByCategory(selectedSubCategoryId);
  const { data: allProducts, isLoading: allProductsLoading } =
    useGetAllProducts();

  const { deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  const selectedMainCategory = useMemo(() => {
    if (!categories?.items) return null;
    return categories.items.find((cat) => cat.id === selectedMainCategoryId);
  }, [categories, selectedMainCategoryId]);

  const subCategories = useMemo(() => {
    if (!selectedMainCategory?.subCategories) return [];
    return selectedMainCategory.subCategories;
  }, [selectedMainCategory]);

  useEffect(() => {
    setSelectedSubCategoryId("");
  }, [selectedMainCategoryId]);

  const router = useRouter();

  const isLoading =
    categoriesLoading ||
    (selectedSubCategoryId ? productsLoading : allProductsLoading);

  // Arama ve filtreler sonucu görüntülenecek ürünlerin listesi
  const filteredProducts = useMemo(() => {
    let result: Product[] = [];

    if (selectedSubCategoryId && categoryProducts?.items) {
      // Kategori filtresi varsa o kategorideki ürünleri al
      result = categoryProducts.items;
    } else if (allProducts?.items) {
      // Kategori filtresi yoksa tüm ürünleri al
      result = allProducts.items;
    }

    // Arama filtresini uygula
    if (searchTerm.trim() !== "") {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          (product.barcodeNumber &&
            product.barcodeNumber.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return result;
  }, [selectedSubCategoryId, categoryProducts, allProducts, searchTerm]);

  const handleEdit = (product: Product) => {
    router.push(`${PathEnums.SELLER_PRODUCTS_EDIT}/${product.id}`);
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

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Arama resetleme
  const resetSearch = () => {
    setSearchTerm("");
  };

  return (
    <main className="main" style={{ backgroundColor: "#fafafa" }}>
      <div
        className="page-header text-center"
        style={{ backgroundImage: "url(assets/images/page-header-bg.jpg)" }}
      >
        <div className="container">
          <h1 className="page-title">
            Ürün Yönetimi<span>Admin</span>
          </h1>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="toolbox">
            <div className="toolbox-left">
              <div className="d-flex flex-wrap gap-3">
                {/* Arama kutusu */}

                <select
                  className="form-control"
                  value={selectedMainCategoryId}
                  onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                  disabled={categoriesLoading}
                >
                  <option value="">Ana Kategori Seçin</option>
                  {categories?.items &&
                    categories.items.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>

                <select
                  className="form-control"
                  value={selectedSubCategoryId}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  disabled={!selectedMainCategoryId}
                >
                  <option value="">Alt Kategori Seçin</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className="toolbox-item"
              style={{ position: "relative", minWidth: "240px" }}
            >
              <div className="search-wrapper">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ürün adı veya barkod"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {searchTerm && (
                  <button
                    className="btn btn-sm btn-link position-absolute"
                    style={{
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                    }}
                    onClick={resetSearch}
                  >
                    <i className="icon-close"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="toolbox-right d-flex gap-2">
              <Link
                href={PathEnums.SELLER_PRODUCTS_ADD}
                className="btn btn-primary"
              >
                Yeni Ürün Ekle
              </Link>
              <Link
                href={PathEnums.SELLER_PRODUCTS_SPECIFICATIONS}
                className="btn btn-primary m-3"
              >
                Ürün Özellikleri
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Yükleniyor...</span>
              </div>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="products mb-3">
              <div className="row">
                {filteredProducts.map((product: Product) => (
                  <div key={product.id} className="col-6 col-md-4 col-lg-3">
                    <div className="product">
                      <figure className="product-media">
                        <Link href={`/products/${product.id}`}>
                          <Image
                            width={0}
                            height={0}
                            sizes="100vw"
                            src={
                              product.baseImageUrl ||
                              "/assets/images/no-image.jpg"
                            }
                            alt={product.title}
                            className="product-image"
                            style={{ height: "280px", objectFit: "cover" }}
                          />
                        </Link>

                        <div className="product-action">
                          <div className="d-flex gap-2 justify-content-center w-100">
                            <button
                              className="btn btn-outline-secondary border-0 btn-sm flex-grow-1 text-center"
                              title="Düzenle"
                              onClick={() => handleEdit(product)}
                            >
                              <i className="icon-edit mr-1"></i> Düzenle
                            </button>
                            <button
                              className="btn btn-outline-danger border-0 btn-sm flex-grow-1 text-center pr-5"
                              title="Sil"
                              onClick={() => handleDelete(product.id)}
                              disabled={isDeleting}
                            >
                              <i className="icon-close "></i> Sil
                            </button>
                          </div>
                        </div>
                      </figure>

                      <div className="product-body">
                        <div className="product-cat">
                          <span>Stok: {product.sellableQuantity}</span>
                        </div>
                        <h3 className="product-title">
                          <Link href={`/products/${product.id}`}>
                            {product.title}
                          </Link>
                        </h3>
                        <div className="product-price">
                          {product.price.toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          })}
                        </div>
                        <div className="product-details">
                          <br />
                          <small className="text-muted">
                            Barkod: {product.barcodeNumber}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i
                  className="icon-shopping-cart"
                  style={{ fontSize: "3rem", color: "#cccccc" }}
                ></i>
              </div>
              {searchTerm ? (
                <>
                  <h3>Arama sonuçlarında ürün bulunamadı</h3>
                  <p className="text-muted">
                    Arama kriterlerinize uygun ürün bulunamadı. Lütfen farklı
                    bir arama terimi deneyin.
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={resetSearch}
                  >
                    Aramayı Temizle
                  </button>
                </>
              ) : (
                <>
                  <h3>Bu kategoride ürün bulunamadı</h3>
                  <p className="text-muted">
                    Bu kategoriye henüz ürün eklenmemiş.
                  </p>
                  <Link
                    href={PathEnums.SELLER_PRODUCTS_ADD}
                    className="btn btn-primary"
                  >
                    Yeni Ürün Ekle
                  </Link>
                </>
              )}
            </div>
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
        showFooter
        isLoading={isDeleting}
      >
        <div className="text-center">
          <i
            className="icon-exclamation"
            style={{ fontSize: "3rem", color: "#dc3545" }}
          ></i>
          <h4 className="mt-3">Emin misiniz?</h4>
          <p className="text-muted">
            Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>
      </GeneralModal>
    </main>
  );
};

export default ManageProductsPage;
