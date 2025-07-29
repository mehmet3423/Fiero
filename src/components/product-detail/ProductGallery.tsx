import { useState, useRef } from "react";
import FullscreenGallery from "@/components/product/FullscreenGallery";
import VideoThumbnail from "@/components/product/VideoThumbnail";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ProductGalleryProps {
  product: any;
  getAllProductMedia: () => { url: string; type: "image" | "video" }[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  getAllProductMedia,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const mainSwiperRef = useRef<any>(null);

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsGalleryOpen(true);
  };

  const media = getAllProductMedia();

  return (
    <div className="tf-product-media-wrap sticky-top">
      <div className="thumbs-slider">
        {/* Thumbnail Swiper */}
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          spaceBetween={10}
          slidesPerView={5}
          watchSlidesProgress
          modules={[Thumbs]}
          className="swiper tf-product-media-thumbs other-image-zoom"
          style={{ height: "500px" }}
        >
          <div className="swiper-wrapper stagger-wrap">
            {media.map((item, index) => (
              <SwiperSlide key={index} className="swiper-slide stagger-item">
                <div
                  className="item"
                  onClick={() => {
                    mainSwiperRef.current?.swiper.slideTo(index);
                    setInitialSlide(index);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.type === "video" ? (
                    <VideoThumbnail
                      videoUrl={item.url}
                      alt={`${product.title} - Video ${index + 1}`}
                      width={80}
                      height={80}
                    />
                  ) : (
                    <Image
                      src={item.url || "/assets/images/no-image.jpg"}
                      alt={`${product.title} - ${index + 1}`}
                      width={80}
                      height={80}
                      className="lazyload"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>

        {/* Main Swiper */}
        <Swiper
          ref={mainSwiperRef}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            nextEl: ".thumbs-next",
            prevEl: ".thumbs-prev",
          }}
          spaceBetween={10}
          slidesPerView={1}
          modules={[Navigation, Thumbs]}
          className="swiper tf-product-media-main"
          id="gallery-swiper-started"
          onSlideChange={(swiper) => setInitialSlide(swiper.activeIndex)}
        >
          <div className="swiper-wrapper">
            {media.map((item, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <a
                  href={item.url}
                  target="_blank"
                  className="item"
                  data-pswp-width="770px"
                  data-pswp-height="1075px"
                  style={{ cursor: "zoom-in" }}
                >
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      controls
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "4px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Image
                      src={
                        item.url || product.baseImageUrl || "/assets/images/no-image.jpg"
                      }
                      alt={product.title}
                      width={600}
                      height={600}
                      className="tf-image-zoom lazyload"
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </a>
              </SwiperSlide>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="swiper-button-next button-style-arrow thumbs-next"></div>
          <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
        </Swiper>
      </div>

      {/* Discount Badge */}
      {(() => {
        const hasDiscount = (product as any).discountDTO !== null;
        const isPercentageDiscount =
          hasDiscount &&
          ((product as any).discountDTO as any)?.discountValueType === 0;

        if (!isPercentageDiscount) return null;

        return (
          <div
            className="product-label label-sale"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 2,
              padding: "5px 8px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            %{(product as any).discountDTO.discountValue}
          </div>
        );
      })()}

      {/* Fullscreen Gallery */}
      <FullscreenGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        media={media}
        initialSlide={initialSlide}
      />
    </div>
  );
};

export default ProductGallery;