import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import FullscreenGallery from "./FullscreenGallery";
import DiscountBadge from "./DiscountBadge";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { Product } from "@/constants/models/Product";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const QuickView: React.FC<QuickViewProps> = ({ isOpen, onClose, product }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenInitialSlide, setFullscreenInitialSlide] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const {
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();

  // Backend'den ürün verisini al
  const { product: backendProduct, isLoading, error } = useProductDetail(product.id);

  // Backend verisini yoksa prop'tan geleni kullan
  const displayProduct = backendProduct || product;

  const colors = ["Orange", "Black", "White"];
  const sizes = ["S", "M", "L", "XL"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const totalImages = [displayProduct.baseImageUrl, ...displayProduct.contentImageUrls].filter(Boolean).length;
  const hasDiscount = displayProduct.discountedPrice !== displayProduct.price;
  const discountPercentage = hasDiscount
    ? Math.round(((displayProduct.price - displayProduct.discountedPrice) / displayProduct.price) * 100)
    : 0;
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);


  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !fullscreenOpen && !sizeChartOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isOpen &&
        !fullscreenOpen &&
        !sizeChartOpen
      ) {
        onClose();
      }
    };

    if (isOpen && !fullscreenOpen && !sizeChartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, fullscreenOpen, sizeChartOpen]);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const closeFullscreen = () => {
    setFullscreenOpen(false);
    setTimeout(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }, 100);
  };

  const handleAddToCart = () => {
    addToCart(displayProduct.id, quantity);
  };

  const handleToggleFavorite = () => {
    if (isInFavorites(displayProduct.id)) {
      removeFromFavorites(displayProduct.id);
    } else {
      addToFavorites(displayProduct.id);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
      .no-scroll {
  overflow: hidden;
}
        .tf-single-slide .swiper-button-next::after,
        .tf-single-slide .swiper-button-prev::after {
          font-size: 16px !important;
          font-weight: 900 !important;
          color: #333 !important;
          transition: all 0.3s ease !important;
        }
        
        .tf-single-slide .swiper-button-next,
        .tf-single-slide .swiper-button-prev {
          width: 40px !important;
          height: 40px !important;
          margin-top: -20px !important;
          background-color: rgba(255,255,255,0.8) !important;
          border-radius: 50% !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          transition: all 0.3s ease !important;
          border: 2px solid transparent !important;
        }
        
        .tf-single-slide .swiper-button-next:hover,
        .tf-single-slide .swiper-button-prev:hover {
          background-color: #dc3545 !important; 
          border-color: #dc3545 !important;
        }
        
        .tf-single-slide .swiper-button-next:hover::after,
        .tf-single-slide .swiper-button-prev:hover::after {
          color: white !important;
        }
        
        .tf-single-slide .swiper-button-next:active,
        .tf-single-slide .swiper-button-prev:active {
          transform: translateY(0px) !important;
        }
        
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          opacity: 1;
        }
          /* Modal responsive */
        .modal-content {
          max-width: 95vw !important;
          max-height: 95vh !important;
        }
        
        .wrap {
        margin-top: 0% !important;
          display: flex !important;
          gap: 0px !important;
        }
        
        .tf-product-media-wrap {
          flex: 0 0 65% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        }
        
        .tf-product-info-wrap {
          flex: 0 0 35% !important;
          overflow-y: auto !important;
          margin-bottom: 40px !important;
        }
        
        .swiper.tf-single-slide {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .swiper-slide .item {
          width: 100% !important;
          height: 100% !important;
          display: block !important; /* flex yerine block */
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }
        
        .swiper-slide .item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .swiper-slide {
          display: flex !important;
          align-items: stretch !important;
          line-height: 0 !important;
        }
        
        /* Tablet responsive */
        @media (max-width: 1024px) {
          .wrap {
            flex-direction: row !important;
            display: flex !important;
          }
          
          .tf-product-media-wrap {
            justify-content: center !important;
            align-items: center !important;
            flex: 0 0 60% !important;
          }
          
          .tf-product-info-wrap {
            flex-shrink: 1 !important;
            height: auto !important;
          }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          
          .wrap {
            flex-direction: column !important;
            gap: 10px !important;
          }
          
          .tf-product-media-wrap {
            height: 250px !important;
            flex-shrink: 0 !important;
          }
          
          .tf-product-info-wrap {
            flex: 1 !important;
            overflow-y: auto !important;
          }
          
        }
        
        /* Small mobile */
        @media (max-width: 300px) {
          .tf-product-media-wrap {
            height: 250px !important;
          }
          
          .tf-product-info-wrap {
            padding: 10px !important;
          }
        }
      `}</style>

      <div
        className="modal-backdrop"
        onClick={onClose}
      ></div>

      <div className="modal fade modalDemo show" id="quick_view" style={{ display: 'block', zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" ref={modalRef}>
            <div className="header">
              <span
                className="icon-close icon-close-popup"
                onClick={onClose}
                aria-label="Close"
              ></span>
            </div>
            <div className="wrap">

              <div className="tf-product-media-wrap">
                <div className="swiper tf-single-slide" style={{ position: "relative" }}>
                  {hasDiscount && discountPercentage > 0 && (
                    <DiscountBadge percentage={discountPercentage} />
                  )}
                  <div className="swiper-wrapper">
                    <Swiper
                      modules={[Navigation]}
                      navigation={{
                        nextEl: ".single-slide-prev",
                        prevEl: ".single-slide-next",
                      }}
                      loop={totalImages > 1}
                      spaceBetween={0}
                      slidesPerView={1}
                      style={{ height: '100%' }}
                    >
                      <SwiperSlide>
                        <div className="item">
                          <Image
                            src={displayProduct.baseImageUrl || "/assets/images/products/no-image.jpg"}
                            alt={displayProduct.title}
                            width={500}
                            height={500}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                              margin: 0,
                              padding: 0
                            }}

                            onClick={() => {
                              setFullscreenInitialSlide(0);
                              setFullscreenOpen(true);
                            }}
                            unoptimized
                          />
                        </div>
                      </SwiperSlide>
                      {displayProduct.contentImageUrls.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="item">
                            <Image
                              src={img}
                              alt={displayProduct.title + " " + (idx + 1)}
                              width={500}
                              height={500}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                                margin: 0,
                                padding: 0
                              }}
                              onClick={() => {
                                setFullscreenInitialSlide(idx + 1);
                                setFullscreenOpen(true);
                              }}
                              unoptimized
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="swiper-button-next button-style-arrow single-slide-prev"></div>
                  <div className="swiper-button-prev button-style-arrow single-slide-next"></div>
                </div>
              </div>

              <div className="tf-product-info-wrap position-relative">
                <div className="tf-product-info-list">
                  <div className="tf-product-info-title">
                    <h5>
                      <a className="link" href={`/products/${displayProduct.id}`}>
                        {displayProduct.title}
                      </a>
                    </h5>
                  </div>
                  <div className="tf-product-info-badges">
                    <div className="badges text-uppercase">Best seller</div>
                    {displayProduct.sellableQuantity > 10 && (
                      <div className="product-status-content">
                        <i className="icon-lightning"></i>
                        <p className="fw-6">
                          SON {displayProduct.sellableQuantity} ÜRÜN
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="tf-product-info-price">
                    <div className="price">
                      {hasDiscount ? (
                        <>
                          {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(displayProduct.discountedPrice)}
                        </>
                      ) : (
                        new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(displayProduct.price)
                      )}
                    </div>
                  </div>
                  <div className="tf-product-description">
                    {isLoading ? (
                      <p>Açıklama yükleniyor...</p>
                    ) : error ? (
                      <p style={{ color: "#666", fontSize: "14px" }}>
                        Ürün açıklaması yüklenemedi.
                      </p>
                    ) : (
                      <>
                        <p>
                          {displayProduct.description && displayProduct.description.trim() !== ""
                            ? isDescriptionExpanded
                              ? displayProduct.description
                              : `${displayProduct.description.substring(0, 100)}...`
                            : "Ürün Açıklaması."}
                        </p>
                        {displayProduct.description && displayProduct.description.length > 100 && (
                          <button
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#000000ff",
                              cursor: "pointer",
                              paddingTop: "5px",
                              fontSize: "14px",
                              textDecoration: "underline",
                            }}
                          >
                            {isDescriptionExpanded ? "Daha Az Göster" : "Daha Fazla Göster"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="tf-product-info-variant-picker">
                    <div className="variant-picker-item">
                      <div className="variant-picker-label">
                        Renk: <span className="fw-6 variant-picker-label-value">{selectedColor}</span>
                      </div>
                      <div className="variant-picker-values">
                        {colors.map((color) => (
                          <React.Fragment key={color}>
                            <input
                              id={`values-${color.toLowerCase()}-1`}
                              type="radio"
                              name="color-1"
                              checked={selectedColor === color}
                              onChange={() => setSelectedColor(color)}
                            />
                            <label
                              className="hover-tooltip radius-60"
                              htmlFor={`values-${color.toLowerCase()}-1`}
                              data-value={color}
                            >
                              <span className={`btn-checkbox bg-color-${color.toLowerCase()}`}></span>
                              <span className="tooltip">{color}</span>
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="variant-picker-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="variant-picker-label">
                          Beden: <span className="fw-6 variant-picker-label-value">{selectedSize}</span>
                        </div>
                        <a
                          className="find-size btn-choose-size fw-6 d-none d-lg-block"
                          href="/assets/site/images/products/beden-tablosu.jpg"
                          onClick={(e) => {
                            e.preventDefault();
                            setSizeChartOpen(true);
                          }}
                        >
                          Beden Tablosu
                        </a>
                      </div>
                      <div className="variant-picker-values">
                        {sizes.map((size) => (
                          <React.Fragment key={size}>
                            <input
                              type="radio"
                              name="size-1"
                              id={`values-${size.toLowerCase()}-1`}
                              checked={selectedSize === size}
                              onChange={() => setSelectedSize(size)}
                            />
                            <label className="style-text" htmlFor={`values-${size.toLowerCase()}-1`} data-value={size}>
                              <p>{size}</p>
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <div className="wg-quantity">
                      <span
                        className="btn-quantity minus-btn"
                        onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      >
                        -
                      </span>
                      <input
                        type="text"
                        name="number"
                        value={quantity}
                        readOnly
                      />
                      <span
                        className="btn-quantity plus-btn"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </span>
                    </div>
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form className="">
                      <a
                        href="#"
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart();
                        }}
                      >
                        <span>SEPETE EKLE &nbsp;</span>
                        <span className="tf-qty-price">
                          {new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY"
                          }).format((displayProduct.discountedPrice || displayProduct.price) * quantity)}
                        </span>
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action"
                        onClick={handleToggleFavorite}
                      >
                        <span className="icon icon-heart"></span>
                        <span className="tooltip">FAVORİLERE EKLE</span>
                        <span className="icon icon-delete"></span>
                      </a>
                      <a
                        href="#"
                        className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="icon icon-compare"></span>
                        <span className="tooltip">KARŞILAŞTIR</span>
                        <span className="icon icon-check"></span>
                      </a>
                      <div className="w-100">
                        <a href="#" className="btns-full">
                          <img src="/assets/site/images/payments/paypal.png" alt="" /> ile satın alın
                        </a>
                        <a href="#" className="payment-more-option">
                          Daha Fazla Ödeme Seçeneği
                        </a>
                      </div>
                    </form>
                  </div>
                  <div>
                    <a href={`/products/${displayProduct.id}`} className="tf-btn fw-6 btn-line">
                      Tüm Detayları İncele<i className="icon icon-arrow1-top-left"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FullscreenGallery
        isOpen={fullscreenOpen}
        onClose={closeFullscreen}
        media={[displayProduct.baseImageUrl, ...displayProduct.contentImageUrls].map((url) => ({
          url,
          type: "image" as const,
        }))}
        initialSlide={fullscreenInitialSlide}
      />

      {sizeChartOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setSizeChartOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '70vw',
              maxHeight: '80vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/assets/site/images/products/beden-tablosu.jpg"
              alt="Beden Tablosu"
              width={800}
              height={600}
              style={{
                maxWidth: '80vw',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
              unoptimized
            />

            <button
              onClick={() => setSizeChartOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'white',
                color: 'black',
                border: 'none',
                width: '30px',
                height: '30px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickView;