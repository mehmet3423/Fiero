import { BundleDiscount } from "@/constants/models/Discount";
import { Product } from "@/constants/models/Product";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BundleSidebar from "./BundleSidebar";

interface BundleProductsProps {
  bundleDiscounts: BundleDiscount[];
  currentProductId: string;
}

interface SingleBundleProps {
  bundleDiscount: BundleDiscount;
  currentProductId: string;
}

// Tek bir bundle'ı gösteren component
const SingleBundle: React.FC<SingleBundleProps> = ({
  bundleDiscount,
  currentProductId,
}) => {
  const { addToCart } = useCart();
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  // Bundle discount'tan product ID'leri çıkar
  const productIds =
    (bundleDiscount as any).bundleDiscountProducts?.map(
      (p: any) => p.productId
    ) ||
    bundleDiscount.productIds ||
    [];

  const { products, isLoading } = useGetProductListByIds(productIds);

  // Mevcut ürünü ve bundle'daki diğer ürünleri ayır
  const currentProduct = products?.find((p) => p.id === currentProductId);
  const otherProducts =
    products?.filter((p) => p.id !== currentProductId) || [];

  // Toplam original price hesapla
  const totalOriginalPrice =
    products?.reduce((sum, product) => sum + product.price, 0) || 0;

  // Tasarruf miktarı hesapla
  const savings = totalOriginalPrice - (bundleDiscount.bundlePrice || 0);
  const savingsPercentage =
    totalOriginalPrice > 0
      ? Math.round((savings / totalOriginalPrice) * 100)
      : 0;

  const handleAddBundleToCart = async () => {
    // Bundle discount ID'sini bundleDiscountProducts'tan al
    const bundleDiscountId = (bundleDiscount as any).bundleDiscountProducts?.[0]
      ?.bundleDiscountId;

    console.log("SingleBundle - Bundle Discount Debug:", {
      bundleDiscount,
      bundleDiscountId,
      bundleDiscountProducts: (bundleDiscount as any).bundleDiscountProducts,
    });

    if (!bundleDiscountId) {
      toast.error("Bundle ID bulunamadı");
      return;
    }

    setIsAddingBundle(true);
    try {
      // Bundle discount ID'sini itemId olarak gönder
      await addToCart(bundleDiscountId, 1);
      toast.success("Bundle sepete eklendi");
    } catch (error) {
      toast.error("Bundle sepete eklenirken bir hata oluştu");
      console.error("Bundle add error:", error);
    } finally {
      setIsAddingBundle(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bundle-products-loading text-center py-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (
    !products ||
    products.length < 2 ||
    !currentProduct ||
    otherProducts.length === 0
  ) {
    return null;
  }

  return (
    <div className="bundle-products-section mb-5 ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 className="bundle-title text-center mb-4">
              Sıklıkla Birlikte Alınan Ürünler
            </h3>

            <div className="bundle-container bg-light p-4 rounded">
              <div className="bundle-products-wrapper d-flex flex-wrap align-items-center justify-content-center gap-3">
                {/* Mevcut Ürün */}
                <div className="bundle-product-item text-center">
                  <div
                    className="product-image-wrapper mb-2"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <Image
                      src={
                        currentProduct.baseImageUrl ||
                        "/assets/images/no-image.jpg"
                      }
                      alt={currentProduct.title}
                      width={120}
                      height={120}
                      style={{ objectFit: "cover" }}
                      className="rounded border"
                    />
                  </div>
                  <h6
                    className="product-title mb-1"
                    style={{ fontSize: "0.85rem", maxWidth: "120px" }}
                  >
                    <Link
                      href={`/products/${currentProduct.id}`}
                      className="text-decoration-none"
                    >
                      {currentProduct.title.length > 30
                        ? `${currentProduct.title.substring(0, 30)}...`
                        : currentProduct.title}
                    </Link>
                  </h6>
                  <div className="product-price">
                    <span className="price text-primary fw-bold">
                      {currentProduct.price.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                </div>

                {/* Plus İkon */}
                {otherProducts.length > 0 && (
                  <div className="plus-icon mx-2">
                    <i
                      className="fas fa-plus text-muted"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </div>
                )}

                {/* Diğer Bundle Ürünleri */}
                {otherProducts.map((product, index) => (
                  <div key={product.id}>
                    <div className="bundle-product-item text-center">
                      <div
                        className="product-image-wrapper mb-2"
                        style={{ width: "120px", height: "120px" }}
                      >
                        <Image
                          src={
                            product.baseImageUrl ||
                            "/assets/images/no-image.jpg"
                          }
                          alt={product.title}
                          width={120}
                          height={120}
                          style={{ objectFit: "cover" }}
                          className="rounded border"
                        />
                      </div>
                      <h6
                        className="product-title mb-1"
                        style={{ fontSize: "0.85rem", maxWidth: "120px" }}
                      >
                        <Link
                          href={`/products/${product.id}`}
                          className="text-decoration-none"
                        >
                          {product.title.length > 30
                            ? `${product.title.substring(0, 30)}...`
                            : product.title}
                        </Link>
                      </h6>
                      <div className="product-price">
                        <span className="price text-primary fw-bold">
                          {product.price.toLocaleString("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          })}
                        </span>
                      </div>
                    </div>
                    {index < otherProducts.length - 1 && (
                      <div className="plus-icon mx-2">
                        <i
                          className="fas fa-plus text-muted"
                          style={{ fontSize: "1.5rem" }}
                        ></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Fiyat Bilgileri */}
              <div className="bundle-pricing text-center mt-4">
                <div className="pricing-info mb-3">
                  <div className="original-total text-muted">
                    <span className="text-decoration-line-through">
                      Toplam fiyat:{" "}
                      {totalOriginalPrice.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                  </div>
                  <div className="bundle-total">
                    <span className="h4 text-success fw-bold">
                      {(bundleDiscount.bundlePrice || 0).toLocaleString(
                        "tr-TR",
                        {
                          style: "currency",
                          currency: "TRY",
                        }
                      )}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="savings-info">
                      <span className="badge bg-success fs-6">
                        {savings.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}{" "}
                        tasarruf ({savingsPercentage}% indirim)
                      </span>
                    </div>
                  )}
                </div>

                {/* Bundle Sepete Ekle Butonu */}
                <button
                  className="btn btn-primary btn-lg px-4 bg-primary "
                  onClick={handleAddBundleToCart}
                  disabled={isAddingBundle}
                  style={{ minWidth: "250px" }}
                >
                  {isAddingBundle ? (
                    <>
                      <span
                        className="spi nner-border spinner-border-sm me-2 "
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Ekleniyor...
                    </>
                  ) : (
                    <>Bundle sepete ekle</>
                  )}
                </button>

                <div className="bundle-description text-muted mt-2">
                  <small>{bundleDiscount.description}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bundle-products-wrapper {
          min-height: 200px;
        }

        .bundle-product-item {
          transition: transform 0.2s ease;
        }

        .bundle-product-item:hover {
          transform: translateY(-2px);
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .product-image-wrapper img {
          transition: transform 0.3s ease;
        }

        .product-image-wrapper:hover img {
          transform: scale(1.05);
        }

        .plus-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
        }

        @media (max-width: 768px) {
          .bundle-products-wrapper {
            flex-direction: column;
          }

          .plus-icon {
            transform: rotate(90deg);
            margin: 10px 0;
          }
        }

        .bundle-container {
          border: 2px solid #e9ecef;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .product-title a:hover {
          color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
};

// Ana component - birden fazla bundle'ı gösteren
const BundleProducts: React.FC<BundleProductsProps> = ({
  bundleDiscounts,
  currentProductId,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<BundleDiscount | null>(
    null
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!bundleDiscounts || bundleDiscounts.length === 0) {
    return null;
  }

  const handleShowMore = (bundle: BundleDiscount) => {
    setSelectedBundle(bundle);
    setSidebarOpen(true);
  };

  return (
    <div className="bundle-products-section mb-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Bundle Slider */}
            <div className="slider-container">
              <Swiper
                modules={[Navigation]}
                loop={false}
                navigation={{
                  nextEl: ".bundle-next",
                  prevEl: ".bundle-prev",
                  enabled: bundleDiscounts.length > 2,
                }}
                spaceBetween={25}
                slidesPerView={2}
                slidesPerGroup={2}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 20,
                  },
                  992: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 25,
                  },
                }}
                className="bundle-products-slider"
                watchOverflow={true}
                centeredSlides={false}
                allowTouchMove={true}
                rewind={false}
                onSlideChange={(swiper) => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                onReachBeginning={() => setIsBeginning(true)}
                onReachEnd={() => setIsEnd(true)}
                onFromEdge={() => {
                  setIsBeginning(false);
                  setIsEnd(false);
                }}
              >
                {bundleDiscounts.map((bundle, index) => (
                  <SwiperSlide key={bundle.id || `bundle-${index}`}>
                    <BundleCard
                      bundleDiscount={bundle}
                      currentProductId={currentProductId}
                      onShowMore={() => handleShowMore(bundle)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              {bundleDiscounts.length > 2 && (
                <>
                  <button
                    className="bundle-prev"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "-20px",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#333",
                      border: "2px solid #f0f0f0",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      cursor: isBeginning ? "not-allowed" : "pointer",
                      zIndex: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      opacity: isBeginning ? 0.4 : 0.9,
                    }}
                    onMouseOver={(e) => {
                      if (!isBeginning) {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 1)";
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform =
                          "translateY(-50%) scale(1.1)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(0,0,0,0.2)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.95)";
                      e.currentTarget.style.opacity = isBeginning
                        ? "0.4"
                        : "0.9";
                      e.currentTarget.style.transform =
                        "translateY(-50%) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.15)";
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 19L8 12L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    className="bundle-next"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "-20px",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      color: "#333",
                      border: "2px solid #f0f0f0",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      cursor: isEnd ? "not-allowed" : "pointer",
                      zIndex: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      opacity: isEnd ? 0.4 : 0.9,
                    }}
                    onMouseOver={(e) => {
                      if (!isEnd) {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 1)";
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform =
                          "translateY(-50%) scale(1.1)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(0,0,0,0.2)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.95)";
                      e.currentTarget.style.opacity = isEnd ? "0.4" : "0.9";
                      e.currentTarget.style.transform =
                        "translateY(-50%) scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.15)";
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 5L16 12L9 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Sidebar Modal */}
            {sidebarOpen && selectedBundle && (
              <BundleSidebar
                bundleDiscount={selectedBundle}
                currentProductId={currentProductId}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .slider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 0;
          margin: 0 auto;
          max-width: 1200px;
          position: relative;
        }
        .bundle-products-slider {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        .bundle-products-slider {
          display: flex;
          align-items: stretch;
          width: 100%;
          overflow: hidden;
        }
        .bundle-products-slider .swiper-slide {
          height: auto;
          display: flex;
          align-items: stretch;
          flex-shrink: 0;
          width: calc(50% - 12.5px) !important;
        }
        .bundle-products-slider .swiper-slide > div {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        @media (max-width: 767px) {
          .bundle-products-slider .swiper-slide {
            width: 100% !important;
            overflow: visible;
          }
          .bundle-products-slider .swiper-slide > div {
            margin: 0 auto;
            padding: 15px 8px;
            max-width: calc(100vw - 50px);
            box-sizing: border-box;
          }
          .bundle-products-row {
            padding: 10px 0 !important;
            justify-content: space-between !important;
            gap: 0.1rem !important;
            flex-wrap: nowrap !important;
          }
          .bundle-products-row img {
            width: 50px !important;
            height: 50px !important;
          }
          .bundle-products-row > div > div:first-child {
            min-width: 50px !important;
            max-width: 50px !important;
          }
          .bundle-products-row .text-dark {
            font-size: 8px !important;
            height: 20px !important;
            width: 50px !important;
            line-height: 1.1 !important;
          }
          .bundle-products-row .mx-2 {
            font-size: 12px !important;
            margin: 0 2px !important;
          }
          .bundle-products-row .cursor-pointer > div {
            width: 45px !important;
            height: 45px !important;
            font-size: 10px !important;
          }
          .bundle-products-row .cursor-pointer small {
            font-size: 7px !important;
          }
          .bundle-products-row .cursor-pointer {
            min-width: 45px !important;
            max-width: 45px !important;
          }
          .bundle-product-item {
            min-width: 50px !important;
            max-width: 50px !important;
          }
          .bundle-products-slider .swiper-slide > div {
            max-width: 100% !important;
          }
          .bundle-products-slider .bg-light .d-flex span {
            font-size: 11px !important;
          }
          .bundle-products-slider .bg-light .d-flex span.fw-bold {
            font-size: 13px !important;
          }
        }

        /* Desktop için normal boyutlar */
        @media (min-width: 768px) {
          .bundle-products-row {
            justify-content: center !important;
            gap: 0.5rem !important;
          }
          .bundle-products-row img {
            width: 90px !important;
            height: 90px !important;
          }
          .bundle-products-row > div > div:first-child {
            min-width: 90px !important;
          }
          .bundle-products-row .text-dark {
            font-size: 13px !important;
            height: 32px !important;
            width: 100px !important;
          }
          .bundle-products-row .mx-2 {
            font-size: 16px !important;
            margin: 0 8px !important;
          }
          .bundle-products-row .cursor-pointer > div {
            width: 90px !important;
            height: 90px !important;
            font-size: 18px !important;
          }
          .bundle-products-row .cursor-pointer small {
            font-size: 12px !important;
          }
          .bundle-product-item {
            min-width: 90px !important;
            max-width: 90px !important;
          }
        }
        @media (max-width: 768px) {
          .slider-container {
            padding: 0 15px;
            margin: 0 auto;
            max-width: 100%;
            overflow: visible;
          }
          .bundle-prev,
          .bundle-next {
            width: 40px !important;
            height: 40px !important;
          }
          .bundle-prev {
            left: -10px !important;
          }
          .bundle-next {
            right: -10px !important;
          }
        }
      `}</style>
    </div>
  );
};

// Tek bundle kartı component'i
const BundleCard: React.FC<{
  bundleDiscount: BundleDiscount;
  currentProductId: string;
  onShowMore: () => void;
}> = ({ bundleDiscount, currentProductId, onShowMore }) => {
  const { addToCart } = useCart();
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  // Bundle discount'tan product ID'leri çıkar
  const productIds =
    (bundleDiscount as any).bundleDiscountProducts?.map(
      (p: any) => p.productId
    ) ||
    bundleDiscount.productIds ||
    [];

  const { products, isLoading } = useGetProductListByIds(productIds);

  // Mevcut ürünü ve bundle'daki diğer ürünleri ayır
  const currentProduct = products?.find((p) => p.id === currentProductId);
  const otherProducts =
    products?.filter((p) => p.id !== currentProductId) || [];

  // Maksimum 3 diğer ürün göster (toplam 4 ürün olacak)
  const visibleProducts = otherProducts.slice(0, 2);
  const remainingCount = otherProducts.length - 2;

  // Toplam original price hesapla
  const totalOriginalPrice =
    products?.reduce((sum, product) => sum + product.price, 0) || 0;

  // Tasarruf miktarı hesapla
  const savings = totalOriginalPrice - (bundleDiscount.bundlePrice || 0);

  const handleAddBundleToCart = async (e: React.MouseEvent) => {
    // Event propagation'ı durdur ki card'a tıklanmış sayılmasın
    e.stopPropagation();

    // Bundle discount ID'sini bundleDiscountProducts'tan al
    const bundleDiscountId = (bundleDiscount as any).bundleDiscountProducts?.[0]
      ?.bundleDiscountId;

    if (!bundleDiscountId) {
      toast.error("Bundle ID bulunamadı");
      return;
    }

    setIsAddingBundle(true);
    try {
      // Bundle discount ID'sini itemId olarak gönder
      await addToCart(bundleDiscountId, 1);
      toast.success("Bundle sepete eklendi");
    } catch (error) {
      toast.error("Bundle sepete eklenirken bir hata oluştu");
      console.error("Bundle add error:", error);
    } finally {
      setIsAddingBundle(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="bundle-card-loading"
        style={{ minWidth: "300px", height: "200px" }}
      >
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  if (
    !products ||
    products.length < 2 ||
    !currentProduct ||
    otherProducts.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="bg-white border rounded-3 p-4 shadow-sm position-relative h-100 bundle-card-container"
      style={{
        width: "100%",
        flexShrink: 0,
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={onShowMore}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      {/* Ürünler */}
      <div
        className="d-flex align-items-center justify-content-center gap-1 mb-3 flex-nowrap bundle-products-row"
        style={{ padding: "15px 0" }}
      >
        {/* Mevcut Ürün */}
        <div
          className="d-flex flex-column align-items-center text-center bundle-product-item"
          style={{ minWidth: "90px", flexShrink: 0 }}
        >
          <div className="position-relative mb-2">
            <Image
              src={currentProduct.baseImageUrl || "/assets/images/no-image.jpg"}
              alt={currentProduct.title}
              width={90}
              height={90}
              style={{ objectFit: "cover" }}
              className="rounded-2 border-2 border-success"
            />
          </div>
          <div
            className="text-dark fw-medium"
            style={{
              fontSize: "13px",
              lineHeight: "1.3",
              height: "32px",
              overflow: "hidden",
              width: "100px",
            }}
          >
            {currentProduct.title.length > 20
              ? `${currentProduct.title.substring(0, 20)}...`
              : currentProduct.title}
          </div>
        </div>

        {/* Plus İkon */}
        <div
          className="mx-2 text-muted"
          style={{ fontSize: "16px", flexShrink: 0, fontWeight: "900" }}
        >
          +
        </div>

        {/* Görünür Diğer Ürünler */}
        {visibleProducts.map((product, index) => (
          <div key={product.id} className="d-flex align-items-center">
            <div
              className="d-flex flex-column align-items-center text-center bundle-product-item"
              style={{ minWidth: "90px", flexShrink: 0 }}
            >
              <div className="mb-2">
                <Image
                  src={product.baseImageUrl || "/assets/images/no-image.jpg"}
                  alt={product.title}
                  width={90}
                  height={90}
                  style={{ objectFit: "cover" }}
                  className="rounded-2 border-2 border-light"
                />
              </div>
              <div
                className="text-dark fw-medium"
                style={{
                  fontSize: "13px",
                  lineHeight: "1.3",
                  height: "32px",
                  overflow: "hidden",
                  width: "100px",
                }}
              >
                {product.title.length > 20
                  ? `${product.title.substring(0, 20)}...`
                  : product.title}
              </div>
            </div>
            {index < visibleProducts.length - 1 && (
              <div
                className="mx-2 text-muted"
                style={{
                  fontSize: "16px",
                  flexShrink: 0,
                  fontWeight: "900",
                }}
              >
                +
              </div>
            )}
          </div>
        ))}

        {/* Kalan ürün sayısını göster */}
        {remainingCount > 0 && (
          <>
            <div
              className="mx-2 text-muted"
              style={{ fontSize: "16px", flexShrink: 0, fontWeight: "900" }}
            >
              +
            </div>
            <div
              className="d-flex flex-column align-items-center text-center bundle-product-item"
              style={{ minWidth: "90px", flexShrink: 0 }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-2 border-2 border-dashed border-primary bg-light mb-2"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "18px",
                }}
              >
                <span className="fw-bold text-primary">+{remainingCount}</span>
              </div>
              <small className="text-muted fw-medium">Daha fazla</small>
            </div>
          </>
        )}
      </div>

      {/* Fiyat Bilgisi */}
      <div className="text-center p-2 bg-light rounded-2 mb-2">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
          <span
            className="text-muted mr-3"
            style={{
              fontSize: "13px",
              textDecoration: "line-through",
            }}
          >
            {totalOriginalPrice.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </span>
          <span className="text-success fw-bold" style={{ fontSize: "16px" }}>
            {(bundleDiscount.bundlePrice || 0).toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </span>
        </div>
        {savings > 0 && (
          <div className="text-success fw-medium" style={{ fontSize: "12px" }}>
            {savings.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}{" "}
            tasarruf
          </div>
        )}
      </div>

      {/* Sepete Ekle Butonu */}
      <button
        className="btn btn-primary w-100 py-2"
        onClick={handleAddBundleToCart}
        disabled={isAddingBundle}
        style={{ fontSize: "14px" }}
      >
        {isAddingBundle ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            Ekleniyor...
          </>
        ) : (
          <>
            <i className="fas fa-shopping-cart me-2"></i>
            Bundle sepete ekle
          </>
        )}
      </button>
    </div>
  );
};

export default BundleProducts;
