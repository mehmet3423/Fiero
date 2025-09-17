"use client";
import EditProductForm from "@/components/admin/products/EditProductForm";
import BackButton from "@/components/shared/BackButton";
import PageLoadingAnimation from "@/components/shared/PageLoadingAnimation";
import { UpdateDtoProduct } from "@/constants/models/DtoProduct";
import { Product, ProductDetailResponse } from "@/constants/models/Product";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";
import { useUpdateProduct } from "@/hooks/services/products/useUpdateProduct";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const { productId } = router.query;
  const {
    product: apiProduct,
    isLoading,
    error,
  } = useProductDetail(productId as string);
  const { updateProduct, isPending: isUpdating } = useUpdateProduct();
  const [formattedProduct, setFormattedProduct] = useState<Product | null>(
    null
  );

  // API'den gelen veriyi Product tipine uygun şekilde düzenle
  useEffect(() => {
    if (apiProduct) {
      try {
        // $values içindeki değerleri dizilere dönüştürelim
        let contentImageUrls: string[] = [];

        if (Array.isArray(apiProduct.contentImageUrls)) {
          contentImageUrls = apiProduct.contentImageUrls;
        } else if (
          apiProduct.contentImageUrls &&
          typeof apiProduct.contentImageUrls === "object"
        ) {
          if (
            "$values" in apiProduct.contentImageUrls &&
            Array.isArray((apiProduct.contentImageUrls as any).$values)
          ) {
            contentImageUrls = (apiProduct.contentImageUrls as any).$values;
          }
        }

        let bannerUrls: string[] = [];

        if (Array.isArray(apiProduct.banner)) {
          bannerUrls = apiProduct.banner;
        } else if (apiProduct.banner && typeof apiProduct.banner === "object") {
          if (
            "$values" in apiProduct.banner &&
            Array.isArray((apiProduct.banner as any).$values)
          ) {
            bannerUrls = (apiProduct.banner as any).$values;
          }
        }

        // API verilerini Product tipine dönüştür
        const productData = {
          ...apiProduct,
          $id: "",
          contentImageUrls: contentImageUrls,
          banner: bannerUrls,
          imageUrl: apiProduct.baseImageUrl || "",
          videoUrl: "",
          subCategorySpecificationIds: { $id: "", $values: [] },
          subCategorySpecificationOptions: { $id: "", $values: [] },
          comments: { $id: "", $values: [] },
          technicalDetails: { $id: "", $values: [] },
          isAvailable: apiProduct.isAvailable,
          sellerId: "",
          seller: null,
          orderItems: { $id: "", $values: [] },
          productOnlySpecifications: apiProduct.productOnlySpecifications || [],
        } as unknown as Product;
        setFormattedProduct(productData);
      } catch (error) {
        toast.error("Ürün verisi yüklenirken bir hata oluştu");
      }
    }
  }, [apiProduct]);

  const handleUpdate = async (
    productId: string,
    updatedData: UpdateDtoProduct
  ) => {
    try {
      await updateProduct(productId, updatedData);
      router.push("/admin/products");
    } catch (error) {
      toast.error("Ürün güncellenirken bir hata oluştu");
    }
  };

  if (isLoading) {
    return <PageLoadingAnimation />;
  }

  if (error || !apiProduct) {
    return (
      <div className="content-wrapper">
        <div
          className="container-l flex-grow-1 container-p-y"
          style={{ padding: 0 }}
        >
          <div className="card">
            <div className="card-body">
              <div className="text-center py-5">
                <h3>Ürün bulunamadı veya yüklenirken bir hata oluştu</h3>
                <p className="text-muted">
                  Lütfen daha sonra tekrar deneyin veya farklı bir ürün seçin.
                </p>
                <Link href="/admin/products" className="btn btn-primary">
                  Ürün Listesine Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formattedproduct henüz hazır değilse yükleme animasyonu göster
  if (!formattedProduct) {
    return <PageLoadingAnimation />;
  }

  return (
    <div className="content-wrapper">
      <div className="container-l flex-grow-1 container-p-y">
        {/* Header */}
        <div
          className="card bg-transparent border-0 mb-3"
          style={{ boxShadow: "none" }}
        >
          <div className="card-body pb-0" style={{ boxShadow: "none" }}>
            <BackButton className="mb-3 mt-3 col-1" href="/admin/products" />
            <div className="d-flex justify-content-between align-items-center">
              <h6
                className="card-header"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#566a7f",
                  marginLeft: "-10px",
                  boxShadow: "none",
                }}
              >
                Ürün Düzenle: {formattedProduct.title}
              </h6>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card mb-4">
          <div className="card-body">
            <EditProductForm
              product={formattedProduct}
              onSubmit={handleUpdate}
              isLoading={isUpdating}
            />

            <div className="d-flex justify-content-end mt-4">
              <Link
                href="/admin/products"
                className="btn btn-outline-secondary me-2"
              >
                İptal
              </Link>
              <button
                type="submit"
                form="editProductForm"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Güncelleniyor...
                  </>
                ) : (
                  "Ürünü Güncelle"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .content-wrapper {
          padding: 1.5rem;
          background-color: #f5f5f9;
          min-height: calc(100vh - 4rem);
        }
        .card {
          border-radius: 0.5rem;
          border: 1px solid #eee;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .btn {
          border-radius: 0.25rem;
        }

        /* Form içindeki font boyutlarını küçültme */
        :global(.card-body .form-group label) {
          font-size: 0.85rem;
          font-weight: 500;
        }
        :global(.card-body .form-control) {
          font-size: 0.9rem;
        }
        :global(.card-body small.text-muted) {
          font-size: 0.75rem;
        }
        :global(.card-body input, .card-body textarea, .card-body select) {
          padding: 0.4rem 0.75rem;
        }
      `}</style>
    </div>
  );
}
