"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  GeneralContentType,
  ContentLanguage,
} from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { useLanguage } from "@/context/LanguageContext";

interface IconBoxItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

// Fallback data
const fallbackIconBoxes: IconBoxItem[] = [
  {
    id: "1",
    icon: "icon-shipping",
    title: "Free Shipping",
    desc: "Free shipping over order $120",
  },
  {
    id: "2",
    icon: "icon-payment fs-22",
    title: "Flexible Payment",
    desc: "Pay with Multiple Credit Cards",
  },
  {
    id: "3",
    icon: "icon-return fs-22",
    title: "14 Day Returns",
    desc: "Within 30 days for an exchange",
  },
  {
    id: "4",
    icon: "icon-suport",
    title: "Premium Support",
    desc: "Outstanding premium support",
  },
];

const IconBoxModern: React.FC = () => {
  const { language } = useLanguage();
  const { contents, isLoading } = useGeneralContents(
    GeneralContentType.IconBoxModern
  );

  // Transform general content to icon box items
  const iconBoxes = useMemo(() => {
    if (!contents || contents.length === 0) {
      return fallbackIconBoxes;
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

    // Icon bilgisini content alanından parse et (JSON formatında olabilir)
    const iconBoxItems: IconBoxItem[] = finalContents.map((item) => {
      let iconClass = "icon-shipping"; // Default icon

      // Content alanında icon bilgisi varsa parse et
      if (item.content) {
        try {
          const parsedContent = JSON.parse(item.content);
          if (parsedContent.icon) {
            iconClass = parsedContent.icon;
          }
        } catch {
          // JSON değilse, content'i direkt icon class olarak kullan
          // Veya title'dan icon class'ını çıkar
          // Şimdilik default icon kullanıyoruz
        }
      }

      // Icon class'ını title'dan da çıkarabiliriz (örn: "icon-shipping" formatında)
      // Ama şimdilik content'ten parse ediyoruz

      return {
        id: item.id,
        icon: iconClass,
        title: item.title || "",
        desc: item.content || "",
      };
    });

    return iconBoxItems.length > 0 ? iconBoxItems : fallbackIconBoxes;
  }, [contents, language]);

  // Loading state - fallback göster
  if (isLoading) {
    return (
      <section
        className="flat-spacing-11 pb_0 flat-iconbox wow fadeInUp"
        data-wow-delay="0s"
      >
        <div className="container">
          <div className="wrap-carousel wrap-mobile">
            {/* Loading state için fallback gösterilebilir */}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="flat-spacing-11 pb_0 flat-iconbox wow fadeInUp"
      data-wow-delay="0s"
    >
      <div className="container">
        <div className="wrap-carousel wrap-mobile">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={15}
            pagination={{
              clickable: true,
              el: ".sw-pagination-mb",
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 15 },
            }}
            className="tf-sw-mobile"
          >
            <div className="swiper-wrapper wrap-iconbox">
              {iconBoxes.map((box) => (
                <SwiperSlide key={box.id}>
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
};

export default IconBoxModern;
