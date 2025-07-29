import { useState, useEffect } from "react";

interface ProductDetailsProps {
  product: any;
  reviews: any[];
  averageRating: number;
  quantity: number;
  setQuantity: (value: number) => void;
  handleAddToCart: () => void;
  handleToggleFavorite: () => void;
  isAddingToCart: boolean;
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
  handleToggleFavorite,
  isAddingToCart,
  isInFavorites,
  isFavoritesLoading,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const hasDiscount = product.discountDTO !== null;
  const discountPercentage = hasDiscount
    ? product.discountDTO.discountValue
    : null;

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
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-md-6">
      <div className="tf-product-info-wrap position-relative">
        <div className="tf-product-info-list other-image-zoom">
          {/* Product Title */}
          <div className="tf-product-info-title">
            <h5>{product.title}</h5>
          </div>

          {/* Badges */}
          <div className="tf-product-info-badges">
            <div className="badges">Best seller</div>
            <div className="product-status-content">
              <i className="icon-lightning"></i>
              <p className="fw-6">
                Selling fast! {Math.floor(Math.random() * 100)} people have this
                in their carts.
              </p>
            </div>
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
                  <span>{discountPercentage}</span>% OFF
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
            <p className="fw-6">People are viewing this right now</p>
          </div>

          {/* Countdown Timer */}
          <div className="tf-product-info-countdown">
            <div className="countdown-wrap">
              <div className="countdown-title">
                <i className="icon-time tf-ani-tada"></i>
                <p>HURRY UP! SALE ENDS IN:</p>
              </div>
              <div className="tf-countdown style-1">
                <p>
                  {timeLeft.days} Days : {timeLeft.hours} Hours :{" "}
                  {timeLeft.minutes} Mins : {timeLeft.seconds} Secs
                </p>
              </div>
            </div>
          </div>

          {/* Variant Picker */}
          <div className="tf-product-info-variant-picker">
            <div className="variant-picker-item">
              <div className="variant-picker-label">
                Color:{" "}
                <span className="fw-6 variant-picker-label-value">
                  {product.selectedColor || "Beige"}
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
                  <p>Renk seçenekleri bulunamadı</p>
                )}
              </div>
            </div>

            <div className="variant-picker-item">
              <div className="d-flex justify-content-between align-items-center">
                <div className="variant-picker-label">
                  Size:{" "}
                  <span className="fw-6 variant-picker-label-value">
                    {product.selectedSize || "S"}
                  </span>
                </div>
                <a
                  href="#find_size"
                  data-bs-toggle="modal"
                  className="find-size fw-6"
                >
                  Find your size
                </a>
              </div>
              <div className="variant-picker-values">
                {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  product.sizes.map((size: string, index: number) => (
                    <label key={index} className="style-text" data-value={size}>
                      <p>{size}</p>
                    </label>
                  ))
                ) : (
                  <p>Beden seçenekleri bulunamadı</p>
                )}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="tf-product-info-quantity">
            <div className="quantity-title fw-6">Quantity</div>
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
            style={{ gap: "1rem" }} // Added spacing between buttons
          >
            <a
              href="#"
              className={`tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn ${
                isAddingToCart || product.sellableQuantity <= 0
                  ? "disabled"
                  : ""
              }`}
              style={{
                padding: "15px 20px",
                fontSize: "18px",
                flexShrink: 0, // Prevents the button from growing
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
                  ? "Adding..."
                  : product.sellableQuantity > 0
                  ? "Add to Cart - "
                  : "Out of Stock"}
              </span>
              {product.sellableQuantity > 0 && (
                <span className="tf-qty-price">
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
            </a>
            <a
              href="#"
              className={`tf-product-btn-wishlist hover-tooltip box-icon bg_white wishlist btn-icon-action ${
                isInFavorites(product.id) ? "added" : ""
              } ${isFavoritesLoading ? "disabled" : ""}`}
              style={{
                padding: "15px 20px",
                fontSize: "18px",
                flexShrink: 0, // Prevents the button from growing
              }}
              onClick={(e) => {
                if (isFavoritesLoading) {
                  e.preventDefault();
                  return;
                }
                handleToggleFavorite();
              }}
              title={
                isInFavorites(product.id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              <span className="icon icon-heart"></span>
              <span className="tooltip">
                {isInFavorites(product.id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </span>
            </a>
            <a
              href="#compare"
              className="tf-product-btn-wishlist hover-tooltip box-icon bg_white compare btn-icon-action"
              style={{
                padding: "15px 20px",
                fontSize: "18px",
                flexShrink: 0, // Prevents the button from growing
              }}
              title="Add to Compare"
            >
              <span className="icon icon-compare"></span>
              <span className="tooltip">Add to Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;