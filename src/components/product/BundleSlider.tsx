import React, { useState, useMemo } from "react";
import Image from "next/image";
import BundleProducts from "./BundleProducts";

interface BundleSliderProps {
  cartProducts: any[];
  bundleDiscounts: any[];
}

const BundleSlider: React.FC<BundleSliderProps> = ({
  cartProducts,
  bundleDiscounts,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentBundleIndex, setCurrentBundleIndex] = useState(0);

  // Sepetteki ürünlerin bundle'larını hesapla ve tekrar edenleri filtrele
  const uniqueBundleProducts = useMemo(() => {
    const bundleMap = new Map();
    const productMap = new Map(); // Her ürün için sadece bir kez eklemek için

    // Her ürün için bundle'larını bul ve ekle
    cartProducts.forEach((cartItem) => {
      // Eğer bu ürün zaten eklenmişse, atla
      if (productMap.has(cartItem.id)) {
        return;
      }

      const relevantBundles = bundleDiscounts?.filter((discount) => {
        const productIds =
          discount.bundleDiscount?.productIds ||
          (discount.bundleDiscount as any)?.bundleDiscountProducts?.map(
            (p: any) => p.productId
          ) ||
          [];
        return productIds.includes(cartItem.id);
      });

      if (relevantBundles && relevantBundles.length > 0) {
        // Bu ürün için sadece ilk bundle'ı ekle
        const firstBundle = relevantBundles[0];
        const bundleId = firstBundle.bundleDiscount?.id || firstBundle.id;

        const bundleProductIds =
          firstBundle.bundleDiscount?.productIds ||
          (firstBundle.bundleDiscount as any)?.bundleDiscountProducts?.map(
            (p: any) => p.productId
          ) ||
          [];

        bundleMap.set(bundleId, {
          product: cartItem,
          bundle: firstBundle,
          bundleProductIds: bundleProductIds,
        });

        // Bu ürünü eklenmiş olarak işaretle
        productMap.set(cartItem.id, true);
      }
    });

    return Array.from(bundleMap.values());
  }, [cartProducts, bundleDiscounts]);

  const handleProductClick = (bundleData: any) => {
    setSelectedProduct(bundleData);
    setCurrentBundleIndex(0); // Yeni ürün seçildiğinde ilk bundle'a dön
  };

  const handlePrevBundle = () => {
    if (selectedProduct) {
      const allBundlesForProduct = bundleDiscounts?.filter((discount) => {
        const productIds =
          discount.bundleDiscount?.productIds ||
          (discount.bundleDiscount as any)?.bundleDiscountProducts?.map(
            (p: any) => p.productId
          ) ||
          [];
        return productIds.includes(selectedProduct.product.id);
      });

      if (allBundlesForProduct && allBundlesForProduct.length > 0) {
        setCurrentBundleIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
  };

  const handleNextBundle = () => {
    if (selectedProduct) {
      const allBundlesForProduct = bundleDiscounts?.filter((discount) => {
        const productIds =
          discount.bundleDiscount?.productIds ||
          (discount.bundleDiscount as any)?.bundleDiscountProducts?.map(
            (p: any) => p.productId
          ) ||
          [];
        return productIds.includes(selectedProduct.product.id);
      });

      if (allBundlesForProduct && allBundlesForProduct.length > 0) {
        setCurrentBundleIndex((prev) =>
          prev < allBundlesForProduct.length - 1 ? prev + 1 : prev
        );
      }
    }
  };

  if (uniqueBundleProducts.length === 0) {
    return null;
  }

  return (
    <div className="bundle-slider-container">
      {/* Üst Modül - Slider */}
      <div className="bundle-slider mb-3">
        <h5 className="mb-2" style={{ color: "#333", fontWeight: "600" }}>
          Sepetinizdeki Ürünler İçin Bundle Paketleri
        </h5>
        <div className="bundle-slider-wrapper">
          <div className="bundle-slider-track">
            {uniqueBundleProducts.map((bundleData, index) => (
              <div
                key={index}
                className="bundle-slide"
                onClick={() => handleProductClick(bundleData)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #e1e1e1",
                  borderRadius: "8px",
                  padding: "12px",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    selectedProduct?.product?.id === bundleData.product.id
                      ? "#f0f8ff"
                      : "#fff",
                  minWidth: "200px",
                  marginRight: "15px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={
                      bundleData.product.baseImageUrl ||
                      "/assets/images/no-image.jpg"
                    }
                    alt={bundleData.product.title}
                    width={40}
                    height={40}
                    style={{ objectFit: "cover" }}
                    className="rounded border me-2"
                  />
                  <div className="flex-grow-1">
                    <h6
                      className="mb-1 ml-2"
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        lineHeight: "1.3",
                        color: "#333",
                      }}
                    >
                      {bundleData.product.title}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Modül - Seçilen Ürünün Bundle'ları */}
      {selectedProduct && (
        <div className="bundle-details">
          <div className="bundle-details-content">
            <div className="mb-2">
              <div className="d-flex align-items-center">
                <Image
                  src={
                    selectedProduct.product.baseImageUrl ||
                    "/assets/images/no-image.jpg"
                  }
                  alt={selectedProduct.product.title}
                  width={60}
                  height={60}
                  style={{ objectFit: "cover" }}
                  className="rounded border me-3"
                />
                <div>
                  <h6
                    className="mb-1 ml-2"
                    style={{ fontSize: "16px", fontWeight: "600" }}
                  >
                    <strong>{selectedProduct.product.title}</strong> için bundle
                    paketleri:
                  </h6>
                  <p
                    className="text-muted mb-0 ml-2"
                    style={{ fontSize: "14px" }}
                  >
                    Bu ürünle birlikte alınabilecek avantajlı paketler
                  </p>
                </div>
              </div>
            </div>

            <div className="bundle-products-slider">
              {(() => {
                // Seçilen ürünün tüm bundle'larını bul
                const allBundlesForProduct = bundleDiscounts?.filter(
                  (discount) => {
                    const productIds =
                      discount.bundleDiscount?.productIds ||
                      (
                        discount.bundleDiscount as any
                      )?.bundleDiscountProducts?.map((p: any) => p.productId) ||
                      [];
                    return productIds.includes(selectedProduct.product.id);
                  }
                );

                if (
                  !allBundlesForProduct ||
                  allBundlesForProduct.length === 0
                ) {
                  return (
                    <div className="text-center text-muted">
                      Bu ürün için bundle bulunamadı.
                    </div>
                  );
                }

                const currentBundle = allBundlesForProduct[currentBundleIndex];

                return (
                  <div className="bundle-navigation-container">
                    {/* Sol Ok - Her zaman görünür, gerektiğinde disabled */}
                    <button
                      className="bundle-nav-btn bundle-nav-prev"
                      onClick={handlePrevBundle}
                      disabled={
                        currentBundleIndex === 0 ||
                        allBundlesForProduct.length <= 1
                      }
                      title={
                        allBundlesForProduct.length <= 1
                          ? "Tek Bundle"
                          : currentBundleIndex === 0
                          ? "İlk Bundle"
                          : "Önceki Bundle"
                      }
                    >
                      <i className="icon-angle-left"></i>
                    </button>

                    {/* Bundle İçeriği */}
                    <div className="bundle-content">
                      {/* Bundle Dots Indicator - Sadece birden fazla bundle varsa göster */}

                      <BundleProducts
                        bundleDiscounts={[currentBundle.bundleDiscount]}
                        currentProductId={selectedProduct.product.id}
                      />
                      {allBundlesForProduct.length > 1 && (
                        <div className="bundle-dots-indicator">
                          {allBundlesForProduct.map((_, index) => (
                            <button
                              key={index}
                              className={`bundle-dot ${
                                index === currentBundleIndex ? "active" : ""
                              }`}
                              onClick={() => setCurrentBundleIndex(index)}
                              title={`Bundle ${index + 1}`}
                              style={{
                                backgroundColor:
                                  index === currentBundleIndex
                                    ? "#000"
                                    : "#cccccc",
                                width: "8px",
                                height: "8px",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sağ Ok - Her zaman görünür, gerektiğinde disabled */}
                    <button
                      className="bundle-nav-btn bundle-nav-next"
                      onClick={handleNextBundle}
                      disabled={
                        currentBundleIndex ===
                          allBundlesForProduct.length - 1 ||
                        allBundlesForProduct.length <= 1
                      }
                      title={
                        allBundlesForProduct.length <= 1
                          ? "Tek Bundle"
                          : currentBundleIndex ===
                            allBundlesForProduct.length - 1
                          ? "Son Bundle"
                          : "Sonraki Bundle"
                      }
                    >
                      <i className="icon-angle-right"></i>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bundle-slider-container {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
        }

        .bundle-slider-wrapper {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .bundle-slider-track {
          display: flex;
          padding: 5px 0;
        }

        .bundle-slide:hover {
          border-color: rgb(0, 0, 0) !important;
        }

        .bundle-details {
          background: #fff;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #e1e1e1;
        }

        .bundle-details-content {
          max-height: 60vh;
          overflow-y: auto;
        }

        .bundle-products-slider {
          margin-top: 15px;
        }

        .bundle-navigation-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          width: 100%;
          min-height: 60px;
        }

        .bundle-nav-btn {
          background: #ffffff;
          border: 2px solid #e1e1e1;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          z-index: 10;
          color: #333;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .bundle-nav-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: rgb(0, 0, 0);
          color: rgb(0, 0, 0);
        }

        .bundle-nav-btn:disabled {
          opacity: 0.4;
        }

        .bundle-content {
          flex: 1;
          position: relative;
          min-width: 0; /* Flex item'ın shrink olabilmesi için */
        }

        .bundle-dots-indicator {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 0 0 20px 0;
          padding: 10px 0;
        }

        .bundle-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .bundle-dot:hover {
          background: #9ca3af;
          transform: scale(1.1);
        }

        .bundle-dot.active {
          background: rgb(0, 0, 0);
          transform: scale(1.2);
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
        }

        /* Scrollbar styling - sadece üst slider için */
        .bundle-slider-wrapper::-webkit-scrollbar {
          height: 6px;
        }

        .bundle-slider-wrapper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .bundle-slider-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .bundle-slider-wrapper::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default BundleSlider;
