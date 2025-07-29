import QuickView from "@/components/product/QuickView";
import { Product } from "@/constants/models/Product";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import DiscountBadge from "../product/DiscountBadge";

interface FeaturedProductsProps {
  productHeader: string;
  productIds: string[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  productHeader,
  productIds,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

  const {
    addToFavorites,
    isInFavorites,
    removeFromFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();

  const { products, isLoading } = useGetProductListByIds(productIds);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleToggleFavorite = async (productId: string) => {
    if (isInFavorites(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-5">
      <div className="heading heading-center mb-3 mt-3">
        <h2 className="title">{productHeader}</h2>
      </div>

      <hr className="mb-4" />

      <div className="slider-container">
        <Swiper
          modules={[Navigation]}
          loop={true}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          spaceBetween={20}
          breakpoints={{
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="featured-products-slider"
        >
          {products.map((product: Product) => {
            // Check if there's an active discount using new discountDTO structure
            const hasDiscount = product.discountDTO !== null;

            // Badge sadece percentage discount için gösterilir
            const isPercentageDiscount =
              hasDiscount &&
              (product.discountDTO as any)?.discountValueType === 1;
            const discountPercentage = isPercentageDiscount
              ? product.discountDTO.discountValue
              : null;

            // Fixed discount check
            const isFixedDiscount =
              hasDiscount &&
              (product.discountDTO as any)?.discountValueType === 2;

            return (
              <SwiperSlide key={product.id}>
                <div className="product product-7">
                  <figure className="product-media">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={
                          product.baseImageUrl ||
                          "/assets/images/products/no-image.jpg"
                        }
                        alt={`Detayları görüntüle: - ${product.title}`}
                        title={`Detayları görüntüle: - ${product.title}`}
                        className="product-image"
                        width={280}
                        height={280}
                        unoptimized
                      />
                      {product.contentImageUrls[0] && (
                        <Image
                          src={product.contentImageUrls[0]}
                          alt={product.title}
                          className="product-image-hover"
                          width={280}
                          height={280}
                          unoptimized
                        />
                      )}
                    </Link>

                    {isPercentageDiscount && (
                      <DiscountBadge percentage={discountPercentage} />
                    )}

                    <div className="product-action-vertical">
                      <button
                        className={`btn-product-icon border-0 btn-wishlist btn-expandable ${
                          isInFavorites(product.id) ? "added" : ""
                        }`}
                        onClick={() => handleToggleFavorite(product.id)}
                        disabled={isFavoritesLoading}
                        style={{ fontSize: "2rem", padding: "1rem" }}
                      >
                        <span>
                          {isFavoritesLoading
                            ? "İşleniyor..."
                            : isInFavorites(product.id)
                            ? "Favorilerden Çıkar"
                            : "Favorilere Ekle"}
                        </span>
                      </button>
                      <button
                        className={`btn-product-icon border-0 btn-quickview btn-expandable`}
                        title="Hızlı Görünüm"
                        onClick={() => handleQuickView(product)}
                        style={{ fontSize: "2rem", padding: "1rem" }}
                      >
                        <span>Hızlı Görünüm</span>
                      </button>
                    </div>

                    <div className="product-action">
                      <button
                        className="btn-product btn-cart border-0"
                        onClick={() => addToCart(product.id)}
                      >
                        <span>Sepete Ekle</span>
                      </button>
                    </div>
                  </figure>

                  <div className="product-body">
                    <h3
                      className="product-title"
                      style={{
                        height: "40px",
                        overflow: "hidden",
                        marginBottom: "10px",
                      }}
                    >
                      <Link href={`/products/${product.id}`}>
                        {product.title}
                      </Link>
                    </h3>
                    <div
                      className="product-price"
                      style={{ minHeight: "30px" }}
                    >
                      {hasDiscount &&
                      product.price !== product.discountedPrice ? (
                        <>
                          <span
                            className="old-price"
                            style={{
                              textDecoration: "line-through",
                              fontSize: "1.3rem",
                              color: "#999999",
                            }}
                          >
                            {product.price.toFixed(2)}₺
                          </span>
                          <span
                            className="new-price"
                            style={{ color: "black", fontSize: "1.6rem" }}
                          >
                            {product.discountedPrice.toFixed(2)}₺
                          </span>
                        </>
                      ) : (
                        <span>{product.price.toFixed(2)}₺</span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Özel Ok Butonları */}
        <button
          className="custom-prev"
          style={{
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#333",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            opacity: 0.8,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.opacity = "0.8";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
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
          className="custom-next"
          style={{
            position: "absolute",
            top: "50%",
            right: "0",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#333",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            opacity: 0.8,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.opacity = "0.8";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
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
      </div>

      <div className="more-container text-center mt-4">
        <Link href="/products" className="btn btn-outline-primary-2">
          <span>TÜM ÜRÜNLERİ GÖR</span>
        </Link>
      </div>
      <hr className="mb-4" />
      {/* asd */}
      {selectedProduct && (
        <QuickView
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          product={selectedProduct}
        />
      )}

      <style jsx global>{`
        .slider-container {
          position: relative;
          padding: 0 40px;
        }
        .featured-products-slider {
          position: relative;
        }

        .product-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .product-media {
          position: relative;
          width: 100%;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          margin-bottom: 1rem;
        }
        .product-image,
        .product-image-hover {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          position: absolute;
          top: 0;
          left: 0;
        }
        .product-body {
          padding: 1rem;
        }
        .product {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default FeaturedProducts;
