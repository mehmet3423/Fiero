import React, { useState } from "react";

const AccordionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("description");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="flat-spacing-12 pt_0" style={{ marginTop: "20px" }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="widget-tabs style-two-col">
              <ul className="widget-menu-tab">
                <li
                  className={`item-title ${activeTab === "description" ? "active" : ""}`}
                  onClick={() => handleTabClick("description")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="inner">Description</span>
                </li>
                <li
                  className={`item-title ${activeTab === "review" ? "active" : ""}`}
                  onClick={() => handleTabClick("review")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="inner">Review</span>
                </li>
                <li
                  className={`item-title ${activeTab === "shipping" ? "active" : ""}`}
                  onClick={() => handleTabClick("shipping")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="inner">Shipping</span>
                </li>
                <li
                  className={`item-title ${activeTab === "return" ? "active" : ""}`}
                  onClick={() => handleTabClick("return")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="inner">Return Policies</span>
                </li>
              </ul>
              <div className="widget-content-tab">
                <div className={`widget-content-inner ${activeTab === "description" ? "active" : ""}`}>
                  <div>
                    <p className="mb_30">
                      Button-up shirt sleeves and a relaxed silhouette. It’s tailored with drapey,
                      crinkle-texture fabric that’s made from LENZING™ ECOVERO™ Viscose — responsibly
                      sourced wood-based fibres produced through a process that reduces impact on forests, biodiversity and
                      water supply.
                    </p>
                    <div className="tf-product-des-demo">
                      <div className="right">
                        <h3 className="fs-16 fw-5">Features</h3>
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
                        <h3 className="fs-16 fw-5">Materials Care</h3>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-machine"></i>
                          </div>
                          <span>Machine wash max. 30ºC. Short spin.</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-iron"></i>
                          </div>
                          <span>Iron maximum 110ºC.</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-bleach"></i>
                          </div>
                          <span>Do not bleach/bleach.</span>
                        </div>
                        <div className="d-flex gap-10 mb_15 align-items-center">
                          <div className="icon">
                            <i className="icon-dry-clean"></i>
                          </div>
                          <span>Do not dry clean.</span>
                        </div>
                        <div className="d-flex gap-10 align-items-center">
                          <div className="icon">
                            <i className="icon-tumble-dry"></i>
                          </div>
                          <span>Tumble dry, medium heat.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`widget-content-inner ${activeTab === "review" ? "active" : ""}`}>
                  <table className="tf-pr-attrs">
                    <tbody>
                      <tr className="tf-attr-pa-color">
                        <th className="tf-attr-label">Color</th>
                        <td className="tf-attr-value">
                          <p>White, Pink, Black</p>
                        </td>
                      </tr>
                      <tr className="tf-attr-pa-size">
                        <th className="tf-attr-label">Size</th>
                        <td className="tf-attr-value">
                          <p>S, M, L, XL</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={`widget-content-inner ${activeTab === "shipping" ? "active" : ""}`}>
                  <div className="tf-page-privacy-policy">
                    <div className="title">Shipping Information</div>
                    <p>Details about shipping policies and delivery times.</p>
                  </div>
                </div>
                <div className={`widget-content-inner ${activeTab === "return" ? "active" : ""}`}>
                  <div className="tf-page-privacy-policy">
                    <div className="title">Return Policies</div>
                    <p>Details about return policies and procedures.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccordionSection;
