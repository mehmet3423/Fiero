"use client";

import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Controller } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  GeneralContentType,
  ContentLanguage,
} from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { useLanguage } from "@/context/LanguageContext";

interface ExploreItem {
  id: number | string;
  title: string;
  text: string;
  image: string;
  link: string;
}

const TestimonialSection: React.FC = () => {
  const { language } = useLanguage();
  const { contents, isLoading } = useGeneralContents(
    GeneralContentType.Explore
  );
  const [firstSwiper, setFirstSwiper] = useState<any>(null);
  const [secondSwiper, setSecondSwiper] = useState<any>(null);

  // Fallback data
  const fallbackTestimonials: ExploreItem[] = [
    {
      id: 1,
      title: "Robert Smith",
      text: "The shipping is always fast and the customer service team is friendly and helpful. I highly recommend this site to anyone looking for affordable clothing.",
      image: "/assets/site/images/slider/te4.jpg",
      link: "/product-detail",
    },
    {
      id: 2,
      title: "Jenifer Unix",
      text: "The shipping is always fast and the customer service team is friendly and helpful. I highly recommend this site to anyone looking for affordable clothing.",
      image: "/assets/site/images/slider/te6.jpg",
      link: "/product-detail",
    },
  ];

  // Transform general content to testimonial items
  const testimonialData = useMemo(() => {
    if (!contents || contents.length === 0) {
      return fallbackTestimonials;
    }

    // Mevcut dile göre ContentLanguage enum değerini belirle
    const currentContentLanguage =
      language === "en" ? ContentLanguage.EN : ContentLanguage.TR;

    // Order'a göre sırala
    const sortedContents = [...contents]
      .filter((item) => item.willRender !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Mevcut dildeki içerikleri filtrele
    let filteredContents = sortedContents.filter(
      (item) => item.language === currentContentLanguage
    );

    // Mevcut dilde içerik yoksa, Türkçe veya dil belirtilmemiş içerikleri göster
    if (filteredContents.length === 0) {
      filteredContents = sortedContents.filter(
        (item) =>
          item.language === ContentLanguage.TR || item.language === undefined
      );
    }

    // Hala içerik yoksa, tüm içerikleri göster
    const finalContents =
      filteredContents.length > 0 ? filteredContents : sortedContents;

    const testimonialItems = finalContents.map((item) => ({
      id: item.id,
      title: item.title || "",
      text: item.content || "",
      image: item.imageUrl || "/assets/site/images/slider/te4.jpg",
      link: item.contentUrl || "#",
    }));

    return testimonialItems.length > 0
      ? testimonialItems
      : fallbackTestimonials;
  }, [contents, language]);

  // Loading state - fallback göster
  if (isLoading) {
    return (
      <section
        className="flat-testimonial-v2 py-0 wow fadeInUp"
        data-wow-delay="0s"
      >
        <div className="container">
          <div
            className="wrapper-thumbs-testimonial-v2 type-1 flat-thumbs-testimonial"
            style={{ display: "flex", gap: "40px" }}
          >
            {/* Loading state için fallback gösterilebilir veya null döndürülebilir */}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="flat-testimonial-v2 py-0 wow fadeInUp"
      data-wow-delay="0s"
    >
      <div className="container">
        <div className="wrapper-thumbs-testimonial-v2 type-1 flat-thumbs-testimonial">
          <div className="box-left">
            <Swiper
              modules={[Navigation, Pagination, Controller]}
              slidesPerView={1}
              spaceBetween={40}
              speed={800}
              controller={{ control: secondSwiper }}
              onSwiper={setFirstSwiper}
              navigation={{
                nextEl: ".nav-next-tes-2",
                prevEl: ".nav-prev-tes-2",
              }}
              pagination={{
                clickable: true,
                el: ".sw-pagination-tes-2",
              }}
              breakpoints={{
                768: { spaceBetween: 30 },
                1024: { spaceBetween: 40 },
              }}
              className="tf-sw-tes-2"
            >
              {testimonialData.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="testimonial-item lg lg-2">
                    <div className="icon">
                      <img
                        className="lazyloaded"
                        data-src="/assets/site/images/item/quote.svg"
                        src="/assets/site/images/item/quote.svg"
                        alt="quote"
                      />
                    </div>
                    <div className="heading fs-12 mb_18">
                      {testimonial.title}
                    </div>
                    <div className="rating">
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                      <i className="icon-start"></i>
                    </div>
                    <p className="text">{testimonial.text}</p>
                    <div className="author box-author">
                      {/* <div
                        className="box-img d-md-none rounded-0"
                        style={{
                          width: "60px",
                          height: "60px",
                          overflow: "hidden",
                          borderRadius: "50%",
                        }}
                      >
                        <Image
                          className="lazyload img-product"
                          src={testimonial.image}
                          alt="image-product"
                          width={60}
                          height={60}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          unoptimized
                        />
                      </div> */}
                      <div className="content">
                        <Link
                          href={testimonial.link}
                          className="btn btn-dark btn-sm"
                        >
                          Keşfet ➤
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="d-md-flex d-none box-sw-navigation">
              <div className="nav-sw nav-next-slider nav-prev-tes-2">
                <span className="icon icon-arrow-left"></span>
              </div>
              <div className="nav-sw nav-prev-slider nav-next-tes-2">
                <span className="icon icon-arrow-right"></span>
              </div>
            </div>
            <div className="d-md-none sw-dots style-2 sw-pagination-tes-2"></div>
          </div>
          <div className="box-right">
            <Swiper
              modules={[Controller]}
              slidesPerView={1}
              spaceBetween={30}
              speed={800}
              controller={{ control: firstSwiper }}
              onSwiper={setSecondSwiper}
              allowTouchMove={false}
              className="tf-thumb-tes"
            >
              {testimonialData.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="grid-img-group style-ter-1">
                    <div className="hover-img">
                      <div
                        className="img-style"
                        style={{
                          width: "100%",
                          height: "300px",
                          overflow: "hidden",
                          borderRadius: "8px",
                        }}
                      >
                        <Image
                          className="lazyload"
                          src={testimonial.image}
                          alt="img-slider"
                          fill
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
