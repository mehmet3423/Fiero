"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GeneralContentType,
  ContentLanguage,
} from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { useLanguage } from "@/context/LanguageContext";

const ShopCollection: React.FC = () => {
  const { language } = useLanguage();
  const { contents, isLoading } = useGeneralContents(
    GeneralContentType.ShopCollection
  );

  const shopCollectionContent = useMemo(() => {
    if (!contents || contents.length === 0) {
      return null;
    }

    // Mevcut dile göre ContentLanguage enum değerini belirle
    const currentContentLanguage =
      language === "en" ? ContentLanguage.EN : ContentLanguage.TR;

    // Order'a göre sırala
    const sortedContents = [...contents]
      .filter((item) => item.willRender !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Önce mevcut dildeki içeriği bul
    let selectedContent =
      sortedContents.find((item) => item.language === currentContentLanguage) ||
      null;

    // Mevcut dilde içerik yoksa, Türkçe içeriği dene
    if (!selectedContent) {
      selectedContent =
        sortedContents.find((item) => item.language === ContentLanguage.TR) ||
        null;
    }

    // Hala içerik yoksa, ilk içeriği al
    if (!selectedContent) {
      selectedContent = sortedContents[0] || null;
    }

    if (!selectedContent) {
      return null;
    }

    return {
      title: selectedContent.title || "Modayı Yeniden Tanımlayalım",
      imageUrl:
        selectedContent.imageUrl || "/assets/site/images/collections/pabuc.jpg",
      contentUrl: selectedContent.contentUrl || "/shop-collection-list",
      buttonText: selectedContent.content || "Keşfet ➤",
    };
  }, [contents, language]);

  // Loading state
  if (isLoading) {
    return null; // veya loading spinner eklenebilir
  }

  // İçerik yoksa render etme
  if (!shopCollectionContent) {
    return null;
  }

  return (
    <section className="flat-spacing-19">
      <div className="container">
        <div className="tf-grid-layout md-col-2 style-1">
          <div className="tf-image-wrap wow fadeInUp" data-wow-delay="0s">
            <Image
              className="lazyload"
              src={shopCollectionContent.imageUrl}
              alt={shopCollectionContent.title}
              width={800}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
              unoptimized
            />
          </div>
          <div className="tf-content-wrap wow fadeInUp" data-wow-delay="0s">
            <div className="heading">
              {shopCollectionContent.title.includes("\n")
                ? shopCollectionContent.title
                    .split("\n")
                    .map((line, index, array) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                      </React.Fragment>
                    ))
                : shopCollectionContent.title}
            </div>

            <Link
              href={shopCollectionContent.contentUrl}
              className="tf-btn style-2 btn-fill rounded-full animate-hover-btn"
            >
              {shopCollectionContent.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCollection;
