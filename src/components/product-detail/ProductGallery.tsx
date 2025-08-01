import { useState, useRef, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const mainSwiperRef = useRef<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsGalleryOpen(true);
  };

  const media = getAllProductMedia();

  return (
    <>
      {/* CSS Override for Navigation Arrows - QuickView Style */}
      <style jsx>{`
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
          outline: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          cursor: pointer !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        .tf-single-slide .swiper-button-next:focus,
        .tf-single-slide .swiper-button-prev:focus {
          outline: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        .tf-single-slide .swiper-button-next:active,
        .tf-single-slide .swiper-button-prev:active {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
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

        /* Desktop Thumbnail Styles */
        @media (min-width: 768px) {
          .tf-product-media-thumbs {
            flex-shrink: 0;
            width: 160px !important;
            overflow: visible !important;
          }
          
          .tf-product-media-thumbs .swiper-wrapper {
            width: 100% !important;
            overflow: visible !important;
          }
          
          .tf-product-media-thumbs .swiper-slide {
            height: auto !important;
            margin-bottom: 12px !important;
            width: 100% !important;
            overflow: visible !important;
          }
          
          .tf-product-media-thumbs .item {
            display: block !important;
            width: 120px !important;
            height: 120px !important;
            margin: 0 auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
      
    <div className="tf-product-media-wrap position-sticky" style={{ top: "0" }}>
      <div className="thumbs-slider d-flex align-items-start gap-3 flex-column flex-md-row overflow-visible">
        {/* Desktop: Thumbnail Swiper önce */}
        {!isMobile && (
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="vertical"
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            modules={[Thumbs]}
            className="swiper tf-product-media-thumbs other-image-zoom"
            data-direction="vertical"
            style={{ height: "500px", width: "160px", marginRight: "20px", overflow: "visible" }}
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
                    style={{ 
                      cursor: "pointer",
                      border: initialSlide === index ? "2px solid #000" : "2px solid transparent",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "border-color 0.3s ease",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px"
                    }}
                  >
                    {item.type === "video" ? (
                      <VideoThumbnail
                        videoUrl={item.url}
                        alt={`${product.title} - Video ${index + 1}`}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <Image
                        src={item.url || "/assets/images/no-image.jpg"}
                        alt={`${product.title} - ${index + 1}`}
                        width={100}
                        height={100}
                        className="lazyload"
                        style={{ 
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          borderRadius: "6px"
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        )}

        {/* Main Swiper */}
        <div className="swiper tf-single-slide" style={{ position: "relative" }}>
          <div className="swiper-wrapper">
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
              className="tf-product-media-main"
              id="gallery-swiper-started"
              onSlideChange={(swiper) => setInitialSlide(swiper.activeIndex)}
            >
              {media.map((item, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <a
                    href={item.url}
                    target="_blank"
                    className="item"
                    data-pswp-width="770px"
                    data-pswp-height="1075px"
                    rel="noopener noreferrer"
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
                        data-zoom={item.url}
                        data-src={item.url}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="swiper-button-next button-style-arrow thumbs-next"></div>
          <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
        </div>

        {/* Mobile: Thumbnail Swiper alta */}
        {isMobile && (
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="horizontal"
            spaceBetween={8}
            slidesPerView="auto"
            watchSlidesProgress
            modules={[Thumbs]}
            className="swiper tf-product-media-thumbs other-image-zoom"
            style={{ 
              marginTop: "15px",
              paddingBottom: "10px"
            }}
          >
            <div className="swiper-wrapper stagger-wrap">
              {media.map((item, index) => (
                <SwiperSlide 
                  key={index} 
                  className="swiper-slide stagger-item"
                  style={{ width: "auto", marginRight: "8px" }}
                >
                  <div
                    className="item"
                    onClick={() => {
                      mainSwiperRef.current?.swiper.slideTo(index);
                      setInitialSlide(index);
                    }}
                    style={{ 
                      cursor: "pointer",
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: initialSlide === index ? "2px solid #000" : "2px solid transparent",
                      transition: "border-color 0.3s ease"
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
                        src={item.url || "/assets/images/no-image.jpg"}
                        alt={`${product.title} - ${index + 1}`}
                        width={60}
                        height={60}
                        className="lazyload"
                        style={{ 
                          objectFit: "cover",
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        )}
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
            className="product-label label-sale position-absolute top-0 end-0 m-2 text-white fw-bold rounded"
            style={{
              zIndex: 2,
              padding: "5px 8px",
              backgroundColor: "red",
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
    </>
  );
};

export default ProductGallery;