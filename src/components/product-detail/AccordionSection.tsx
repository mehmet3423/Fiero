import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";
import { useAuth } from "@/hooks/context/useAuth";
import toast from "react-hot-toast";
import { UserRole } from "@/constants/enums/UserRole";

import ReviewForm from "./ReviewForm";

import { useAddReview } from "@/hooks/services/reviews/useAddReview";
import { useLanguage } from "@/context/LanguageContext";

const AccordionSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();
  const { productId } = router.query;
  const { userRole, userProfile } = useAuth();

  const { product, isLoading, error } = useProductDetail(productId as string);

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
                    className={`item-title ${activeTab === "description" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("description")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">{t("accordionSection.tabs.description")}</span>
                  </li>
                  <li
                    className={`item-title ${activeTab === "review" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("review")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">{t("accordionSection.tabs.review")}</span>
                  </li>
                  <li
                    className={`item-title ${activeTab === "shipping" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("shipping")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">{t("accordionSection.tabs.shipping")}</span>
                  </li>
                  <li
                    className={`item-title ${activeTab === "return" ? "active" : ""
                      }`}
                    onClick={() => handleTabClick("return")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">{t("accordionSection.tabs.return")}</span>
                  </li>
                </ul>
                <div className="widget-content-tab">
                  {/* Açıklama */}
                  <div
                    className={`widget-content-inner ${activeTab === "description" ? "active" : ""
                      }`}
                  >
                    <div className="product-description-section" style={{ fontSize: "14px", color: "#666" }}>
                      <p style={{ margin: 0 }}>{product?.description}</p>
                    </div>
                    <br></br>
                    <div className="tf-product-des-demo">
                      <div className="right">
                        <h3 className="fs-16 fw-5">{t("accordionSection.titles.features")}</h3>
                        <ul>
                          <li>Front button placket</li>
                          <li> Adjustable sleeve tabs</li>
                          <li>Babaton embroidered crest at placket and hem</li>
                        </ul>
                        <h3 className="fs-16 fw-5">Materials Care</h3>
                        <ul className="mb-0">
                          <li>Content: 100% LENZING™ ECOVERO™ Viscose</li>
                          <li>Care: Hand wash</li>
                          <li>Imported</li>
                        </ul>
                      </div>
                      <div className="left">
                        <h3 className="fs-16 fw-5">{t("accordionSection.titles.materialsCare")}</h3>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-machine"></i>
                          </div>
                          <span>{t("accordionSection.careInstructions.machineWash")}</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-iron"></i>
                          </div>
                          <span>{t("accordionSection.careInstructions.iron")}</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-bleach"></i>
                          </div>
                          <span>{t("accordionSection.careInstructions.bleach")}</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-dry-clean"></i>
                          </div>
                          <span>{t("accordionSection.careInstructions.dryClean")}</span>
                        </div>
                        <div className="d-flex gap-10 align-items-center">
                          <div className="icon">
                            <i className="icon-tumble-dry"></i>
                          </div>
                          <span>{t("accordionSection.careInstructions.tumbleDry")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Değerlendirme */}
                  <div
                    className={`widget-content-inner ${activeTab === "review" ? "active" : ""
                      }`}
                  >
                    {/* ReviewForm bileşeni ile yorum alanı */}
                    <ReviewForm productId={productId as string} onSubmit={handleReviewSubmit} />
                  </div>

                  {/* Kargo */}
                  <div
                    className={`widget-content-inner ${activeTab === "shipping" ? "active" : ""
                      }`}
                  >
                    <div className="tf-page-privacy-policy">
                      <div className="title">{t("accordionSection.titles.shippingInfo")}</div>
                      <p>{t("accordionSection.shipping.info")}</p>
                    </div>
                  </div>

                  {/* İade */}
                  <div
                    className={`widget-content-inner ${activeTab === "return" ? "active" : ""
                      }`}
                  >
                    <div className="tf-page-privacy-policy">
                      <div className="title">{t("accordionSection.titles.returnPolicy")}</div>
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
