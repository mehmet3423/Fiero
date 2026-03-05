import Head from "next/head";
import SafeImage from "@/components/shared/SafeImage";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/context/useCart";
import QuickView from "@/components/product/QuickView";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";
import { Product } from "@/constants/models/Product";
import { useLanguage } from "@/context/LanguageContext";

const CompareProducts = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { addToCart } = useCart();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ids = JSON.parse(localStorage.getItem('compareProducts') || '[]');
      setCompareIds(ids);
    }
  }, []);

  // URL'den add parametresini okuyup ürünü listeye ekle
  useEffect(() => {
    if (router.isReady && router.query.add) {
      const productIdToAdd = router.query.add as string;

      if (typeof window !== "undefined") {
        const currentIds = JSON.parse(localStorage.getItem('compareProducts') || '[]');

        // Eğer ürün zaten listede değilse ekle
        if (!currentIds.includes(productIdToAdd)) {
          const updatedIds = [...currentIds, productIdToAdd];
          localStorage.setItem('compareProducts', JSON.stringify(updatedIds));
          setCompareIds(updatedIds);
        }

        // URL'den parametreyi temizle
        router.replace('/compare-products', undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.add]);

  const { products, isLoading } = useGetProductListByIds(compareIds);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleRemove = (id: string) => {
    const updated = compareIds.filter((pid) => pid !== id);
    setCompareIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem('compareProducts', JSON.stringify(updated));
    }
  };

  return (
    <>
      <Head>
        <title>{t("compareProducts.pageTitle")}</title>
      </Head>
      <style jsx>{`
        /* Sütun hizalaması: tüm satırlarda eşit genişlik */
        .tf-compare-row {
          display: flex;
        }
        .tf-compare-label-col {
          flex: 0 0 180px;
          min-width: 180px;
        }
        .tf-compare-label-col h6 {
          text-align: left;
        }
        .tf-compare-row .tf-compare-col:not(.tf-compare-label-col) {
          flex: 1 1 0;
          min-width: 180px;
        }

        /* Mobil görünüm için buton düzenlemeleri */
        @media (max-width: 768px) {
          .tf-compare-group-btns {
            flex-direction: column !important;
            gap: 8px !important;
            width: 100%;
            margin-top: 15px !important;
            margin-bottom: 15px !important;
          }
          
          .tf-compare-group-btns button {
            width: 100% !important;
            padding: 10px 12px !important;
            font-size: 13px !important;
            white-space: nowrap;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            min-height: 42px;
            box-sizing: border-box;
          }
          
          .tf-compare-group-btns button .icon {
            flex-shrink: 0 !important;
            width: 18px !important;
            height: 18px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
          }
          
          .tf-compare-group-btns button > span:not(.icon) {
            flex: 1 1 auto !important;
            text-align: center !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            min-width: 0 !important;
          }
        }
        
        /* Çok küçük ekranlar için butonları daha kompakt yap */
        @media (max-width: 480px) {
          .tf-compare-group-btns {
            gap: 6px !important;
          }
          
          .tf-compare-group-btns button {
            padding: 8px 10px !important;
            font-size: 12px !important;
            min-height: 38px;
          }
          
          .tf-compare-group-btns button .icon {
            font-size: 14px !important;
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{t("compareProducts.pageTitle")}</div>
        </div>
      </div>
      <section className="flat-spacing-12">
        <div className="container">
          <div className="tf-compare-table">
            {/* Ürünler */}
            <div className="tf-compare-row tf-compare-grid">
              <div className="tf-compare-col tf-compare-label-col d-md-block d-none"></div>
              {isLoading ? (
                <div>{t("compareProducts.loading")}</div>
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <div className="tf-compare-col" key={product.id}>
                    <div className="tf-compare-item">
                      <div className="tf-compare-remove link" onClick={() => handleRemove(product.id)}>
                        {t("compareProducts.remove")}
                      </div>
                      {product.isOutlet && (
                        <span className="badge bg-danger mb-2" style={{ alignSelf: "center" }}>
                          {t("compareProducts.outletBadge")}
                        </span>
                      )}
                      <a className="tf-compare-image" href={`/products/${product.id}`}>
                        <SafeImage
                          src={resolveImageUrl(product.baseImageUrl)}
                          alt={product.title}
                          width={220}
                          height={300}
                          style={{ objectFit: "contain", background: "#fff", borderRadius: 12 }}
                        />
                      </a>
                      <a className="tf-compare-title" href={`/products/${product.id}`}>{product.title}</a>
                      <div className="price">
                        {product.discountedPrice && product.discountedPrice !== product.price ? (
                          <>
                            <span className="compare-at-price">{product.price?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                            <span className="price-on-sale">{product.discountedPrice?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                          </>
                        ) : (
                          <>{product.price?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</>
                        )}
                      </div>
                      <div className="tf-compare-group-btns d-flex gap-10">
                        <button
                          className="tf-btn btn-outline-dark radius-3"
                          onClick={() => handleQuickView(product)}
                          style={{ fontWeight: 600 }}
                        >
                          <span className="icon icon-view"></span>
                          <span>{t("compareProducts.quickView")}</span>
                        </button>
                        <button
                          className="tf-btn btn-outline-dark radius-3"
                          onClick={() => addToCart(product.id)}
                          style={{ fontWeight: 600 }}
                        >
                          <span className="icon icon-bag"></span>
                          <span>{t("compareProducts.addToCart")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center" style={{ flex: 1, padding: "2rem" }}>{t("compareProducts.noProducts")}</div>
              )}
            </div>
            {/* Özellikler */}
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field tf-compare-label-col d-md-block d-none">
                <h6>{t("compareProducts.stockStatus")}</h6>
              </div>
              {products && products.length > 0 && products.map((product) => (
                <div className="tf-compare-col tf-compare-field tf-compare-stock" key={product.id} >
                  <div className="icon">
                    {product.sellableQuantity > 0 ? (
                      <span style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>&#10003;</span> // Check icon
                    ) : (
                      <span style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', backgroundColor: 'rgba(177, 32, 32, 1)', borderRadius: '50%', height: '17px', width: '17px' }}>&#10007;</span> // Cross icon
                    )}
                  </div>
                  <span className="fw-5" style={{ color: product.sellableQuantity > 0 ? 'green' : 'red' }}>
                    {product.sellableQuantity > 0 ? t("compareProducts.inStock") : t("compareProducts.outOfStock")}
                  </span>
                </div>
              ))}
            </div>
            {/* Puan */}
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field tf-compare-label-col d-md-block d-none">
                <h6>{t("compareProducts.rating")}</h6>
              </div>
              {products && products.length > 0 && products.map((product) => (
                <div className="tf-compare-col tf-compare-field tf-compare-value text-center" key={product.id}>
                  {product.ratingCount && product.ratingCount > 0 ? (
                    <span>
                      ★ {typeof product.averageRating === "number" ? product.averageRating.toFixed(1) : "0"} ({product.ratingCount})
                    </span>
                  ) : (
                    <span className="text-muted">{t("compareProducts.noRating")}</span>
                  )}
                </div>
              ))}
            </div>
            {/* İade */}
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field tf-compare-label-col d-md-block d-none">
                <h6>{t("compareProducts.refundable")}</h6>
              </div>
              {products && products.length > 0 && products.map((product) => (
                <div className="tf-compare-col tf-compare-field tf-compare-value text-center" key={product.id}>
                  {product.refundable ? (
                    <span className="text-success">{t("compareProducts.refundableYes")}</span>
                  ) : (
                    <span className="text-muted">{t("compareProducts.refundableNo")}</span>
                  )}
                </div>
              ))}
            </div>
            {/* Ürün Tipi (Outlet) */}
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field tf-compare-label-col d-md-block d-none">
                <h6>{t("compareProducts.productType")}</h6>
              </div>
              {products && products.length > 0 && products.map((product) => (
                <div className="tf-compare-col tf-compare-field tf-compare-value text-center" key={product.id}>
                  {product.isOutlet ? (
                    <span className="text-warning fw-5">{t("compareProducts.productTypeOutlet")}</span>
                  ) : (
                    <span>{t("compareProducts.productTypeNormal")}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <QuickView
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          product={selectedProduct}
        />
      )}

    </>
  );
};

export default CompareProducts;