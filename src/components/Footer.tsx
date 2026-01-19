"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useState, useRef } from "react";
import { useAuth } from "@/hooks/context/useAuth";
import { useSubscribeToNotifications } from "@/hooks/services/useSubscribeToNotifications";
import { useGetSupportEmailAddress } from "@/hooks/services/settings";

export default function Footer() {
  const { t, language } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { userProfile } = useAuth();
  const { subscribe, isPending } = useSubscribeToNotifications();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [subscribeMessage, setSubscribeMessage] = useState<string>("");
  // Support email adresini dinamik olarak al
  const { supportEmail, isLoading: isLoadingEmail } =
    useGetSupportEmailAddress();
  // Fallback email adresi
  const defaultEmail = "merhaba@nors.com.tr";
  const emailAddress = supportEmail || defaultEmail;

  const isLoggedIn = !!userProfile;
  const accountLinkHref = isLoggedIn ? "/profile" : "/register";
  const accountLinkLabel = isLoggedIn
    ? t("footer.account")
    : t("footer.createAccount");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeMessage("");

    const email = emailInputRef.current?.value?.trim();

    if (!email) {
      setSubscribeMessage(
        t("footer.emailRequired") || "Please enter your email address."
      );
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeMessage(
        t("footer.emailInvalid") || "Please enter a valid email address."
      );
      return;
    }

    try {
      const localeType = language === "tr" ? 0 : 1;
      await subscribe(
        {
          userMail: email,
          localeType,
        },
        () => {
          // Başarılı olduğunda input'u temizle
          if (emailInputRef.current) {
            emailInputRef.current.value = "";
          }
          setSubscribeMessage("");
        }
      );
    } catch (error) {
      // Error handling hook içinde yapılıyor
    }
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
                      <Link href="/" title="Eser Leather - Ana Sayfaya Dön">
                        LOGO
                      </Link>
                    </div>
                    <ul>
                      <li>
                        <p>{t("footer.address")}</p>
                      </li>
                      <li>
                        <p>
                          {t("footer.email")}:{" "}
                          <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                        </p>
                      </li>
                      <li>
                        <p>
                          {t("footer.phone")}:{" "}
                          <a
                            href="tel:02124731800"
                            title="Eser Leather Müşteri Hizmetleri'ni ara: 444 44 44"
                          >
                            444 44 44
                          </a>
                        </p>
                      </li>
                    </ul>
                    <Link
                      href="/contact-us"
                      className="tf-btn btn-line"
                      title="İletişim sayfasına git"
                    >
                      {t("footer.getDirections")}
                      <i className="icon icon-arrow1-top-left"></i>
                    </Link>
                    <ul className="tf-social-icon d-flex gap-10">
                      <li>
                        <a
                          href="/"
                          className="box-icon w_34 round social-facebook social-line"
                          target="_blank"
                          title="Eser Leather'ı Facebook'ta takip edin"
                        >
                          <i className="icon fs-14 icon-fb"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/"
                          className="box-icon w_34 round social-instagram social-line"
                          target="_blank"
                          title="Eser Leather'ı Instagram'da takip edin"
                        >
                          <i className="icon fs-14 icon-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/"
                          className="box-icon w_34 round social-youtube social-line"
                          target="_blank"
                          title="Eser Leather'ı YouTube'da takip edin"
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
                    className={`footer-menu-list tf-collapse-content ${
                      openSection === "help" ? "is-show" : ""
                    }`}
                  >
                    <li>
                      <Link
                        href="/policies"
                        className="footer-menu_item"
                        title="Politikalar sayfasına git"
                      >
                        {t("footer.policies")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/distance-sales-agreement"
                        className="footer-menu_item"
                        title="Mesafeli Satış Sözleşmesi sayfasına git"
                      >
                        {t("footer.returns")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/delivery-terms"
                        className="footer-menu_item"
                        title="Teslimat Koşulları sayfasına git"
                      >
                        {t("footer.deliveryTerms")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/sales-agreement"
                        className="footer-menu_item"
                        title="Satış Sözleşmesi sayfasına git"
                      >
                        {t("footer.salesAgreement")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy-and-cookies"
                        className="footer-menu_item"
                        title="Gizlilik ve Çerez Politikası sayfasına git"
                      >
                        {t("footer.privacyAndCookies")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy-and-payment-security"
                        className="footer-menu_item"
                        title="Gizlilik ve Ödeme Güvenliği sayfasına git"
                      >
                        {t("footer.privacyAndPayment")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms"
                        className="footer-menu_item"
                        title="Kullanım Koşulları sayfasına git"
                      >
                        {t("footer.terms")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq"
                        className="footer-menu_item"
                        title="Sıkça Sorulan Sorular sayfasına git"
                      >
                        {t("footer.faq")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/compare-products"
                        className="footer-menu_item"
                        title="Ürün Karşılaştırma sayfasına git"
                      >
                        {t("footer.compare")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/favorites"
                        className="footer-menu_item"
                        title="Favorilerim sayfasına git"
                      >
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
                    className={`footer-menu-list tf-collapse-content ${
                      openSection === "about" ? "is-show" : ""
                    }`}
                  >
                    <li>
                      <Link
                        href="/our-story"
                        className="footer-menu_item"
                        title="Hikayemiz sayfasına git"
                      >
                        {t("footer.ourStory")}
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        href="/store-locations"
                        className="footer-menu_item"
                        title="Mağaza Lokasyonları sayfasına git"
                      >
                        {t("footer.stores")}
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        href="/contact-us"
                        className="footer-menu_item"
                        title="İletişim sayfasına git"
                      >
                        {t("footer.contact")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog"
                        className="footer-menu_item"
                        title="Blog sayfasına git"
                      >
                        {t("footer.blog")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={accountLinkHref}
                        className="footer-menu_item"
                        title={
                          isLoggedIn
                            ? "Profil sayfasına git"
                            : "Yeni hesap oluştur"
                        }
                      >
                        {accountLinkLabel}
                      </Link>
                    </li>
                    {/* <li>
                      <Link href="/about-desa-tr" className="footer-menu_item">
                        {t("footer.investorRelations")}
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        href="/about-us"
                        className="footer-menu_item"
                        title="Hakkımızda sayfasına git"
                      >
                        {t("footer.aboutUs")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/support-ticket"
                        className="footer-menu_item"
                        title="Genel Destek Talebi sayfasına git"
                      >
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
                      className={`tf-collapse-content ${
                        openSection === "newsletter" ? "is-show" : ""
                      }`}
                    >
                      <div className="footer-menu_item">
                        {t("footer.newsletterDescription")}
                      </div>
                      <form
                        className="form-newsletter subscribe-form"
                        id="subscribe-form"
                        onSubmit={handleSubscribe}
                        acceptCharset="utf-8"
                      >
                        <div className="subscribe-content">
                          <fieldset className="email">
                            <input
                              ref={emailInputRef}
                              type="email"
                              name="email-form"
                              className="subscribe-email"
                              placeholder={t("footer.email")}
                              tabIndex={0}
                              aria-required="true"
                              disabled={isPending}
                            />
                          </fieldset>
                          <div className="button-submit">
                            <button
                              className="subscribe-button tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                              type="submit"
                              disabled={isPending}
                            >
                              {isPending
                                ? t("footer.subscribing") || "Abone olunuyor..."
                                : t("footer.subscribe")}
                              <i className="icon icon-arrow1-top-left"></i>
                            </button>
                          </div>
                        </div>
                        <div className="subscribe-msg">
                          {subscribeMessage && (
                            <div
                              style={{
                                color: "#dc3545",
                                fontSize: "0.875rem",
                                marginTop: "0.5rem",
                              }}
                            >
                              {subscribeMessage}
                            </div>
                          )}
                        </div>
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
                    <div className="footer-menu_item">
                      {t("footer.copyright")}
                    </div>
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
