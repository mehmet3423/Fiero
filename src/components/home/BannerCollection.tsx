"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

interface BannerItem {
  id: number | string;
  title?: string;
  alt?: string;
  image: string;
  link: string;
}

interface BannerCollectionProps {
  banners: BannerItem[];
}

const BannerCollection: React.FC<BannerCollectionProps> = ({ banners }) => {
  console.log(banners);
  return (
    <section className="flat-spacing-10 pb_0">
      <div className="container">
        <Swiper
          modules={[Pagination]}
          slidesPerView={2}
          spaceBetween={30}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.3,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
          }}
          className="tf-sw-recent"
        >
          {banners?.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="collection-item-v4 hover-img">
                <div className="collection-inner">
                  <Link
                    href={item.link}
                    className="collection-image img-style radius-10"
                    style={{ position: "relative", height: "610px" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt || item.title || "Banner"}
                      fill
                      className="object-cover rounded-[10px]"
                      unoptimized
                    />
                  </Link>

                  <div
                    className="collection-content wow fadeInUp"
                    data-wow-delay="0s"
                  >
                    {item.title && (
                      <h5 className="heading text_white">{item.title}</h5>
                    )}
                    <Link
                      href={item.link}
                      className="tf-btn style-3 fw-6 btn-light-icon rounded-full animate-hover-btn"
                    >
                      <span>Keşfet</span>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BannerCollection;
