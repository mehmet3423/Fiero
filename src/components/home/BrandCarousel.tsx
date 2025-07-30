import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const brands = [
  { name: "ASOS", img: "/assets/site/images/brand/brand-01.png" },
  { name: "PULL&BEAR", img: "/assets/site/images/brand/brand-02.png" },
  { name: "GILDAN", img: "/assets/site/images/brand/brand-03.png" },
  { name: "SSENSE", img: "/assets/site/images/brand/brand-04.png" },
  { name: "BURBERRY", img: "/assets/site/images/brand/brand-05.png" },
  { name: "NIKE", img: "/assets/site/images/brand/brand-06.png" },
];

const BrandCarousel: React.FC = () => {
  return (
    <section className="flat-spacing-12">
      <div className="">
        <div className="wrap-carousel wrap-brand wrap-brand-v2 autoplay-linear">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={6}
            spaceBetween={30}
            loop={true}
            autoplay={{ 
              delay: 0, 
              disableOnInteraction: false, 
              pauseOnMouseEnter: true 
            }}
            speed={3500}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 15 },
              1024: { slidesPerView: 6, spaceBetween: 30 },
            }}
            className="tf-sw-brand border-0"
            data-play="true"
            data-loop="true"
            data-preview="6"
            data-tablet="4"
            data-mobile="2"
            data-space-lg="30"
            data-space-md="15"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.name}>
                <div className="brand-item-v2">
                  <img
                    className="lazyload"
                    data-src={brand.img}
                    src={brand.img}
                    alt="image-brand"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
