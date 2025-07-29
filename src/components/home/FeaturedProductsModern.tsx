// components/home/FeaturedProductsModern.tsx

import React, { useState } from "react";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import QuickView from "@/components/product/QuickView";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


import { Product } from "@/constants/models/Product";

interface FeaturedProductsModernProps {
  products: Product[];
}

const FeaturedProductsModern: React.FC<FeaturedProductsModernProps> = ({ products }) => {
  const { addToCart } = useCart();
  const {
    addToFavorites,
    isInFavorites,
    removeFromFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

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

  return (
    <div className="modern-featured-wrapper">
      <Swiper
        modules={[Navigation]}
        loop={true}
        navigation={{ nextEl: ".modern-next", prevEl: ".modern-prev" }}
        spaceBetween={28}
        breakpoints={{
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
          1200: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => {
          const hasDiscount = product.discountDTO !== null;
          const isPercentage = hasDiscount && (product.discountDTO as any)?.discountValueType === 1;
          const discountValue = isPercentage ? product.discountDTO.discountValue : null;
          return (
            <SwiperSlide key={product.id}>
              <div className="modern-card">
                <div className="modern-image-area">
                  {isPercentage && <span className="modern-badge">-%{discountValue}</span>}
                  <Link href={`/products/${product.id}`} className="modern-img-link">
                    <Image
                      src={product.baseImageUrl || "/assets/images/products/no-image.jpg"}
                      alt={product.title}
                      width={320}
                      height={400}
                      unoptimized
                      className="modern-img"
                    />
                  </Link>
                    <div className="modern-actions-and-stock">
                      <div className="list-product-btn" style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" }}>
                        <button
                          className="box-icon bg_white quick-add tf-btn-loading"
                          title="Sepete Ekle"
                          onClick={() => addToCart(product.id)}
                        >
                          <span className="icon icon-bag"></span>
                          <span className="tooltip">Sepete Ekle</span>
                        </button>
                        <button
                          className={`box-icon bg_white wishlist btn-icon-action ${isInFavorites(product.id) ? "added" : ""}`}
                          title={isInFavorites(product.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                          onClick={() => handleToggleFavorite(product.id)}
                          disabled={isFavoritesLoading}
                        >
                          <span className="icon icon-heart"></span>
                          <span className="tooltip">Favori</span>
                        </button>
                        <button
                          className="box-icon bg_white compare btn-icon-action"
                          title="Karşılaştır"
                          onClick={() => alert('Karşılaştır')}
                        >
                          <span className="icon icon-compare"></span>
                          <span className="tooltip">Karşılaştır</span>
                        </button>
                        <button
                          className="box-icon bg_white quickview tf-btn-loading"
                          title="Hızlı Görünüm"
                          onClick={() => handleQuickView(product)}
                        >
                          <span className="icon icon-view"></span>
                          <span className="tooltip">Hızlı Bakış</span>
                        </button>
      {selectedProduct && (
        <QuickView
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
          product={selectedProduct}
        />
      )}
                      </div>
                      <div className="modern-stock">4 sizes available</div>
                    </div>
                </div>
                <div className="modern-info">
                  <h3 className="modern-title">{product.title}</h3>
                  <div className="modern-price">
                    {hasDiscount && product.price !== product.discountedPrice ? (
                      <>
                        <span className="modern-old">{product.price.toFixed(2)}₺</span>
                        <span className="modern-new">{product.discountedPrice.toFixed(2)}₺</span>
                      </>
                    ) : (
                      <span className="modern-new">{product.price.toFixed(2)}₺</span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button className="modern-prev nav-btn" aria-label="Geri"><span>&#8592;</span></button>
      <button className="modern-next nav-btn" aria-label="İleri"><span>&#8594;</span></button>
      <style jsx>{`
        .modern-featured-wrapper {
          position: relative;
          padding: 0 16px 16px 16px;
        }
        .modern-card {
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          min-height: 470px;
          box-shadow: none;
          background: none;
          border: 1px solid #ececec;
          transition: border 0.18s;
        }
        .modern-card:hover {
          border-color: #f5f5f5;
        }
        .modern-image-area {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1.18;
          background: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .modern-img-link {
          display: block;
          width: 100%;
          height: 100%;
        }
        .modern-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
          background: none;
        }
        .modern-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ff6533;
          color: #fff;
          padding: 3px 10px;
          font-size: 0.85rem;
          border-radius: 8px;
          font-weight: 600;
          z-index: 2;
        }
        .modern-actions-and-stock {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }
        .list-product-btn {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s;
        }
        .modern-card:hover .list-product-btn {
          opacity: 1;
          pointer-events: auto;
        }
        .box-icon {
          background: #fff;
          border: none;
          border-radius: 8px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.45rem;
          color: #222;
          transition: background 0.18s, color 0.18s;
          cursor: pointer;
          position: relative;
        }
        .box-icon .icon {
          color: #222;
          transition: color 0.18s;
        }
        .box-icon:hover, .box-icon:focus {
          background: #222;
        }
        .box-icon:hover .icon, .box-icon:focus .icon {
          color: #fff;
        }
        .modern-stock {
          width: 100%;
          background: rgba(0,0,0,0.60);
          color: #fff;
          font-size: 0.82rem;
          padding: 4px 0;
          text-align: center;
          opacity: 0;
          transition: opacity 0.18s;
          pointer-events: none;
        }
        .modern-card:hover .modern-stock {
          opacity: 1;
          pointer-events: auto;
        }
        .modern-actions button {
          background: #fff;
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.18rem;
          color: #222;
          box-shadow: none;
          transition: background 0.18s;
          cursor: pointer;
          pointer-events: auto;
        }
        .modern-actions button:hover {
          background: #f3f3f3;
        }
        .modern-info {
          padding: 1.1rem 1.2rem 1.2rem 1.2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .modern-title {
          font-size: 1.08rem;
          font-weight: 600;
          color: #181818;
          margin: 0 0 0.4rem 0;
          text-align: center;
          min-height: 2.2em;
          letter-spacing: 0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .modern-price {
          font-size: 1.02rem;
          font-weight: 500;
          color: #222;
          margin-bottom: 0.2rem;
          text-align: center;
          display: block;
        }
        .modern-old {
          text-decoration: line-through;
          color: #999;
          margin-right: 0.5rem;
        }
        .modern-new {
          font-weight: bold;
          color: #000;
        }
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: #fff;
          border-radius: 50%;
          border: none;
          width: 44px;
          height: 44px;
          cursor: pointer;
          z-index: 10;
          box-shadow: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #222;
          transition: background 0.18s;
        }
        .nav-btn:hover {
          background: #f3f3f3;
        }
        .modern-prev {
          left: -18px;
        }
        .modern-next {
          right: -18px;
        }
        @media (max-width: 900px) {
          .modern-card {
            min-height: 340px;
          }
          .modern-img {
            min-height: 120px;
            max-height: 180px;
          }
          .modern-prev, .modern-next {
            width: 36px;
            height: 36px;
            font-size: 1.2rem;
          }
        }
        @media (max-width: 600px) {
          .modern-card {
            min-height: 180px;
          }
          .modern-img {
            min-height: 80px;
            max-height: 120px;
          }
          .modern-prev, .modern-next {
            width: 28px;
            height: 28px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedProductsModern;
