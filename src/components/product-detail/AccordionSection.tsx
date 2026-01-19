import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";
import { useAuth } from "@/hooks/context/useAuth";
import toast from "react-hot-toast";
import { UserRole } from "@/constants/enums/UserRole";

import ReviewForm from "./ReviewForm";

import { useAddReview } from "@/hooks/services/reviews/useAddReview";
import { useLanguage } from "@/context/LanguageContext";
import { useGetProductRatings } from "@/hooks/services/settings";
import { ProductWithDiscountDTO } from "@/constants/models/Product";

interface AccordionSectionProps {
  product?: ProductWithDiscountDTO;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  product: productProp,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();
  const { productId } = router.query;
  const { userRole, userProfile } = useAuth();
  // Product ratings ayarını kontrol et
  const { isRatingEnabled } = useGetProductRatings();

  // Router'ın hazır olmasını bekle
  const isRouterReady = router.isReady;
  const validProductId =
    isRouterReady && productId ? (productId as string) : undefined;

  const productDetailResult = useProductDetail(validProductId);
  const { product: productFromHook, isLoading, error } = productDetailResult;

  // Prop'tan gelen product varsa onu kullan, yoksa hook'tan geleni kullan
  const product = productProp || productFromHook;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // ReviewForm'dan gelen review'i backend'e kaydeden fonksiyon
  const { addReview, isPending } = useAddReview();
  const handleReviewSubmit = async (review: any) => {
    if (!userProfile) {
      toast.error(t("accordionSection.messages.userInfoError"));
      return;
    }

    // Review objesine backend'in beklediği alanları ekle
    const fullReview = {
      ...review,
      customerId: userProfile.id,
      customerName: userProfile.fullName || "",
      modifiedValue: "", // Gerekirse buraya bir değer ekleyin
      id: "", // Backend otomatik oluşturuyorsa boş bırakılabilir
    };

    try {
      await addReview(fullReview);
      toast.success(t("accordionSection.messages.reviewSubmitSuccess"));
    } catch (error) {
      toast.error(t("accordionSection.messages.reviewSubmitError"));
    }
  };

  return (
    <section className="flat-spacing-12 pt_0" style={{ marginTop: "20px" }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {isLoading ? (
              <p>{t("accordionSection.messages.loading")}</p>
            ) : error ? (
              <p style={{ color: "#666", fontSize: "14px" }}>
                {t("accordionSection.messages.productError")}
              </p>
            ) : (
              <div className="widget-tabs style-two-col">
                <ul className="widget-menu-tab">
                  <li
                    className={`item-title ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("description")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">
                      {t("accordionSection.tabs.description")}
                    </span>
                  </li>
                  <li
                    className={`item-title ${
                      activeTab === "review" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("review")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">
                      {t("accordionSection.tabs.review")}
                    </span>
                  </li>
                  <li
                    className={`item-title ${
                      activeTab === "shipping" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("shipping")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">
                      {t("accordionSection.tabs.shipping")}
                    </span>
                  </li>
                  <li
                    className={`item-title ${
                      activeTab === "return" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("return")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">
                      {t("accordionSection.tabs.return")}
                    </span>
                  </li>
                </ul>
                <div className="widget-content-tab">
                  {/* Açıklama */}

                  <div
                    className={`widget-content-inner ${
                      activeTab === "description" ? "active" : ""
                    }`}
                  >
                    <div
                      className="product-description-section"
                      style={{ fontSize: "14px", color: "#666" }}
                    >
                      {(() => {
                        const descriptionText =
                          language === "en" && product?.descriptionEn
                            ? product.descriptionEn
                            : product?.description;

                        if (!descriptionText) return null;

                        // HTML tag'lerini temizle ve <br> tag'lerini newline'a çevir
                        let formattedText = descriptionText
                          .replace(/<br\s*\/?>/gi, "\n")
                          .replace(/<\/?[^>]+(>|$)/g, "");

                        // Metni formatla
                        const formatDescription = (text: string) => {
                          // Önce çift newline'ları paragraf ayırıcı olarak işaretle
                          let paragraphs = text
                            .split(/\n\n+/)
                            .map((para) => para.trim())
                            .filter((para) => para.length > 0);

                          // Eğer çift newline yoksa, tek newline'lara göre ayır
                          if (paragraphs.length === 1) {
                            paragraphs = text
                              .split(/\n/)
                              .map((para) => para.trim())
                              .filter((para) => para.length > 0);
                          }

                          return paragraphs.map((paragraph, idx) => {
                            // Madde işaretleri (·) ile başlayan veya içeren satırları liste yap
                            if (paragraph.includes("·")) {
                              const items = paragraph
                                .split(/·/)
                                .map((item) => item.trim())
                                .filter((item) => item.length > 0);

                              if (items.length > 1) {
                                return (
                                  <ul
                                    key={idx}
                                    style={{
                                      marginLeft: "20px",
                                      marginBottom: "15px",
                                      paddingLeft: "20px",
                                      listStyleType: "disc",
                                    }}
                                  >
                                    {items.map((item, itemIdx) => (
                                      <li
                                        key={itemIdx}
                                        style={{
                                          marginBottom: "8px",
                                          lineHeight: "1.6",
                                        }}
                                      >
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                );
                              }
                            }

                            // İki nokta üst üste ile biten ve kısa olan satırları başlık yap
                            if (
                              paragraph.endsWith(":") &&
                              paragraph.length < 100 &&
                              !paragraph.includes("·")
                            ) {
                              return (
                                <h4
                                  key={idx}
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    marginTop: idx > 0 ? "20px" : "0",
                                    marginBottom: "10px",
                                    color: "#333",
                                  }}
                                >
                                  {paragraph}
                                </h4>
                              );
                            }

                            // Özellik listesi formatı (Ebat, Ağırlık, vb.) - tek satırda
                            if (
                              paragraph.match(
                                /(Ebat|Ağırlık|Dış Malzeme|Astar|Aksesuar|Garanti|Özellikler|Garanti Süresi):/
                              )
                            ) {
                              // Özellikleri ayır - ":" ile ayrılmış kısımları bul
                              const features = paragraph
                                .split(/(?=[A-ZÇĞİÖŞÜ][a-zçğıöşü\s]+:)/)
                                .map((f) => f.trim())
                                .filter((f) => f.length > 0);

                              if (features.length > 1) {
                                return (
                                  <div
                                    key={idx}
                                    style={{
                                      marginBottom: "15px",
                                      marginTop: idx > 0 ? "15px" : "0",
                                    }}
                                  >
                                    {features.map((feature, fIdx) => {
                                      const colonIndex = feature.indexOf(":");
                                      if (colonIndex === -1) return null;
                                      const key = feature
                                        .substring(0, colonIndex)
                                        .trim();
                                      const value = feature
                                        .substring(colonIndex + 1)
                                        .trim();
                                      return (
                                        <div
                                          key={fIdx}
                                          style={{
                                            marginBottom: "8px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            lineHeight: "1.6",
                                          }}
                                        >
                                          <strong
                                            style={{
                                              marginRight: "8px",
                                              minWidth: "120px",
                                            }}
                                          >
                                            {key}:
                                          </strong>
                                          <span>{value}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }
                            }

                            // Normal paragraf
                            return (
                              <p
                                key={idx}
                                style={{
                                  marginBottom: "15px",
                                  lineHeight: "1.6",
                                  marginTop: idx > 0 ? "10px" : "0",
                                }}
                              >
                                {paragraph}
                              </p>
                            );
                          });
                        };

                        return (
                          <div style={{ whiteSpace: "pre-wrap" }}>
                            {formatDescription(formattedText)}
                          </div>
                        );
                      })()}
                    </div>
                    <br></br>
                    {/* {product?.technicalDetails &&
                    product.technicalDetails.length > 0 ? (
                      <div className="row" style={{ marginTop: "20px" }}>
                        {product.technicalDetails.map((detail, index) => {
                          const titleToShow =
                            language === "en" && detail.titleEn
                              ? detail.titleEn
                              : detail.title;
                          const descriptionToShow =
                            language === "en" && detail.descriptionEn
                              ? detail.descriptionEn
                              : detail.description;
                          return (
                            <div
                              key={detail.id || index}
                              className="col-md-4 mb-4"
                            >
                              <h3 className="fs-16 fw-5">{titleToShow}</h3>
                              <div
                                style={{
                                  whiteSpace: "pre-line",
                                  color: "#666",
                                }}
                              >
                                {descriptionToShow}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null} */}
                  </div>

                  {/* Değerlendirme */}
                  <div
                    className={`widget-content-inner ${
                      activeTab === "review" ? "active" : ""
                    }`}
                  >
                    {/* ReviewForm bileşeni ile yorum alanı */}
                    <ReviewForm
                      productId={productId as string}
                      onSubmit={handleReviewSubmit}
                      isRatingEnabled={isRatingEnabled}
                    />
                  </div>

                  {/* Kargo */}
                  <div
                    className={`widget-content-inner ${
                      activeTab === "shipping" ? "active" : ""
                    }`}
                  >
                    <div className="tf-page-privacy-policy">
                      <div className="title">
                        {t("accordionSection.titles.shippingInfo")}
                      </div>
                      <p>{t("accordionSection.shipping.info")}</p>
                    </div>
                  </div>

                  {/* İade */}
                  <div
                    className={`widget-content-inner ${
                      activeTab === "return" ? "active" : ""
                    }`}
                  >
                    <div className="tf-page-privacy-policy">
                      <div className="title">
                        {t("accordionSection.titles.returnPolicy")}
                      </div>
                      <p>{t("accordionSection.return.policy")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccordionSection;
