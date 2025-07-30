import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const iconBoxes = [
  {
    icon: "icon-shipping",
    title: "Free Shipping",
    desc: "Free shipping over order $120",
  },
  {
    icon: "icon-payment fs-22",
    title: "Flexible Payment",
    desc: "Pay with Multiple Credit Cards",
  },
  {
    icon: "icon-return fs-22",
    title: "14 Day Returns",
    desc: "Within 30 days for an exchange",
  },
  {
    icon: "icon-suport",
    title: "Premium Support",
    desc: "Outstanding premium support",
  },
];

const IconBoxModern = () => (
  <section className="flat-spacing-11 pb_0 flat-iconbox wow fadeInUp" data-wow-delay="0s">
    <div className="container">
      <div className="wrap-carousel wrap-mobile">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={15}
          pagination={{ 
            clickable: true, 
            el: ".sw-pagination-mb" 
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 15 }
          }}
          className="tf-sw-mobile"
        >
          <div className="swiper-wrapper wrap-iconbox">
            {iconBoxes.map((box, i) => (
              <SwiperSlide key={i}>
                <div className="tf-icon-box style-border-line text-center">
                  <div className="icon">
                    <i className={box.icon}></i>
                  </div>
                  <div className="content">
                    <div className="title">{box.title}</div>
                    <p>{box.desc}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
        <div className="sw-dots style-2 sw-pagination-mb justify-content-center"></div>
      </div>
    </div>
  </section>
);

export default IconBoxModern;
