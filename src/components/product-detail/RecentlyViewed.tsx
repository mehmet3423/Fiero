"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import QuickView from "../product/QuickView";

import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLanguage } from "@/context/LanguageContext";

// Dummy data: Görseller ve başlıklar, mevcut markup ile eşleştirildi
const recentProducts = [
  {
    id: "rv-1",
    title: "Loose Fit Sweatshirt",
    price: 10.0,
    discountedPrice: 10.0,
    baseImageUrl: "/assets/site/images/products/light-green-1.jpg",
    contentImageUrls: ["/assets/site/images/products/light-green-2.jpg"],
    colorSwatches: [
      {
        name: "Light Green",
        colorClass: "bg_light-green",
        img: "/assets/site/images/products/light-green-1.jpg",
      },
      {
        name: "Black",
        colorClass: "bg_dark",
        img: "/assets/site/images/products/black-3.jpg",
      },
      {
        name: "Blue",
        colorClass: "bg_blue-2",
        img: "/assets/site/images/products/blue.jpg",
      },
    ],
  },
  {
    id: "rv-2",
    title: "V-neck linen T-shirt",
    price: 114.95,
    discountedPrice: 114.95,
    baseImageUrl: "/assets/site/images/products/brown-2.jpg",
    contentImageUrls: ["/assets/site/images/products/brown-3.jpg"],
    colorSwatches: [
      {
        name: "Brown",
        colorClass: "bg_brown",
        img: "/assets/site/images/products/brown-2.jpg",
      },
      {
        name: "White",
        colorClass: "bg_white",
        img: "/assets/site/images/products/white-5.jpg",
      },
    ],
  },
  {
    id: "rv-3",
    title: "Oversized Printed T-shirt",
    price: 16.95,
    discountedPrice: 16.95,
    baseImageUrl: "/assets/site/images/products/white-2.jpg",
    contentImageUrls: ["/assets/site/images/products/pink-1.jpg"],
    colorSwatches: [
      {
        name: "White",
        colorClass: "bg_white",
        img: "/assets/site/images/products/white-2.jpg",
      },
      {
        name: "Pink",
        colorClass: "bg_pink",
        img: "/assets/site/images/products/pink-1.jpg",
      },
      {
        name: "Black",
        colorClass: "bg_dark",
        img: "/assets/site/images/products/black-2.jpg",
      },
    ],
  },
  {
    id: "rv-4",
    title: "Oversized Printed T-shirt",
    price: 10.0,
    discountedPrice: 10.0,
    baseImageUrl: "/assets/site/images/products/white-3.jpg",
    contentImageUrls: ["/assets/site/images/products/white-4.jpg"],
    colorSwatches: [
      {
        name: "White",
        colorClass: "bg_white",
        img: "/assets/site/images/products/white-3.jpg",
      },
      {
        name: "Black",
        colorClass: "bg_dark",
        img: "/assets/site/images/products/black-1.jpg",
      },
    ],
  },
];

const RecentlyViewed: React.FC = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const {
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();

  // ProductCard ile aynı Quick View state ve fonksiyonu
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  // ProductCard ile aynı Compare mantığı
  const handleCompare = (productId: string) => {
    if (typeof window !== "undefined") {
      const key = "compareProducts";
      let compareList: string[] = [];
      try {
        const stored = localStorage.getItem(key);
        if (stored) compareList = JSON.parse(stored);
        if (!compareList.includes(productId)) {
          compareList.push(productId);
          localStorage.setItem(key, JSON.stringify(compareList));
        }
      } catch {
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

  useEffect(() => {
    const instance = new Swiper(".tf-sw-recent", {
      slidesPerView: 4,
      spaceBetween: 30,
      navigation: {
        nextEl: ".nav-next-recent",
        prevEl: ".nav-prev-recent",
      },
      pagination: {
        el: ".sw-pagination-recent",
        clickable: true,
      },
      breakpoints: {
        1024: { slidesPerView: 4, spaceBetween: 30 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        480: { slidesPerView: 2, spaceBetween: 10 },
        320: { slidesPerView: 2, spaceBetween: 8 },
      },
    });
    return () => {
      try {
        // hot-reload/çıkışta tekrar init olmasını önlemek için
        // @ts-ignore
        instance?.destroy?.(true, true);
      } catch { }
    };
  }, []);

  return (
    <section className="flat-spacing-4 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">{t("recentlyViewed.title")}</span>
        </div>

        <div className="hover-sw-nav hover-sw-2">
          <div className="swiper tf-sw-recent wrap-sw-over">
            <div className="swiper-wrapper">
              {recentProducts.map((product) => (
                <div className="swiper-slide" key={product.id}>
                  <div className="card-product">
                    <div className="card-product-wrapper">
                      <Link href={`/products/${product.id}`} className="product-img">
                        <img
                          className="img-product"
                          src={product.baseImageUrl}
                          alt="product"
                        />
                        {product.contentImageUrls?.[0] && (
                          <img
                            className="img-hover"
                            src={product.contentImageUrls[0]}
                            alt="product hover"
                          />
                        )}
                      </Link>

                      <div className="list-product-btn">
                        {/* Quick Add -> sepete ekle */}
                        <a
                          href="#"
                          className="box-icon bg_white quick-add tf-btn-loading"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product.id);
                          }}
                        >
                          <span className="icon icon-bag"></span>
                          <span className="tooltip">{t("recentlyViewed.buttons.quickAdd")}</span>
                        </a>

                        {/* Wishlist -> useFavorites toggle */}
                        <a
                          href="#"
                          className={`box-icon bg_white wishlist btn-icon-action ${isInFavorites(product.id) ? "added" : ""
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleFavorite(product.id);
                          }}
                          title={
                            isInFavorites(product.id)
                              ? t("recentlyViewed.buttons.removeFromWishlist")
                              : t("recentlyViewed.buttons.addToWishlist")
                          }
                        >
                          <span className="icon icon-heart"></span>
                          <span className="tooltip">
                            {isInFavorites(product.id)
                              ? t("recentlyViewed.buttons.removeFromWishlist")
                              : t("recentlyViewed.buttons.addToWishlist")}
                          </span>
                          <span className="icon icon-delete"></span>
                        </a>

                        {/* Compare -> localStorage + redirect */}
                        <a
                          href="#"
                          className="box-icon bg_white compare btn-icon-action"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCompare(product.id);
                          }}
                          title="Add to Compare"
                        >
                          <span className="icon icon-compare"></span>
                          <span className="tooltip">{t("recentlyViewed.buttons.addToCompare")}</span>
                          <span className="icon icon-check"></span>
                        </a>

                        {/* Quick View -> modal aç */}
                        <a
                          href="#"
                          className="box-icon bg_white quickview tf-btn-loading"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickView(product);
                          }}
                          title="Quick View"
                        >
                          <span className="icon icon-view"></span>
                          <span className="tooltip">{t("recentlyViewed.buttons.quickView")}</span>
                        </a>
                      </div>
                    </div>

                    <div className="card-product-info">
                      <Link href={`/products/${product.id}`} className="title link">
                        {product.title}
                      </Link>
                      <span className="price">
                        {`$${product.discountedPrice.toFixed(2)}`}
                      </span>

                      <ul className="list-color-product">
                        {product.colorSwatches.map((sw, i) => (
                          <li
                            key={`${product.id}-${sw.name}`}
                            className={`list-color-item color-swatch${i === 0 ? " active" : ""
                              }`}
                          >
                            <span className="tooltip">{sw.name}</span>
                            <span className={`swatch-value ${sw.colorClass}`}></span>
                            <img
                              className="img-product"
                              src={sw.img}
                              alt="color swatch"
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round">
            <span className="icon icon-arrow-left"></span>
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round">
            <span className="icon icon-arrow-right"></span>
          </div>
          <div className="sw-dots style-2 sw-pagination-recent justify-content-center"></div>
        </div>
      </div>

      {/* ProductCard ile aynı Quick View modal akışı */}
      {selectedProduct && (
        <QuickView
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default RecentlyViewed;
