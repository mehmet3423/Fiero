import QuickView from "@/components/product/QuickView";
import { Product } from "@/constants/models/Product";
import { useCart } from "@/hooks/context/useCart";
import { useFavorites } from "@/hooks/context/useFavorites";
import { useGetProductListByIds } from "@/hooks/services/products/useGetProductListByIds";
import Link from "next/link";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
    <section className="flat-spacing-15 pb_0">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title">{productHeader}</span>
          <p className="sub-title">Beautifully Functional. Purposefully Designed. Consciously Crafted.</p>
        </div>
        <div className="hover-sw-nav hover-sw-3">
          <div className="swiper tf-sw-product-sell wrap-sw-over" data-preview="4" data-tablet="3" data-mobile="2" data-space-lg="30" data-space-md="15" data-pagination="2" data-pagination-md="3" data-pagination-lg="3">
            <Swiper
              modules={[Navigation]}
              loop={true}
              navigation={{
                nextEl: ".nav-next-product",
                prevEl: ".nav-prev-product",
              }}
              spaceBetween={30}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="swiper-wrapper"
              style={{ 
                display: 'flex',
                alignItems: 'stretch'
              }}
              wrapperClass="d-flex align-items-stretch"
            >
              {products.map((product: Product) => {
                const hasDiscount = product.discountDTO !== null;
                const isPercentageDiscount =
                  hasDiscount &&
                  (product.discountDTO as any)?.discountValueType === 1;
                const discountPercentage = isPercentageDiscount
                  ? product.discountDTO.discountValue
                  : null;

                return (
                  <SwiperSlide key={product.id} className="swiper-slide d-flex" style={{ height: 'auto' }}>
                    <div className="card-product d-flex flex-column w-100" style={{ height: '100%' }}>
                      <div className="card-product-wrapper flex-fill d-flex flex-column">
                        <Link href={`/products/${product.id}`} className="product-img">
                          <img
                            className="lazyload img-product"
                            data-src={
                              product.baseImageUrl ||
                              "/assets/images/products/no-image.jpg"
                            }
                            src={
                              product.baseImageUrl ||
                              "/assets/images/products/no-image.jpg"
                            }
                            alt="image-product"
                          />
                          {product.contentImageUrls && product.contentImageUrls[0] && (
                            <img
                              className="lazyload img-hover"
                              data-src={product.contentImageUrls[0]}
                              src={product.contentImageUrls[0]}
                              alt="image-product"
                            />
                          )}
                        </Link>
                        <div className="list-product-btn pt-6" >
                          <a
                            href="javascript:void(0);"
                            className="box-icon bg_white quick-add tf-btn-loading"
                            title="Quick Add"
                            onClick={() => addToCart(product.id)}
                          >
                            <span className="icon icon-bag"></span>
                            <span className="tooltip">Quick Add</span>
                          </a>
                          <a
                            href="javascript:void(0);"
                            className={`box-icon bg_white wishlist btn-icon-action ${
                              isInFavorites(product.id) ? "added" : ""
                            }`}
                            title={
                              isInFavorites(product.id)
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                            onClick={() => handleToggleFavorite(product.id)}
                          >
                            <span className="icon icon-heart"></span>
                            <span className="tooltip">Add to Wishlist</span>
                            <span className="icon icon-delete"></span>
                          </a>
                          <a
                            href="javascript:void(0);"
                            className="box-icon bg_white compare btn-icon-action"
                            title="Add to Compare"
                          >
                            <span className="icon icon-compare"></span>
                            <span className="tooltip">Add to Compare</span>
                            <span className="icon icon-check"></span>
                          </a>
                          <a
                            href="javascript:void(0);"
                            className="box-icon bg_white quickview tf-btn-loading"
                            title="Quick View"
                            onClick={() => handleQuickView(product)}
                          >
                            <span className="icon icon-view"></span>
                            <span className="tooltip">Quick View</span>
                          </a>
                        </div>
                        {isPercentageDiscount && (
                          <div className="on-sale-wrap">
                            <div className="on-sale-item">-{discountPercentage}%</div>
                          </div>
                        )}
                      </div>
                      <div className="card-product-info mt-auto">
                        <Link href={`/products/${product.id}`} className="title link d-block text-truncate" style={{ 
                          height: '2.4em',
                          overflow: 'hidden',
                          lineHeight: '1.2em',
                          marginBottom: '8px'
                        }}>
                          {product.title}
                        </Link>
                        <span className="price">
                          {hasDiscount &&
                          product.price !== product.discountedPrice ? (
                            `From ${product.discountedPrice.toFixed(2)}₺`
                          ) : (
                            `${product.price.toFixed(2)}₺`
                          )}
                        </span>
                        <ul className="list-color-product">
                          <li className="list-color-item color-swatch active">
                            <span className="tooltip">Default</span>
                            <span className="swatch-value bg_orange-3"></span>
                            <img
                              className="lazyload"
                              data-src={
                                product.baseImageUrl ||
                                "/assets/images/products/no-image.jpg"
                              }
                              src={
                                product.baseImageUrl ||
                                "/assets/images/products/no-image.jpg"
                              }
                              alt="image-product"
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
        </div>
      </div>

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

export default FeaturedProducts;
