import { Product } from "@/constants/models/Product";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import QuickView from "../product/QuickView";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const {
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    isLoading: isFavoritesLoading,
  } = useFavorites();
  const { addToCart, addLoading: isAddingToCart } = useCart();

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id);
    } catch (error) {
      toast.error(t("productCard.addToCartError"));
    }
  };

  const handleToggleFavorite = async () => {
    if (isInFavorites(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product.id);
    }
  };

  // Karşılaştırma butonu fonksiyonu
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

  const hasDiscount = product.discountDTO !== null;
  const isPercentageDiscount =
    hasDiscount && (product.discountDTO as any)?.discountValueType === 1;

  const imageSrc =
    !product.baseImageUrl || product.baseImageUrl === "no_url"
      ? "/assets/images/no-image.jpg"
      : product.baseImageUrl;

  return (
    <>

      <div className="card-product style-7">
        <div className="card-product-wrapper">
          <Link href={`/products/${product.id}`} className="product-img">
            <img
              className="lazyload img-product"
              data-src={imageSrc}
              src={imageSrc}
              alt={product.title}
            />
            {product.contentImageUrls && product.contentImageUrls.length > 0 && (
              <img
                className="lazyload img-hover"
                data-src={product.contentImageUrls[0]}
                src={product.contentImageUrls[0]}
                alt={product.title}
              />
            )}
          </Link>

          <div className="list-product-btn">
            <a
              href="#"
              className={`box-icon wishlist bg_white round btn-icon-action${isInFavorites(product.id) ? " active" : ""}`}
              onClick={e => {
                e.preventDefault();
                handleToggleFavorite();
              }}

            >
              <span className="icon icon-heart"></span>
              <span className="tooltip">
                {isInFavorites(product.id) ? t("productCard.removeFromFavorites") : t("productCard.addToFavorites")}
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
              className="box-icon compare bg_white round btn-icon-action"
              onClick={e => {
                e.preventDefault();
                handleCompare(product.id);
              }}
            >
              <span className="icon icon-compare"></span>
              <span className="tooltip">{t("productCard.compare")}</span>
              <span className="icon icon-check"></span>
            </a>

            <a
              href="#"
              className="box-icon quickview bg_white round tf-btn-loading"
              onClick={e => {
                e.preventDefault();
                handleQuickView(product);
              }}
            >
              <span className="icon icon-view"></span>
              <span className="tooltip">{t("productCard.quickView")}</span>
            </a>
          </div>

          {/* <div className="size-list"> */}
          {/* Ürün bedenlerini burada gösterebilirsin */}
          {/* <span>S</span>
          <span>M</span>
          <span>L</span>
          <span>XL</span>
        </div> */}
        </div>

        <div className="card-product-info">
          <a
            href="#"
            className="btn-quick-add quick-add"
            onClick={e => {
              e.preventDefault();
              if (!isAddingToCart) handleAddToCart();
            }}
          >
            {isAddingToCart ? t("productCard.addingToCart") : t("productCard.addToCart")}
          </a>

          <Link href={`/products/${product.id}`} className="title link">
            {product.title}
          </Link>

          <span className="price">
            {hasDiscount && product.price !== product.discountedPrice ? (
              <>
                <span className="old-price">
                  {product.price.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </span>
                <span className="new-price">
                  {product.discountedPrice.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </span>
              </>
            ) : (
              product.price.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
              })
            )}
          </span>

          {/* Color swatch sistemi - isteğe bağlı */}
          <ul className="list-color-product">
            <li className="list-color-item color-swatch active">
              <span className="tooltip">{t("productCard.default")}</span>
              <span className="swatch-value bg_orange-3"></span>
              <img className="lazyload" data-src={imageSrc} src={imageSrc} alt="image-product" />
            </li>
          </ul>
        </div>

        {selectedProduct && (
          <QuickView
            isOpen={quickViewOpen}
            onClose={() => setQuickViewOpen(false)}
            product={selectedProduct}
          />
        )}
      </div>
      <style jsx>{`
  .box-icon.wishlist svg {
    transition: fill 0.3s ease;
  }
  
  .box-icon.wishlist:hover svg {
    fill: white !important;
  }
  
  .box-icon.wishlist:hover svg path {
    fill: white !important;
  }
`}</style>
    </>

  );

}