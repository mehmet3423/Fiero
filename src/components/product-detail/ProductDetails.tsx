import { useState, useEffect } from "react";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useRouter } from "next/router";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface ProductDetailsProps {
  product: any;
  reviews: any[];
  averageRating: number;
  quantity: number;
  setQuantity: (value: number) => void;
  handleAddToCart: () => void;
  isAddingToCart: boolean;
  handleToggleFavorite: () => void;
  isInFavorites: (productId: string) => boolean;
  isFavoritesLoading: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  reviews,
  averageRating,
  quantity,
  setQuantity,
  handleAddToCart,
  isAddingToCart,
}) => {
  const { t } = useLanguage();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [sizeChartOpen, setSizeChartOpen] = useState(false); // Beden tablosu için yeni state

  // Favori mantığı
  const {
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();

  // Karşılaştır mantığı
  const router = useRouter();
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
      router.push("/compare-products");
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    if (isInFavorites(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  /* const hasDiscount = product.discountDTO !== null;
  const discountPercentage = hasDiscount
    ? product.discountDTO.discountValue
    : null; */
  const discountPercentage = product.discountDTO?.discountValue ?? null;
  const hasDiscount = discountPercentage !== null;

  // Countdown Timer Logic
  useEffect(() => {
    const targetTime = new Date().getTime() + 1007500 * 1000; // Example: 1007500 seconds from now
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx>{`
        .tf-product-info-wrap {
          margin-left: auto;
          margin-right: auto;
          max-width: 500px; /* Genişliği sınırlamak için isteğe bağlı */
        }

        .size-chart-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .size-chart-container {
          position: relative;
          max-width: 70vw;
          max-height: 80vh;
        }

        .size-chart-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: white;
          color: black;
          border: none;
          width: 30px;
          height: 30px;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
      `}</style>

      <div className="col-md-6 position-relative mx-auto">
        <div className="tf-product-info-wrap position-relative">
          <div className="tf-product-info-list other-image-zoom">
            {/* Product Title */}
            <div className="tf-product-info-title">
              <h5>{product.title}</h5>
            </div>

            {/* Price */}
            <div className="tf-product-info-price">
              {hasDiscount && product.price !== product.discountedPrice ? (
                <>
                  <div className="price-on-sale">
                    {product.discountedPrice.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </div>
                  <div className="compare-at-price">
                    {product.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </div>
                  <div className="badges-on-sale">
                    <span>{discountPercentage}</span>% {t("productDetailComponent.titles.sale")}
                  </div>
                </>
              ) : (
                <div className="price-on-sale">
                  {product.price.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </div>
              )}
            </div>

            {/* Live View */}
            <div className="tf-product-info-liveview">
              <div className="liveview-count">{product.viewCount || 20}</div>
              <p className="fw-6">{t("productDetailComponent.titles.currentlyViewing")}</p>
            </div>

            {/* Countdown Timer */}
            <div className="tf-product-info-countdown">
              <div className="countdown-wrap">
                <div className="countdown-title">
                  <i className="icon-time tf-ani-tada"></i>
                  <p>{t("productDetailComponent.titles.hurryDiscountEnds")}</p>
                </div>
                <div className="tf-countdown style-1">
                  <p>
                    {timeLeft.days} {t("productDetailComponent.titles.day")} : {timeLeft.hours} {t("productDetailComponent.titles.hour")} :{" "}
                    {timeLeft.minutes} {t("productDetailComponent.titles.minute")} : {timeLeft.seconds} {t("productDetailComponent.titles.second")}
                  </p>
                </div>
              </div>
            </div>

            {/* Variant Picker */}
            <div className="tf-product-info-variant-picker">
              <div className="variant-picker-item">
                <div className="variant-picker-label">
                  {t("productDetailComponent.titles.color")}:{" "}
                  <span className="fw-6 variant-picker-label-value">
                    {product.selectedColor || "Bej"}
                  </span>
                </div>
                <div className="variant-picker-values">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((color: string, index: number) => (
                      <label
                        key={index}
                        className="hover-tooltip radius-60"
                        data-value={color}
                      >
                        <span
                          className={`btn-checkbox bg-color-${color.toLowerCase()}`}
                        ></span>
                        <span className="tooltip">{color}</span>
                      </label>
                    ))
                  ) : (
                    <p>{t("productDetailComponent.messages.noColorsFound")}</p>
                  )}
                </div>
              </div>

              <div className="variant-picker-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="variant-picker-label">
                    {t("productDetailComponent.titles.size")}:{" "}
                    <span className="fw-6 variant-picker-label-value">
                      {product.selectedSize || "S"}
                    </span>
                  </div>
                  <a
                    className="find-size btn-choose-size fw-6 d-none d-lg-block"
                    href="/assets/site/images/products/beden-tablosu.jpg"
                    onClick={(e) => {
                      e.preventDefault();
                      setSizeChartOpen(true);
                    }}
                  >
                    {t("productDetailComponent.titles.sizeChart")}
                  </a>
                </div>
                <div className="variant-picker-values">
                  {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                    product.sizes.map((size: string, index: number) => (
                      <label
                        key={index}
                        className="style-text"
                        data-value={size}
                      >
                        <p>{size}</p>
                      </label>
                    ))
                  ) : (
                    <p>{t("productDetailComponent.messages.noSizesFound")}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="tf-product-info-quantity">
              <div className="quantity-title fw-6">{t("productDetailComponent.titles.quantity")}</div>
              <div className="wg-quantity">
                <span
                  className="btn-quantity minus-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </span>
                <input
                  type="text"
                  name="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value)) {
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(value, product.sellableQuantity || 10)
                        )
                      );
                    }
                  }}
                />
                <span
                  className="btn-quantity plus-btn"
                  onClick={() =>
                    setQuantity(
                      Math.min(quantity + 1, product.sellableQuantity || 10)
                    )
                  }
                >
                  +
                </span>
              </div>
            </div>

            {/* Add to Cart, Wishlist, and Compare Buttons */}
            <div
              className="tf-product-info-buy-button d-flex align-items-center"
              style={{ gap: "1rem" }}
            >
              <a
                href="#"
                className={`tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn ${isAddingToCart || product.sellableQuantity <= 0
                  ? "disabled"
                  : ""
                  }`}
                style={{
                  padding: "15px 20px",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  if (isAddingToCart || product.sellableQuantity <= 0) {
                    e.preventDefault();
                    return;
                  }
                  handleAddToCart();
                }}
              >
                <span>
                  {isAddingToCart
                    ? t("productDetailComponent.buttons.addingToCart")
                    : product.sellableQuantity > 0
                      ? t("productDetailComponent.buttons.addToCart")
                      : t("productDetailComponent.buttons.outOfStock")}
                  {product.sellableQuantity > 0 && (
                    <span
                      style={{ marginLeft: "8px" }}
                      className="tf-qty-price"
                    >
                      {product.discountedPrice
                        ? product.discountedPrice.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })
                        : product.price.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                    </span>
                  )}
                </span>
              </a>
              <a
                href="#"
                className={`tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action ${isInFavorites(product.id) ? "added" : ""
                  } ${isFavoritesLoading ? "disabled" : ""}`}
                style={{
                  padding: "15px 20px",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  if (isFavoritesLoading) return;
                  await handleToggleFavorite(product.id);
                }}
                title={
                  isInFavorites(product.id)
                    ? t("productDetailComponent.buttons.removeFromFavorites")
                    : t("productDetailComponent.buttons.addToFavorites")
                }
              >
                <span className="icon icon-heart"></span>
                <span className="tooltip">
                  {isInFavorites(product.id)
                    ? t("productDetailComponent.buttons.removeFromFavorites")
                    : t("productDetailComponent.buttons.addToFavorites")}
                </span>
                <span className="icon icon-delete"></span>
              </a>
              <a
                href="#"
                className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
                style={{
                  padding: "15px 20px",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleCompare(product.id);
                }}
                title={t("productDetailComponent.buttons.addToCompare")}
              >
                <span className="icon icon-compare"></span>
                <span className="tooltip">{t("productDetailComponent.buttons.addToCompare")}</span>
                <span className="icon icon-check"></span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Beden Tablosu Modal */}
      {sizeChartOpen && (
        <div
          className="size-chart-backdrop"
          onClick={() => setSizeChartOpen(false)}
        >
          <div
            className="size-chart-container"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/assets/site/images/products/beden-tablosu.jpg"
              alt="Beden Tablosu"
              width={800}
              height={600}
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
              unoptimized
            />
            <button
              className="size-chart-close-btn"
              onClick={() => setSizeChartOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
