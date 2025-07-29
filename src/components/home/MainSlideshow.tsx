import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export interface MainSlideshowSlide {
  image: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface MainSlideshowProps {
  slides: MainSlideshowSlide[];
  className?: string;
}

const MainSlideshow: React.FC<MainSlideshowProps> = ({ slides, className = "" }) => {
  return (
    <div className={`tf-slideshow slider-women slider-effect-fade position-relative ${className}`} style={{width:'100vw',maxWidth:'100vw',overflow:'hidden',marginBottom:'1.7rem'}}>
      <Swiper
        modules={[EffectFade, Pagination]}
        effect="fade"
        pagination={{ clickable: true, el: ".sw-pagination-slider" }}
        loop={true}
        slidesPerView={1}
        className="tf-sw-slideshow"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="wrap-slider">
              <Image
                src={slide.image}
                alt={slide.title || "Slideshow"}
                fill
                priority={idx === 0}
                style={{objectFit:'cover', objectPosition:'top'}}
                className="slideshow-img"
              />
              <div className="slideshow-content-area">
                {slide.title && <h1 className="slideshow-title">{slide.title}</h1>}
                {slide.subtitle && <p className="slideshow-subtitle">{slide.subtitle}</p>}
                {slide.buttonText && slide.buttonLink && (
                  <Link href={slide.buttonLink} className="slideshow-btn">
                    <span>{slide.buttonText}</span>
                    <i className="icon icon-arrow-right" style={{marginLeft:8,fontSize:'1.3em'}}></i>
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="wrap-pagination">
        <div className="container">
          <div className="sw-dots sw-pagination-slider justify-content-center"></div>
        </div>
      </div>
      <style jsx>{`
        .tf-slideshow {
          position: relative;
          width: 100vw;
          max-width: 100vw;
          min-height: 520px;
          background: #fafafa;
        }
        .wrap-slider {
          position: relative;
          width: 100vw;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .slideshow-img {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100vw !important;
          height: 100% !important;
          object-fit: cover !important;
          z-index: 1;
        }
        .slideshow-content-area {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding-left: 6vw;
          max-width: 700px;
        }
        .slideshow-title {
          font-size: 4.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #111;
          letter-spacing: -2px;
        }
        .slideshow-subtitle {
          font-size: 1.7rem;
          color: #222;
          margin-bottom: 2.5rem;
        }
        .slideshow-btn {
          display: inline-flex;
          align-items: center;
          background: #111;
          color: #fff;
          font-size: 1.35rem;
          font-weight: 600;
          border-radius: 2.5rem;
          padding: 0.85rem 2.7rem;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .slideshow-btn:hover {
          background: #222;
          color: #fff;
        }
        .wrap-pagination {
          position: absolute;
          bottom: 18px;
          left: 0;
          width: 100vw;
          z-index: 10;
        }
        .sw-pagination-slider {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 1200px) {
          .wrap-slider {
            height: 300px;
          }
          .slideshow-content-area {
            padding-left: 2vw;
            max-width: 500px;
          }
          .slideshow-title {
            font-size: 2.5rem;
          }
        }
        @media (max-width: 900px) {
          .wrap-slider {
            height: 220px;
          }
          .slideshow-content-area {
            padding-left: 0.5vw;
            max-width: 90vw;
            align-items: center;
            text-align: center;
          }
          .slideshow-title {
            font-size: 1.3rem;
          }
          .slideshow-subtitle {
            font-size: 1rem;
          }
        }
        @media (max-width: 600px) {
          .wrap-slider {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default MainSlideshow;
