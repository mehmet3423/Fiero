"use client";

import { PathEnums } from "@/constants/enums/PathEnums";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer id="footer" className="footer md-pb-70">
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              {/* Logo ve İletişim Bilgileri */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link href="/">
                      <Image
                        src="/assets/site/images/logo/desa-logo.svg"
                        alt="Desa Logo"
                        title="Desa - Ana Sayfaya Dön"
                        width="120"
                        height="40"
                      />
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>Adres: İstanbul, Türkiye</p>
                    </li>
                    <li>
                      <p>
                        Email:{" "}
                        <a href="mailto:siparis@desa.com.tr">
                          siparis@desa.com.tr
                        </a>
                      </p>
                    </li>
                    <li>
                      <p>
                        Telefon:{" "}
                        <a href="tel:02124731800">
                          0212 473 18 00
                        </a>
                      </p>
                    </li>
                  </ul>
                  <Link href="/contact-us" className="tf-btn btn-line">
                    Yol Tarifi Al
                    <i className="icon icon-arrow1-top-left"></i>
                  </Link>
                  <ul className="tf-social-icon d-flex gap-10">
                    <li>
                      <a
                        href="https://www.facebook.com/desafashion?fref=ts"
                        className="box-icon w_34 round social-facebook social-line"
                        target="_blank"
                      >
                        <i className="icon fs-14 icon-fb"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/desafashion/"
                        className="box-icon w_34 round social-instagram social-line"
                        target="_blank"
                      >
                        <i className="icon fs-14 icon-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/channel/UCgapbfRp7RWO60AREk6OFtg/"
                        className="box-icon w_34 round social-youtube social-line"
                        target="_blank"
                      >
                        <i
                          className="icon fs-10 icon-play"
                          style={{
                            border: '1px solid #000',
                            padding: '2px 4px',
                            borderRadius: '2px',
                            backgroundColor: '#000',
                            color: '#fff',
                            fontSize: '8px'
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
                  <h6>Yardım</h6>
                </div>
                <div 
                  className="footer-heading footer-heading-mobile"
                  onClick={() => toggleSection('help')}
                  style={{ cursor: 'pointer' }}
                >
                  <h6>
                    Yardım
                    <span style={{ float: 'right' }}>
                      {openSection === 'help' ? '−' : '+'}
                    </span>
                  </h6>
                </div>
                <ul className={`footer-menu-list tf-collapse-content ${openSection === 'help' ? 'is-show' : ''}`}>
                  <li>
                    <Link href="/policies" className="footer-menu_item">
                      Politikalarımız
                    </Link>
                  </li>
                  <li>
                    <Link href="/distance-sales-agreement" className="footer-menu_item">
                      İade + Değişim
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="footer-menu_item">
                      Şartlar & Koşullar
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="footer-menu_item">
                      S.S.S.
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="footer-menu_item">
                      Karşılaştır
                    </Link>
                  </li>
                  <li>
                    <Link href="/favorites" className="footer-menu_item">
                      Favorilerim
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Hakkımızda Bölümü */}
              <div className="col-xl-3 col-md-6 col-12 footer-col-block ">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Hakkımızda</h6>
                </div>
                <div 
                  className="footer-heading footer-heading-mobile"
                  onClick={() => toggleSection('about')}
                  style={{ cursor: 'pointer' }}
                >
                  <h6>
                    Hakkımızda
                    <span style={{ float: 'right' }}>
                      {openSection === 'about' ? '−' : '+'}
                    </span>
                  </h6>
                </div>
                <ul className={`footer-menu-list tf-collapse-content ${openSection === 'about' ? 'is-show' : ''}`}>
                  <li>
                    <Link href="/about-us" className="footer-menu_item">
                      Hikayemiz
                    </Link>
                  </li>
                  <li>
                    <Link href="/store-locations" className="footer-menu_item">
                      Mağazalarımız
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="footer-menu_item">
                      İletişim
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="footer-menu_item">
                      Hesabım
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-desa-tr" className="footer-menu_item">
                      Yatırımcı İlişkileri
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-desa/about" className="footer-menu_item">
                      About DESA
                    </Link>
                  </li>
                  <li>
                    <Link href="/support-ticket" className="footer-menu_item">
                      Destek Talebi
                    </Link>
                  </li>
                </ul>
              </div>

              {/* E-posta Kaydı Bölümü */}
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>E-posta Kaydı</h6>
                  </div>
                  <div 
                    className="footer-heading footer-heading-mobile"
                    onClick={() => toggleSection('newsletter')}
                    style={{ cursor: 'pointer' }}
                  >
                    <h6>
                      E-posta Kaydı
                      <span style={{ float: 'right' }}>
                        {openSection === 'newsletter' ? '−' : '+'}
                      </span>
                    </h6>
                  </div>
                  <div className={`tf-collapse-content ${openSection === 'newsletter' ? 'is-show' : ''}`}>
                    <div className="footer-menu_item">
                      Yeni ürünler, indirimler, özel içerikler, etkinlikler ve
                      daha fazlası için kayıt olun!
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
                            placeholder="E-posta adresinizi girin...."
                            tabIndex={0}
                            aria-required="true"
                          />
                        </fieldset>
                        <div className="button-submit">
                          <button
                            className="subscribe-button tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                            type="button"
                          >
                            Abone Ol
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
                  <div className="footer-menu_item">
                    © DESA 2025
                  </div>
                  <div className="tf-payment col-12 col-md-6 d-flex justify-content-center justify-content-md-end">
                    <div className="d-flex justify-content-center justify-content-md-end gap-1 align-items-center flex-wrap">
                      <img
                        src="/assets/site/images/payments/visa.webp"
                        alt="Payment methods"
                        title="Kabul Edilen Ödeme Yöntemleri"
                        width='40px'
                        height="auto"
                      />
                      <img
                        src="/assets/site/images/payments/mastercard.webp"
                        alt="Payment methods"
                        title="Kabul Edilen Ödeme Yöntemleri"
                        width='40px'
                        height="auto"
                      />
                      <img
                        src="/assets/site/images/payments/applepay.webp"
                        alt="Payment methods"
                        title="Kabul Edilen Ödeme Yöntemleri"
                        width='40px'
                        height="auto"
                      />
                      <img
                        src="/assets/site/images/payments/americanexpress.webp"
                        alt="Payment methods"
                        title="Kabul Edilen Ödeme Yöntemleri"
                        width='40px'
                        height="auto"
                      />
                      <img
                        src="/assets/site/images/payments/cb.webp"
                        alt="Payment methods"
                        title="Kabul Edilen Ödeme Yöntemleri"
                        width='40px'
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
    </footer>
  );
}