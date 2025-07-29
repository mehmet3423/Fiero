import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import VideoThumbnail from "./VideoThumbnail";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface FullscreenGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialSlide?: number;
}

const FullscreenGallery: React.FC<FullscreenGalleryProps> = ({
  isOpen,
  onClose,
  media,
  initialSlide = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscKey);
      setKey((prev) => prev + 1);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscKey);
      setThumbsSwiper(null);
    };
  }, [isOpen, onClose]);

  // Reset current index when initialSlide changes
  useEffect(() => {
    setCurrentIndex(initialSlide);
  }, [initialSlide]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  // Safety check for media prop
  if (!media || !Array.isArray(media) || media.length === 0) {
    return null;
  }

  return (
    <div className="fullscreen-container" onClick={handleClose}>
      <button
        type="button"
        className="close fullscreen-close"
        onClick={handleClose}
      >
        <span>&times;</span>
      </button>

      <div
        className="quickView-content container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row justify-content-center">
          <div className="product-fullscreen col-md-10 text-center">
            <p className="mb-1">
              <span className="curidx">{currentIndex + 1}</span> /{" "}
              {media.length}
            </p>

            <Swiper
              key={`main-${key}`}
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              initialSlide={initialSlide}
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              className="fullscreen-swiper mb-2"
            >
              {media.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="intro-slide"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.type === "video" ? (
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "800px",
                          height: "auto",
                          maxHeight: "600px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "12px",
                          overflow: "visible",
                          margin: "0 auto",
                          marginTop: "100px",
                        }}
                      >
                        <video
                          controls
                          width="100%"
                          height="100%"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain",
                            borderRadius: "12px",
                          }}
                          poster={undefined}
                          autoPlay={true}
                          muted={true}
                          playsInline={true}
                        >
                          <source src={item.url} type="video/mp4" />
                          Tarayıcınız video oynatmayı desteklemiyor.
                        </video>
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={`Product image ${index + 1}`}
                        width={800}
                        height={800}
                        style={{
                          objectFit: "contain",
                          maxHeight: "80vh",
                          width: "auto",
                          margin: "0 auto",
                        }}
                        unoptimized
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div
              className="carousel-dots-container"
              onClick={(e) => e.stopPropagation()}
            >
              <Swiper
                key={`thumbs-${key}`}
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={10}
                watchSlidesProgress
                className="carousel-dots-swiper"
              >
                {media.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`carousel-dot ${
                        index === currentIndex ? "active" : ""
                      }`}
                    >
                      {item.type === "video" ? (
                        <VideoThumbnail
                          videoUrl={item.url}
                          alt={`Video thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                        />
                      ) : (
                        <Image
                          src={item.url}
                          alt={`Thumbnail ${index + 1}`}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fullscreen-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fullscreen-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          background: transparent;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          z-index: 1060;
        }

        .carousel-dot {
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.3s;
          position: relative;
        }

        .carousel-dot.active {
          opacity: 1;
          border: 2px solid #fff;
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          alignitems: center;
          justify-content: center;
          font-size: 12px;
        }

        :global(.fullscreen-swiper) {
          width: 100%;
          max-width: 1000px;
        }

        :global(.carousel-dots-swiper) {
          max-width: 400px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default FullscreenGallery;
