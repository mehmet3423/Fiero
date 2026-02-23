import { useState, useRef, useEffect } from "react";
import FullscreenGallery from "@/components/product/FullscreenGallery";
import VideoThumbnail from "@/components/product/VideoThumbnail";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useLanguage } from "@/context/LanguageContext";

interface ProductGalleryProps {
  product: any;
  getAllProductMedia: () => { url: string; type: "image" | "video" }[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  getAllProductMedia,
}) => {
  const { language } = useLanguage();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isThumbAtStart, setIsThumbAtStart] = useState(true);
  const [isThumbAtEnd, setIsThumbAtEnd] = useState(false);
  const mainSwiperRef = useRef<any>(null);

  const titleToShow =
    language === "en" && product.titleEn ? product.titleEn : product.title;

  const baseImageUrl =
    language === "en" && product.baseImageUrlEn
      ? product.baseImageUrlEn
      : product.baseImageUrl;

  const contentImageUrls =
    language === "en" && product.contentImageUrlsEn && product.contentImageUrlsEn.length > 0
      ? product.contentImageUrlsEn
      : product.contentImageUrls || [];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsGalleryOpen(true);
  };

  const media = getAllProductMedia();

  return (
    <>
      <style jsx>{`
        .swiper,
        .swiper-slide,
        .swiper-slide .item,
        .swiper-slide .item img,
        .swiper-slide .item video,
        .swiper-slide .item a {
          user-select: none !important;
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
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
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 50 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease !important;
          border: 2px solid transparent !important;
          outline: none !important;
          user-select: none !important;
          cursor: pointer !important;
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

        .thumbs-slider {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          gap: 24px !important;
        }

        .tf-product-media-thumbs {
          flex: none !important;
          width: clamp(80px, 10vw, 120px) !important;
          height: clamp(300px, 60vh, 500px) !important;
          overflow: hidden !important;
          margin-right: 0 !important;
        }

        .swiper-slide.stagger-item .item {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .thumbnail-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: clamp(80px, 10vw, 120px);
          min-width: 70px;
          max-width: 120px;
          transition: width 0.3s;
        }

        .arrow-button {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .arrow-button > div {
          width: 32px;
          height: 32px;
        }

        @media (max-width: 1200px) {
          .tf-product-media-thumbs {
            width: 90px !important;
            height: 350px !important;
          }
          .swiper-slide.stagger-item .item {
            width: 80px !important;
            height: 80px !important;
          }
          .thumbnail-container {
            width: 90px !important;
          }
        }

        @media (max-width: 900px) {
          .tf-product-media-thumbs {
            width: 70px !important;
            height: 250px !important;
          }
          .swiper-slide.stagger-item .item {
            width: 60px !important;
            height: 60px !important;
          }
          .thumbnail-container {
            width: 70px !important;
          }
        }

        @media (max-width: 768px) {
          .thumbs-slider {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .tf-product-media-thumbs {
            width: 100% !important;
            height: auto !important;
          }
          .swiper-slide.stagger-item .item {
            width: 60px !important;
            height: 60px !important;
          }
          .thumbnail-container {
            width: 100% !important;
          }
          .tf-single-slide {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="tf-product-media-wrap position-sticky" style={{ top: "120px" }}>
        <div className="thumbs-slider d-flex align-items-start gap-3 flex-column flex-md-row overflow-visible">
          {/* Desktop Thumbnail Swiper */}
          {!isMobile && (
            <div className="thumbnail-container">
              {/* Up Arrow Button */}
              <div className="arrow-button" style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    cursor: media.length > 4 && thumbsSwiper && !isThumbAtStart ? "pointer" : "default",
                    background: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: media.length > 4 && thumbsSwiper && !isThumbAtStart ? 1 : 0,
                    visibility: media.length > 4 && thumbsSwiper && !isThumbAtStart ? "visible" : "hidden",
                    pointerEvents: media.length > 4 && thumbsSwiper && !isThumbAtStart ? "auto" : "none",
                  }}
                  onClick={() => {
                    if (media.length > 4 && thumbsSwiper && !isThumbAtStart) {
                      thumbsSwiper.slidePrev();
                    }
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#fff" />
                    <path
                      d="M7 14l5-5 5 5"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Thumbnail Swiper */}
              <Swiper
                onSwiper={(swiper) => {
                  setThumbsSwiper(swiper);
                  setIsThumbAtStart(swiper.isBeginning);
                  setIsThumbAtEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                  setIsThumbAtStart(swiper.isBeginning);
                  setIsThumbAtEnd(swiper.isEnd);
                }}
                direction="vertical"
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
                modules={[Thumbs]}
                className="swiper tf-product-media-thumbs other-image-zoom"
                data-direction="vertical"
                style={{
                  height: "clamp(300px, 60vh, 500px)",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {media.map((item, index) => (
                  <SwiperSlide key={index} className="swiper-slide stagger-item" style={{userSelect: 'none'}}>
                    <div
                      className="item"
                      onClick={() => {
                        mainSwiperRef.current?.swiper.slideTo(index);
                        setInitialSlide(index);
                      }}
                      onMouseDown={e => e.preventDefault()}
                      style={{
                        cursor: "pointer",
                        border:
                          initialSlide === index
                            ? "2px solid #000"
                            : "2px solid transparent",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "border-color 0.3s ease",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: 'none'
                      }}
                    >
                      {item.type === "video" ? (
                        <VideoThumbnail
                          videoUrl={item.url}
                          alt={`${titleToShow} - Video ${index + 1}`}
                          width={80}
                          height={80}
                        />
                      ) : (
                        <Image
                          src={item.url || "/assets/site/images/no-image.svg"}
                          alt={`${titleToShow} - ${index + 1}`}
                          width={80}
                          height={80}
                          className="lazyload"
                          draggable={false}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            borderRadius: "6px",
                            userSelect: 'none'
                          }}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Down Arrow Button */}
              <div className="arrow-button" style={{ marginTop: "8px" }}>
                <div
                  style={{
                    cursor: media.length > 4 && thumbsSwiper && !isThumbAtEnd ? "pointer" : "default",
                    background: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: media.length > 4 && thumbsSwiper && !isThumbAtEnd ? 1 : 0,
                    visibility: media.length > 4 && thumbsSwiper && !isThumbAtEnd ? "visible" : "hidden",
                    pointerEvents: media.length > 4 && thumbsSwiper && !isThumbAtEnd ? "auto" : "none",
                  }}
                  onClick={() => {
                    if (media.length > 4 && thumbsSwiper && !isThumbAtEnd) {
                      thumbsSwiper.slideNext();
                    }
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#fff" />
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Main Swiper */}
          <div className="swiper tf-single-slide" style={{ flex: "1", minWidth: 0 }}>
            <Swiper
              ref={mainSwiperRef}
              thumbs={{ swiper: thumbsSwiper }}
              navigation={{ nextEl: ".thumbs-next", prevEl: ".thumbs-prev" }}
              effect="slide"
              spaceBetween={10}
              slidesPerView={1}
              modules={[Navigation, Thumbs]}
              className="tf-product-media-main"
              id="gallery-swiper-started"
              onSlideChange={(swiper) => setInitialSlide(swiper.activeIndex)}
              style={{ width: "100%" }}
            >
              {media.map((item, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <div
                    className="item"
                    onClick={() => handleImageClick(index)}
                    style={{ cursor: "pointer" }}
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
                        src={item.url || baseImageUrl || "/assets/site/images/no-image.svg"}
                        alt={titleToShow}
                        width={600}
                        height={600}
                        className="tf-image-zoom lazyload"
                        style={{ objectFit: "contain", width: "100%", height: "auto", cursor: "pointer" }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-next button-style-arrow thumbs-next"></div>
            <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
          </div>

          {/* Mobile Thumbnail Swiper */}
          {isMobile && (
            <Swiper
              onSwiper={setThumbsSwiper}
              direction="horizontal"
              spaceBetween={8}
              slidesPerView="auto"
              watchSlidesProgress
              modules={[Thumbs]}
              className="swiper tf-product-media-thumbs other-image-zoom"
              style={{ marginTop: "15px", paddingBottom: "10px" }}
            >
              {media.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="swiper-slide stagger-item"
                  style={{ width: "auto", marginRight: "8px", userSelect: 'none' }}
                >
                  <div
                    className="item"
                    onClick={() => {
                      mainSwiperRef.current?.swiper.slideTo(index);
                      setInitialSlide(index);
                    }}
                    onMouseDown={e => e.preventDefault()}
                    style={{
                      cursor: "pointer",
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border:
                        initialSlide === index
                          ? "2px solid #000"
                          : "2px solid transparent",
                      transition: "border-color 0.3s ease",
                      userSelect: 'none'
                    }}
                  >
                    {item.type === "video" ? (
                      <VideoThumbnail
                        videoUrl={item.url}
                        alt={`${product.title} - Video ${index + 1}`}
                        width={60}
                        height={60}
                      />
                    ) : (
                      <Image
                        src={item.url || "/assets/site/images/no-image.svg"}
                        alt={`${product.title} - ${index + 1}`}
                        width={60}
                        height={60}
                        className="lazyload"
                        draggable={false}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          userSelect: 'none'
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )} 
        </div>

        {/* Discount Badge */}
        {/* {(() => {
          const discount = product.discountResponse;
          const hasDiscount = !!(
            discount?.isActive &&
            (product.price || 0) > (product.discountedPrice || 0)
          );

          if (!hasDiscount || !discount) return null;

          const isPercentage =
            discount.discountValueType === 1 ||
            discount.discountValueType === "1";

          return (
            <div
              className="product-label label-sale position-absolute top-0 end-0 m-2 text-white fw-bold rounded"
              style={{
                zIndex: 2,
                padding: "5px 8px",
                backgroundColor: "red",
                fontSize: "1.2rem",
              }}
            >
              {isPercentage
                ? `%${discount.discountValue}`
                : `${discount.discountValue}₺`}
            </div>
          );
        })()} */}

        {/* FullscreenGallery component */}
        <FullscreenGallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          media={media}
          initialSlide={initialSlide}
        />
      </div>
    </>
  );
};

export default ProductGallery;