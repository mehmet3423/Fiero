"use client";
import EditProductForm from "@/components/admin/products/EditProductForm";
import { PathEnums } from "@/constants/enums/PathEnums";
import { UpdateDtoProduct } from "@/constants/models/DtoProduct";
import { Product, ProductDetailResponse } from "@/constants/models/Product";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";
import { useUpdateProduct } from "@/hooks/services/products/useUpdateProduct";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function SellerProductEditPage() {
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
        if (
          apiProduct.contentImageUrls &&
          typeof apiProduct.contentImageUrls === "object"
        ) {
          if (
            "$values" in apiProduct.contentImageUrls &&
            Array.isArray(apiProduct.contentImageUrls.$values)
          ) {
            contentImageUrls = apiProduct.contentImageUrls.$values;
          }
        }

        let bannerUrls: string[] = [];
        if (apiProduct.banner && typeof apiProduct.banner === "object") {
          if (
            "$values" in apiProduct.banner &&
            Array.isArray(apiProduct.banner.$values)
          ) {
            bannerUrls = apiProduct.banner.$values;
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
          isAvailable: apiProduct.isAvailable || true,
          sellerId: "",
          seller: null,
          orderItems: { $id: "", $values: [] },
        } as unknown as Product;

        setFormattedProduct(productData);
      } catch (error) {
        console.error("Ürün verisi formatlanırken hata oluştu:", error);
        toast.error("Ürün verisi yüklenirken bir hata oluştu");
      }
    }
  }, [apiProduct]);

  const handleUpdate = async (
    productId: string,
    updatedData: UpdateDtoProduct
  ) => {
    try {
      console.log(
        "Güncellenecek ürün verisi:",
        JSON.stringify(updatedData, null, 2)
      );
      await updateProduct(productId, updatedData);
      toast.success("Ürün başarıyla güncellendi");
      router.push(PathEnums.SELLER_PRODUCTS);
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
      toast.error("Ürün güncellenirken bir hata oluştu");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error || !apiProduct) {
    return (
      <main className="main">
        <div
          className="page-header text-center"
          style={{ backgroundImage: "url(/assets/images/page-header-bg.jpg)" }}
        >
          <div className="container">
            <h1 className="page-title">
              Ürün Bulunamadı<span>Hata</span>
            </h1>
          </div>
        </div>

        <div className="page-content">
          <div className="container">
            <div className="text-center py-5">
              <div className="mb-3">
                <i
                  className="icon-exclamation"
                  style={{ fontSize: "3rem", color: "#dc3545" }}
                ></i>
              </div>
              <h3>Ürün bulunamadı veya yüklenirken bir hata oluştu</h3>
              <p className="text-muted">
                Lütfen daha sonra tekrar deneyin veya farklı bir ürün seçin.
              </p>
              <Link
                href={PathEnums.SELLER_PRODUCTS}
                className="btn btn-primary"
              >
                Ürün Listesine Dön
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Formattedproduct henüz hazır değilse yükleme animasyonu göster
  if (!formattedProduct) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="main">
      <div
        className="page-header text-center"
        style={{ backgroundImage: "url(/assets/images/page-header-bg.jpg)" }}
      >
        <div className="container">
          <h1 className="page-title">
            Ürün Düzenle<span>{formattedProduct.title}</span>
          </h1>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <Link
            href={PathEnums.SELLER_PRODUCTS}
            className="btn btn-outline-primary mb-3 mt-3"
            style={{ border: "0", marginLeft: "-30px" }}
          >
            <i className="icon-long-arrow-left"></i> Listeye Dön
          </Link>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="title mb-0">Ürün Bilgileri</h2>
          </div>

          <div className="card">
            <div className="card-body">
              <EditProductForm
                product={formattedProduct}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
              />

              <div className="d-flex justify-content-end mt-4">
                <Link
                  href={PathEnums.SELLER_PRODUCTS}
                  className="btn btn-outline-secondary mr-2"
                  style={{ marginRight: "0.5rem" }}
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
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "0.5rem" }}
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
      </div>
    </main>
  );
}
