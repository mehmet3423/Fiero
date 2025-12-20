"use client";

import Link from "next/link";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useState, useMemo } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import QuickView from "../product/QuickView";
import { useLanguage } from "@/context/LanguageContext";
import { useProductsByCategory } from "@/hooks/services/products/useProductsByCategory";
import { Product } from "@/constants/models/Product";
import toast from "react-hot-toast";

interface PeopleAlsoBoughtProps {
  categoryId?: string;
  currentProductId?: string;
}

const PeopleAlsoBought: React.FC<PeopleAlsoBoughtProps> = ({
  categoryId,
  currentProductId,
}) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const {
    addToFavorites,
    isInFavorites,
    removeFromFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();

  // Kategoriye göre ürünleri çek
  const { products, isLoading } = useProductsByCategory(categoryId, {
    page: 0,
    pageSize: 12,
    enabled: !!categoryId,
  });

  // Mevcut ürünü listeden çıkar ve maksimum 8 ürün göster
  const filteredProducts = useMemo(() => {
    if (!products?.items) return [];
    return products.items
      .filter((product: Product) => product.id !== currentProductId)
      .slice(0, 8);
  }, [products?.items, currentProductId]);

  // ProductCard ile aynı mantıkta Quick View state'leri
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  // ProductCard ile aynı mantıkta Compare
  const handleCompare = (productId: string) => {
    if (typeof window !== "undefined") {
      const key = "compareProducts";
      let compareList: string[] = [];
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          compareList = JSON.parse(stored);
        }
        if (!compareList.includes(productId)) {
          compareList.push(productId);
          localStorage.setItem(key, JSON.stringify(compareList));
        }
      } catch (e) {
        // ignore
      }
      window.location.href = "/compare-products";
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (isInFavorites(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
    } catch (error) {
      toast.error(t("productCard.addToCartError"));
    }
  };

  // Eğer kategori yoksa bileşeni gösterme
  if (!categoryId) {
    return null;
  }

  // Yükleme tamamlandıktan sonra ürün yoksa bileşeni gösterme
  if (!isLoading && filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="flat-spacing-1 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">{t("peopleAlsoBought.title")}</span>
        </div>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="hover-sw-nav hover-sw-2">
            <div className="swiper tf-sw-product-sell wrap-sw-over">
              <Swiper
                modules={[Navigation]}
                loop={filteredProducts.length > 4}
                navigation={{
                  nextEl: ".nav-next-product",
                  prevEl: ".nav-prev-product",
                }}
                spaceBetween={30}
                breakpoints={{
                  320: { slidesPerView: 2, spaceBetween: 8 },
                  480: { slidesPerView: 2, spaceBetween: 10 },
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="swiper-wrapper"
                style={{ display: "flex", alignItems: "stretch" }}
                wrapperClass="d-flex align-items-stretch"
              >
                {filteredProducts.map((product: Product) => {
                  const hasDiscount = product.discountResponse !== null;
                  const isPercentageDiscount =
                    hasDiscount &&
                    (product.discountResponse as any)?.discountValueType === 1;
                  const discountPercentage = isPercentageDiscount
                    ? product.discountResponse?.discountValue
                    : null;
                  const isOutOfStock =
                    !product.isAvailable ||
                    (product.sellableQuantity ?? 0) <= 0;

                  // Language-aware title
                  const titleToShow =
                    language === "en" && product.titleEn
                      ? product.titleEn
                      : product.title;

                  // Language-aware image URLs
                  const baseImageSrc =
                    !product.baseImageUrl || product.baseImageUrl === "no_url"
                      ? "/assets/images/products/no-image.jpg"
                      : language === "en" && product.baseImageUrlEn
                      ? product.baseImageUrlEn
                      : product.baseImageUrl;

                  const contentImageUrl =
                    product.contentImageUrls && product.contentImageUrls.length > 0
                      ? language === "en" &&
                        product.contentImageUrlsEn &&
                        product.contentImageUrlsEn.length > 0
                        ? product.contentImageUrlsEn[0]
                        : product.contentImageUrls[0]
                      : null;

                  return (
                    <SwiperSlide
                      key={product.id}
                      className="swiper-slide d-flex"
                      style={{ height: "auto" }}
                    >
                      <div
                        className="card-product d-flex flex-column w-100"
                        style={{ height: "100%" }}
                      >
                        <div className="card-product-wrapper flex-fill d-flex flex-column">
                          <Link
                            href={`/products/${product.id}`}
                            className="product-img"
                          >
                            {isOutOfStock && (
                              <span className="stock-badge">
                                {t("productDetailComponent.buttons.outOfStock")}
                              </span>
                            )}
                            <img
                              className="lazyload img-product"
                              data-src={baseImageSrc}
                              src={baseImageSrc}
                              alt={titleToShow}
                              title={titleToShow}
                            />
                            {contentImageUrl && (
                              <img
                                className="lazyload img-hover"
                                data-src={contentImageUrl}
                                src={contentImageUrl}
                                alt={titleToShow}
                                title={titleToShow}
                              />
                            )}
                          </Link>

                          <div className="list-product-btn pt-6">
                            <a
                              href="#"
                              className={`box-icon bg_white quick-add tf-btn-loading${
                                isOutOfStock ? " disabled" : ""
                              }`}
                              title={
                                isOutOfStock
                                  ? t("productDetailComponent.buttons.outOfStock")
                                  : t("productCard.lowerAddCart")
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                if (isOutOfStock) {
                                  toast.error(
                                    t("productDetailComponent.buttons.outOfStock")
                                  );
                                  return;
                                }
                                handleAddToCart(product.id);
                              }}
                              aria-disabled={isOutOfStock}
                            >
                              <span className="icon icon-bag"></span>
                              <span className="tooltip">
                                {t("productCard.lowerAddCart")}
                              </span>
                            </a>

                            <a
                              href="#"
                              className={`box-icon wishlist bg_white btn-icon-action${
                                isInFavorites(product.id) ? " active" : ""
                              }`}
                              title={
                                isInFavorites(product.id)
                                  ? t("productCard.removeFromFavorites")
                                  : t("productCard.addToFavorites")
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                handleToggleFavorite(product.id);
                              }}
                            >
                              <span className="icon icon-heart"></span>
                              <span className="tooltip">
                                {isInFavorites(product.id)
                                  ? t("productCard.removeFromFavorites")
                                  : t("productCard.addToFavorites")}
                              </span>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="#000000ff"
                              >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </a>

                            <a
                              href="#"
                              className="box-icon bg_white compare btn-icon-action"
                              title={t("productCard.compare")}
                              onClick={(e) => {
                                e.preventDefault();
                                handleCompare(product.id);
                              }}
                            >
                              <span className="icon icon-compare"></span>
                              <span className="tooltip">
                                {t("productCard.compare")}
                              </span>
                              <span className="icon icon-check"></span>
                            </a>

                            <a
                              href="#"
                              className="box-icon bg_white quickview tf-btn-loading"
                              title={t("productCard.quickView")}
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuickView(product);
                              }}
                            >
                              <span className="icon icon-view"></span>
                              <span className="tooltip">
                                {t("productCard.quickView")}
                              </span>
                            </a>
                          </div>

                          {isPercentageDiscount && (
                            <div className="on-sale-wrap">
                              <div className="on-sale-item">
                                -{discountPercentage}%
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="card-product-info mt-auto">
                          <Link
                            href={`/products/${product.id}`}
                            className="title link d-block text-truncate"
                            style={{
                              height: "2.4em",
                              overflow: "hidden",
                              lineHeight: "1.2em",
                              marginBottom: "8px",
                            }}
                          >
                            {titleToShow}
                          </Link>

                          <span className="price">
                            {hasDiscount &&
                            product.price !== product.discountedPrice
                              ? `From ${product.discountedPrice.toFixed(2)}₺`
                              : `${product.price.toFixed(2)}₺`}
                          </span>

                          <ul className="list-color-product">
                            <li className="list-color-item color-swatch active">
                              <span className="tooltip">
                                {t("productCard.default")}
                              </span>
                              <span className="swatch-value bg_orange-3"></span>
                              <img
                                className="lazyload"
                                data-src={baseImageSrc}
                                src={baseImageSrc}
                                alt={titleToShow}
                                title={titleToShow}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            <div className="nav-sw nav-prev-slider nav-next-product box-icon w_46 round">
              <span className="icon icon-arrow-right"></span>
            </div>
            <div className="nav-sw nav-next-slider nav-prev-product box-icon w_46 round">
              <span className="icon icon-arrow-left"></span>
            </div>
            <div className="sw-dots style-2 sw-pagination-product justify-content-center"></div>
          </div>
        )}
      </div>

      {/* Quick View modal */}
      {selectedProduct && (
        <QuickView
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          product={selectedProduct}
        />
      )}

      <style jsx>{`
        .card-product .product-img {
          position: relative;
        }

        .stock-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
          z-index: 2;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </section>
  );
};

export default PeopleAlsoBought;
