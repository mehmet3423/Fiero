import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const brands = [
  { name: "ASOS", img: "assets/site/images/brand/brand-01.png" },
  { name: "PULL&BEAR", img: "assets/site/images/brand/brand-02.png" },
  { name: "GILDAN", img: "assets/site/images/brand/brand-03.png" },
  { name: "SSENSE", img: "assets/site/images/brand/brand-04.png" },
  { name: "BURBERRY", img: "assets/site/images/brand/brand-05.png" },
  { name: "NIKE", img: "assets/site/images/brand//brand-06.png" },
];

const BrandCarousel: React.FC = () => {
  return (
    <section className="brand-section">
      <div className="brand-carousel-wrapper">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={6}
          spaceBetween={40}
          loop={true}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={3500}
          breakpoints={{
            1200: { slidesPerView: 6 },
            900: { slidesPerView: 4 },
            600: { slidesPerView: 3 },
            0: { slidesPerView: 2 },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.name}>
              <div className="brand-item-v2">
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="brand-img"
                  loading="lazy"
                  style={{ maxHeight: 48, maxWidth: 160, width: "auto", height: "48px", objectFit: "contain", margin: "0 auto" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style jsx>{`
        .brand-section {
          background: #fff;
          padding: 2.5rem 0 2.5rem 0;
        }
        .brand-carousel-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        .brand-item-v2 {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
        }
        .brand-img {
          filter: grayscale(1);
          opacity: 0.9;
          transition: filter 0.2s, opacity 0.2s;
        }
        .brand-img:hover {
          filter: grayscale(0);
          opacity: 1;
        }
        @media (max-width: 900px) {
          .brand-section {
            padding: 1.5rem 0;
          }
          .brand-img {
            max-height: 36px;
          }
        }
        @media (max-width: 600px) {
          .brand-section {
            padding: 1rem 0;
          }
          .brand-img {
            max-height: 28px;
          }
        }
      `}</style>
    </section>
  );
};

export default BrandCarousel;
