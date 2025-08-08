"use client";

import Link from "next/link";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import QuickView from "../product/QuickView"; // Quick View modal

// Dummy product data (replace with real data as needed)
const products = [
  {
    id: "1",
    title: "Ribbed Tank Top",
    price: 16.95,
    discountedPrice: 16.95,
    baseImageUrl: "/assets/site/images/products/orange-1.jpg",
    contentImageUrls: ["/assets/site/images/products/white-1.jpg"],
    colorSwatches: [
      { name: "Orange", colorClass: "bg_orange-3", img: "/assets/site/images/products/orange-1.jpg" },
      { name: "Black", colorClass: "bg_dark", img: "/assets/site/images/products/black-1.jpg" },
      { name: "White", colorClass: "bg_white", img: "/assets/site/images/products/white-1.jpg" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    title: "Ribbed Modal T-shirt",
    price: 18.95,
    discountedPrice: 18.95,
    baseImageUrl: "/assets/site/images/products/brown.jpg",
    contentImageUrls: ["/assets/site/images/products/purple.jpg"],
    colorSwatches: [
      { name: "Brown", colorClass: "bg_brown", img: "/assets/site/images/products/brown.jpg" },
      { name: "Purple", colorClass: "bg_purple", img: "/assets/site/images/products/purple.jpg" },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "3",
    title: "Oversized Printed T-shirt",
    price: 10.0,
    discountedPrice: 10.0,
    baseImageUrl: "/assets/site/images/products/white-3.jpg",
    contentImageUrls: ["/assets/site/images/products/white-4.jpg"],
    colorSwatches: [
      { name: "White", colorClass: "bg_white", img: "/assets/site/images/products/white-3.jpg" },
      { name: "Black", colorClass: "bg_dark", img: "/assets/site/images/products/black-1.jpg" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "4",
    title: "Oversized Printed T-shirt",
    price: 16.95,
    discountedPrice: 16.95,
    baseImageUrl: "/assets/site/images/products/white-2.jpg",
    contentImageUrls: ["/assets/site/images/products/pink-1.jpg"],
    colorSwatches: [
      { name: "White", colorClass: "bg_white", img: "/assets/site/images/products/white-2.jpg" },
      { name: "Pink", colorClass: "bg_pink", img: "/assets/site/images/products/pink-1.jpg" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
];

const PeopleAlsoBought: React.FC = () => {
  const { addToCart } = useCart();

  const {
    addToFavorites,
    isInFavorites,
    removeFromFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();

  // ProductCard ile aynı mantıkta Quick View state'leri
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleQuickView = (product: any) => {
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

  return (
    <section className="flat-spacing-1 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">Benzer ürünler</span>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <div className="swiper tf-sw-product-sell wrap-sw-over">
            <Swiper
              modules={[Navigation]}
              loop={true}
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
              {products.map((product) => (
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
                        <img
                          className="img-product"
                          src={product.baseImageUrl}
                          alt="product"
                        />
                        {product.contentImageUrls &&
                          product.contentImageUrls[0] && (
                            <img
                              className="img-hover"
                              src={product.contentImageUrls[0]}
                              alt="product hover"
                            />
                          )}
                      </Link>

                      <div className="list-product-btn">
                        <a
                          href="#"
                          className="box-icon bg_white quick-add tf-btn-loading"
                          title="Quick Add"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product.id);
                          }}
                        >
                          <span className="icon icon-bag"></span>
                          <span className="tooltip">Quick Add</span>
                        </a>

                        <a
                          href="#"
                          className={`box-icon bg_white wishlist btn-icon-action ${
                            isInFavorites(product.id) ? "added" : ""
                          }`}
                          title={
                            isInFavorites(product.id)
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleFavorite(product.id);
                          }}
                        >
                          <span className="icon icon-heart"></span>
                          <span className="tooltip">
                            {isInFavorites(product.id)
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"}
                          </span>
                          <span className="icon icon-delete"></span>
                        </a>

                        {/* ProductCard ile aynı Compare mantığı */}
                        <a
                          href="#"
                          className="box-icon bg_white compare btn-icon-action"
                          title="Add to Compare"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCompare(product.id);
                          }}
                        >
                          <span className="icon icon-compare"></span>
                          <span className="tooltip">Add to Compare</span>
                          <span className="icon icon-check"></span>
                        </a>

                        {/* ProductCard ile aynı Quick View mantığı */}
                        <a
                          href="#"
                          className="box-icon bg_white quickview tf-btn-loading"
                          title="Quick View"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickView(product);
                          }}
                        >
                          <span className="icon icon-view"></span>
                          <span className="tooltip">Quick View</span>
                        </a>
                      </div>

                      <div className="size-list">
                        {product.sizes.map((size) => (
                          <span key={size}>{size}</span>
                        ))}
                      </div>
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
                        {product.title}
                      </Link>

                      <span className="price">
                        {product.discountedPrice !== product.price
                          ? `From ${product.discountedPrice.toFixed(2)}₺`
                          : `${product.price.toFixed(2)}₺`}
                      </span>

                      <ul className="list-color-product">
                        {product.colorSwatches.map((swatch, idx) => (
                          <li
                            key={swatch.name}
                            className={`list-color-item color-swatch${
                              idx === 0 ? " active" : ""
                            }`}
                          >
                            <span className="tooltip">{swatch.name}</span>
                            <span
                              className={`swatch-value ${swatch.colorClass}`}
                            ></span>
                            <img
                              className="img-product"
                              src={swatch.img}
                              alt="color swatch"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round">
            <span className="icon icon-arrow-left"></span>
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round">
            <span className="icon icon-arrow-right"></span>
          </div>
          <div className="sw-dots style-2 sw-pagination-product justify-content-center"></div>
        </div>
      </div>

      {/* Quick View modal (ProductCard ile aynı mantık) */}
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

export default PeopleAlsoBought;
