"use client";

import { PathEnums } from "@/constants/enums/PathEnums";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <footer id="footer" className="footer md-pb-70">
        <div className="footer-wrap">
          <div className="footer-body">
            <div className="container">
              <div className="row">
                {/* Logo ve İletişim Bilgileri */}
                <div className="col-xl-3 col-md-6 col-12">
                  <div className="footer-infor">
                    <div className="footer-logo">
                      <Link href="/">LOGO</Link>
                    </div>
                    <ul>
                      <li>
                        <p>{t("footer.address")}</p>
                      </li>
                      <li>
                        <p>
                          {t("footer.email")}:{" "}
                          <a href="mailto:siparis@desa.com.tr">
                            email@hotmail.com
                          </a>
                        </p>
                      </li>
                      <li>
                        <p>
                          {t("footer.phone")}:{" "}
                          <a href="tel:02124731800">444 44 44</a>
                        </p>
                      </li>
                    </ul>
                    <Link href="/contact-us" className="tf-btn btn-line">
                      {t("footer.getDirections")}
                      <i className="icon icon-arrow1-top-left"></i>
                    </Link>
                    <ul className="tf-social-icon d-flex gap-10">
                      <li>
                        <a
                          href="/"
                          className="box-icon w_34 round social-facebook social-line"
                          target="_blank"
                        >
                          <i className="icon fs-14 icon-fb"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/"
                          className="box-icon w_34 round social-instagram social-line"
                          target="_blank"
                        >
                          <i className="icon fs-14 icon-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/"
                          className="box-icon w_34 round social-youtube social-line"
                          target="_blank"
                        >
                          <i
                            className="icon fs-10 icon-play"
                            style={{
                              border: "1px solid #000",
                              padding: "2px 4px",
                              borderRadius: "2px",
                              backgroundColor: "#000",
                              color: "#fff",
                              fontSize: "8px",
                            }}
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Yardım Bölümü */}
                <div className="col-xl-3 col-md-6 col-12 footer-col-block ">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>{t("footer.help")}</h6>
                  </div>
                  <div
                    className="footer-heading footer-heading-mobile"
                    onClick={() => toggleSection("help")}
                    style={{ cursor: "pointer" }}
                  >
                    <h6>
                      {t("footer.help")}
                      <span style={{ float: "right" }}>
                        {openSection === "help" ? "−" : "+"}
                      </span>
                    </h6>
                  </div>
                  <ul
                    className={`footer-menu-list tf-collapse-content ${openSection === "help" ? "is-show" : ""
                      }`}
                  >
                    <li>
                      <Link href="/policies" className="footer-menu_item">
                        {t("footer.policies")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/distance-sales-agreement"
                        className="footer-menu_item"
                      >
                        {t("footer.returns")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="footer-menu_item">
                        {t("footer.terms")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="footer-menu_item">
                        {t("footer.faq")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/compare-products" className="footer-menu_item">
                        {t("footer.compare")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/favorites" className="footer-menu_item">
                        {t("footer.favorites")}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Hakkımızda Bölümü */}
                <div className="col-xl-3 col-md-6 col-12 footer-col-block ">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>{t("footer.about")}</h6>
                  </div>
                  <div
                    className="footer-heading footer-heading-mobile"
                    onClick={() => toggleSection("about")}
                    style={{ cursor: "pointer" }}
                  >
                    <h6>
                      {t("footer.about")}
                      <span style={{ float: "right" }}>
                        {openSection === "about" ? "−" : "+"}
                      </span>
                    </h6>
                  </div>
                  <ul
                    className={`footer-menu-list tf-collapse-content ${openSection === "about" ? "is-show" : ""
                      }`}
                  >
                    <li>
                      <Link href="/about-us" className="footer-menu_item">
                        {t("footer.ourStory")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/store-locations" className="footer-menu_item">
                        {t("footer.stores")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="footer-menu_item">
                        {t("footer.contact")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="footer-menu_item">
                        {t("footer.account")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/about-desa-tr" className="footer-menu_item">
                        {t("footer.investorRelations")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/about-desa/about" className="footer-menu_item">
                        {t("footer.aboutUs")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/support-ticket" className="footer-menu_item">
                        {t("footer.supportTicket")}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* E-posta Kaydı Bölümü */}
                <div className="col-xl-3 col-md-6 col-12">
                  <div className="footer-newsletter footer-col-block">
                    <div className="footer-heading footer-heading-desktop">
                      <h6>{t("footer.newsletter")}</h6>
                    </div>
                    <div
                      className="footer-heading footer-heading-mobile"
                      onClick={() => toggleSection("newsletter")}
                      style={{ cursor: "pointer" }}
                    >
                      <h6>
                        {t("footer.newsletter")}
                        <span style={{ float: "right" }}>
                          {openSection === "newsletter" ? "−" : "+"}
                        </span>
                      </h6>
                    </div>
                    <div
                      className={`tf-collapse-content ${openSection === "newsletter" ? "is-show" : ""
                        }`}
                    >
                      <div className="footer-menu_item">
                        {t("footer.newsletterDescription")}
                      </div>
                      <form
                        className="form-newsletter subscribe-form"
                        id="subscribe-form"
                        action="#"
                        method="post"
                        acceptCharset="utf-8"
                        data-mailchimp="true"
                      >
                        <div className="subscribe-content">
                          <fieldset className="email">
                            <input
                              type="email"
                              name="email-form"
                              className="subscribe-email"
                              placeholder={t("footer.email")}
                              tabIndex={0}
                              aria-required="true"
                            />
                          </fieldset>
                          <div className="button-submit">
                            <button
                              className="subscribe-button tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                              type="button"
                            >
                              {t("footer.subscribe")}
                              <i className="icon icon-arrow1-top-left"></i>
                            </button>
                          </div>
                        </div>
                        <div className="subscribe-msg"></div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Alt Bölümü */}
          <div className="footer-bottom">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                    <div className="footer-menu_item">{t("footer.copyright")}</div>
                    <div className="tf-payment col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
                      <div className="d-flex justify-content-center justify-content-md-end gap-1 align-items-center flex-wrap">
                        <img
                          src="/assets/site/images/payments/visa.webp"
                          alt="Payment methods"
                          title="Kabul Edilen Ödeme Yöntemleri"
                          width="40px"
                          height="auto"
                        />
                        <img
                          src="/assets/site/images/payments/mastercard.webp"
                          alt="Payment methods"
                          title="Kabul Edilen Ödeme Yöntemleri"
                          width="40px"
                          height="auto"
                        />
                        <img
                          src="/assets/site/images/payments/applepay.webp"
                          alt="Payment methods"
                          title="Kabul Edilen Ödeme Yöntemleri"
                          width="40px"
                          height="auto"
                        />
                        <img
                          src="/assets/site/images/payments/americanexpress.webp"
                          alt="Payment methods"
                          title="Kabul Edilen Ödeme Yöntemleri"
                          width="40px"
                          height="auto"
                        />
                        <img
                          src="/assets/site/images/payments/cb.webp"
                          alt="Payment methods"
                          title="Kabul Edilen Ödeme Yöntemleri"
                          width="40px"
                          height="auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
  /* Desktop görünüm */
  .footer-heading-desktop {
    display: block;
  }
  .footer-heading-mobile {
    display: none;
  }
  .tf-collapse-content {
    display: block;
  }

  /* Footer column spacing */
  .footer-col-block {
    margin-bottom: 2rem;
  }

  /* Mobile görünüm */
  @media (max-width: 767px) {
    .footer-heading-desktop {
      display: none !important;
    }
    
    .footer-heading-mobile {
      display: block !important;
      cursor: pointer;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
      margin-bottom: 0 !important;
    }
    
    .footer-heading-mobile h6 {
      margin: 0;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .tf-collapse-content {
      display: none !important;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .tf-collapse-content.is-show {
      display: block !important;
      padding-top: 15px;
    }
    
    .footer-col-block {
      margin-bottom: 0 !important;
    }
    
    .footer-menu-list {
      padding-left: 0;
      margin: 0;
    }
    
    .footer-menu-list li {
      margin-bottom: 10px;
    }
    
    .footer-menu_item {
      padding: 8px 0;
      display: block;
      color: #666;
      text-decoration: none;
    }
    
    .footer-menu_item:hover {
      color: #333;
    }
  }
`}</style>
    </>
  );
}