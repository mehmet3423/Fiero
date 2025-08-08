import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useProductDetail } from "@/hooks/services/products/useProductDetail";

const AccordionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();
  const { productId } = router.query;

  // Backend'den ürün verisini al
  const { product, isLoading, error } = useProductDetail(productId as string);

  // Debug için product.description'ı konsola yazdır
  useEffect(() => {
    console.log("Backend'den gelen product.description:", product?.description);
  }, [product]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="flat-spacing-12 pt_0" style={{ marginTop: "20px" }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {isLoading ? (
              <p>Yükleniyor...</p> // Yüklenme durumu için placeholder
            ) : error ? (
              <p style={{ color: "#666", fontSize: "14px" }}>
                Ürün verisi alınamadı.
              </p>
            ) : (
              <div className="widget-tabs style-two-col">
                <ul className="widget-menu-tab">
                  <li
                    className={`item-title ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => handleTabClick("description")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">Açıklama</span>
                  </li>
                  <li
                    className={`item-title ${activeTab === "review" ? "active" : ""}`}
                    onClick={() => handleTabClick("review")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">Değerlendirme</span>
                  </li>
                  <li
                    className={`item-title ${activeTab === "shipping" ? "active" : ""}`}
                    onClick={() => handleTabClick("shipping")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">Kargo</span>
                  </li>
                  <li
                    className={`item-title ${activeTab === "return" ? "active" : ""}`}
                    onClick={() => handleTabClick("return")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span className="inner">İade Politikaları</span>
                  </li>
                </ul>
                <div className="widget-content-tab">
                  <div className={`widget-content-inner ${activeTab === "description" ? "active" : ""}`}>
                    <div>
                      {/* Ürün açıklaması kısmı */}
                      {product?.description ? (
                        <div
                          className="product-description-section"
                          style={{
                            marginTop: "20px",
                            paddingTop: "20px",
                            fontSize: "14px",
                            color: "#666",
                          }}
                        >
                          <p style={{ margin: 0 }}>{product.description}</p>
                        </div>
                      ) : (
                        <p style={{ color: "#666", fontSize: "14px" }}>
                          Ürün açıklaması bulunamadı.
                        </p>
                      )}
                      <br></br>
                      {/* Mevcut Features ve Materials Care kısımları */}
                      <div className="tf-product-des-demo">
                        <div className="right">
                          <h3 className="fs-16 fw-5">Özellikler</h3>
                          <ul>
                            <li>Ön düğmeli pat</li>
                            <li>Ayarlanabilir kol sekmeleri</li>
                            <li>Babaton nakışlı arma patta ve etekte</li>
                          </ul>
                          <h3 className="fs-16 fw-5">Materyal ve Bakım</h3>
                          <ul className="mb-0">
                            <li>İçerik: %100 LENZING™ ECOVERO™ Viskon</li>
                            <li>Bakım: Elde yıkama</li>
                            <li>İthal</li>
                          </ul>
                        </div>
                        <div className="left">
                          <h3 className="fs-16 fw-5">Materyal ve Bakım</h3>
                          <div className="d-flex gap-10 mb_15 align-items-center">
                            <div className="icon">
                              <i className="icon-machine"></i>
                            </div>
                            <span>Maksimum 30ºC'de makinede yıkayın. Kısa devir.</span>
                          </div>
                          <div className="d-flex gap-10 mb_15 align-items-center">
                            <div className="icon">
                              <i className="icon-iron"></i>
                            </div>
                            <span>Maksimum 110ºC'de ütüleyin.</span>
                          </div>
                          <div className="d-flex gap-10 mb_15 align-items-center">
                            <div className="icon">
                              <i className="icon-bleach"></i>
                            </div>
                            <span>Ağartıcı kullanmayın.</span>
                          </div>
                          <div className="d-flex gap-10 mb_15 align-items-center">
                            <div className="icon">
                              <i className="icon-dry-clean"></i>
                            </div>
                            <span>Kuru temizleme yapmayın.</span>
                          </div>
                          <div className="d-flex gap-10 align-items-center">
                            <div className="icon">
                              <i className="icon-tumble-dry"></i>
                            </div>
                            <span>Orta ısıda tamburlu kurutma.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`widget-content-inner ${activeTab === "review" ? "active" : ""}`}>
                    <table className="tf-pr-attrs">
                      <tbody>
                        <tr className="tf-attr-pa-color">
                          <th className="tf-attr-label">Renk</th>
                          <td className="tf-attr-value">
                            <p>Beyaz, Pembe, Siyah</p>
                          </td>
                        </tr>
                        <tr className="tf-attr-pa-size">
                          <th className="tf-attr-label">Beden</th>
                          <td className="tf-attr-value">
                            <p>S, M, L, XL</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className={`widget-content-inner ${activeTab === "shipping" ? "active" : ""}`}>
                    <div className="tf-page-privacy-policy">
                      <div className="title">Kargo Bilgileri</div>
                      <p>Kargo politikaları ve teslimat süreleri hakkında detaylar.</p>
                    </div>
                  </div>
                  <div className={`widget-content-inner ${activeTab === "return" ? "active" : ""}`}>
                    <div className="tf-page-privacy-policy">
                      <div className="title">İade Politikaları</div>
                      <p>İade politikaları ve prosedürleri hakkında detaylar.</p>
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