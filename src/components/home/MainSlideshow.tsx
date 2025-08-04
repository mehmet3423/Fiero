import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
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
    <div className={`tf-slideshow slider-women slider-effect-fade position-relative ${className}`}>
      <Swiper
        modules={[EffectFade, Pagination, Autoplay]}
        effect="fade"
        pagination={{ clickable: true, el: ".sw-pagination-slider" }}
        autoplay={{
          delay: 4000, 
          disableOnInteraction: false, 
          pauseOnMouseEnter: true 
        }}
        loop={true}
        slidesPerView={1}
        className="swiper tf-sw-slideshow"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="wrap-slider">
              <img 
                src={slide.image}
                alt={slide.title || "Slideshow"}
                className="lazyload"
              />
              <div className="box-content">
                <div className="container">
                  {slide.title && <h1 className="fade-item fade-item-1">{slide.title}</h1>}
                  {slide.subtitle && <p className="fade-item fade-item-2">{slide.subtitle}</p>}
                  {slide.buttonText && slide.buttonLink && (
                    <Link href={slide.buttonLink} className="fade-item fade-item-3 tf-btn btn-fill animate-hover-btn btn-xl radius-60">
                      <span>{slide.buttonText}</span>
                      <i className="icon icon-arrow-right"></i>
                    </Link>
                  )}
                </div>
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
    </div>
  );
};

export default MainSlideshow;
