import GeneralSupportTicket from "@/components/support-ticket/GeneralSupportTicket";
import OrderSupportTicket from "@/components/support-ticket/OrderSupportTicket";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SEOHead from "@/components/SEO/SEOHead";

function SupportTicketPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    // URL'e göre aktif tab'ı belirle
    if (router.asPath.includes("#order")) {
      setActiveTab("order");
    } else {
      setActiveTab("general");
    }
  }, [router.asPath]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "order") {
      router.push("/support-ticket#order", undefined, { shallow: true });
    } else {
      router.push("/support-ticket#general", undefined, { shallow: true });
    }
  };

  return (
    <>
      <SEOHead canonical="/support-ticket" />
      <main className="main">
        <div
          className="page-header text-center"
          style={{ backgroundImage: 'url("/assets/images/page-header-bg.jpg")' }}
        >
          <div className="container">
            <h3 className="page-title">
              Destek Talebi
            </h3>
          </div>
        </div>

        <div className="page-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="form-tab mb-4">
                      <ul
                        className="nav nav-pills nav-justified nav-lg nav-border-anim"
                        role="tablist"
                        style={{
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          marginBottom: "2.5rem",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <li className="nav-item " style={{ flex: 1 }}>
                          <button
                            className={`nav-link py-3 px-4 ${activeTab === "general" ? "active" : ""
                              }`}
                            onClick={() => handleTabClick("general")}
                            type="button"
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 600,
                              borderRadius: 0,
                              background:
                                activeTab === "general" ? "#fff" : "transparent",
                              color: activeTab === "general" ? "#222" : "#888",
                              boxShadow:
                                activeTab === "general"
                                  ? "0 2px 8px rgba(0,0,0,0.04)"
                                  : "none",
                              borderBottom:
                                activeTab === "general"
                                  ? "2px solid #0d6efd"
                                  : "2px solid transparent",
                              transition: "all 0.2s",
                              display: "flex", // Ekle
                              justifyContent: "center", // Ekle
                              alignItems: "center", // Ekle
                              gap: "0.5rem", // Ekle: ikon ile metin arası boşluk
                              width: "100%", // Tam genişlik (nav-item zaten flex:1)
                            }}
                          >
                            <i
                              className="bx bx-support me-2 mr-2"
                              style={{ fontSize: "1.3rem" }}
                            ></i>
                            Genel Destek
                          </button>
                        </li>
                        <li className="nav-item" style={{ flex: 1 }}>
                          <button
                            className={`nav-link py-3 px-4 ${activeTab === "order" ? "active" : ""
                              }`}
                            onClick={() => handleTabClick("order")}
                            type="button"
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 600,
                              borderRadius: 0,
                              background:
                                activeTab === "order" ? "#fff" : "transparent",
                              color: activeTab === "order" ? "#222" : "#888",
                              boxShadow:
                                activeTab === "order"
                                  ? "0 2px 8px rgba(0,0,0,0.04)"
                                  : "none",
                              borderBottom:
                                activeTab === "order"
                                  ? "2px solid #0d6efd"
                                  : "2px solid transparent",
                              transition: "all 0.2s",
                              display: "flex", // Ekle
                              justifyContent: "center", // Ekle
                              alignItems: "center", // Ekle
                              gap: "0.5rem", // Ekle: ikon ile metin arası boşluk
                              width: "100%",
                            }}
                          >
                            <i
                              className="bx bx-package me-2"
                              style={{ fontSize: "1.3rem" }}
                            ></i>
                            Sipariş Desteği
                          </button>
                        </li>
                      </ul>

                      <div className="tab-content">
                        <div
                          className={`tab-pane fade ${activeTab === "general" ? "show active" : ""
                            }`}
                          id="general"
                          role="tabpanel"
                          aria-labelledby="general-tab"
                        >
                          <GeneralSupportTicket />
                        </div>

                        <div
                          className={`tab-pane fade ${activeTab === "order" ? "show active" : ""
                            }`}
                          id="order"
                          role="tabpanel"
                          aria-labelledby="order-tab"
                        >
                          <OrderSupportTicket />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .nav-pills {
            border-bottom: 1px solid #ebebeb;
            margin-bottom: 2rem;
          }

          .nav-pills .nav-link {
            font-size: 1rem;
            font-weight: 500;
            color: #666;
            padding: 1rem;
            transition: all 0.35s ease;
            background: none;
            border: none;
            position: relative;
          }

          .nav-pills .nav-link.active {
            color: #040404;
            background-color: transparent;
          }

          .nav-border-anim .nav-link:before {
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 100%;
            height: 2px;
            background-color: #040404;
            transform-origin: right center;
            transform: scale(0, 1);
            transition: transform 0.3s ease;
          }

          .nav-border-anim .nav-link.active:before {
            transform-origin: left center;
            transform: scale(1, 1);
          }

          .tab-pane {
            padding: 1rem 0;
          }

          @media (max-width: 767px) {
            .nav-pills .nav-link {
              padding: 0.5rem;
              font-size: 0.9rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}

export default SupportTicketPage;
