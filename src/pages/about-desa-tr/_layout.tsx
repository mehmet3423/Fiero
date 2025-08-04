import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect } from "react";


interface AboutDesaTrLayoutProps {
  children: ReactNode;
}

function AboutDesaTrLayout({ children }: AboutDesaTrLayoutProps) {
  // Slider images array
  const sliderImages = [
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/f027f06a-d7f2-40f3-aff1-ff4d404c7baa.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/35e725f4-a03f-4e7f-8b03-4c9a464510dc.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/f9b42bed-319e-48c3-8fdd-2ae8edf6daee.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/7a02b235-f7b8-4b8e-b49b-17487ca67d02.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/b4c4ccf5-f4a3-4c6e-be1f-b8d0e7c728f5.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/823fda7d-59b5-4fc8-b126-cb289ce94eec.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/249d624d-89e7-4215-9f5a-a3ad5169f4f1.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/e2954d57-53f3-4513-b12a-92875bc7d87b.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2023/03/31/cdcfeed4-fc93-4aaf-81b5-f9aa5c073011.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2025/04/14/1b9b3a10-7aa2-41a4-b9ec-e164cd23df12.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2025/04/14/407a8a18-9d69-4c53-bfe8-c4db07f78dea.jpg",
    "https://akn-desa.a-cdn.akinoncloud.com/cms/2025/04/14/478298a1-904c-483e-859d-bda6471c7a24.jpg"

  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fade animasyonlu geçiş
  const goToSlide = (idx: number) => {
    if (isAnimating || idx === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsAnimating(false);
    }, 350); // animasyon süresiyle uyumlu
  };
  const goToPrev = () => {
    goToSlide(currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1);
  };
  const goToNext = () => {
    goToSlide(currentSlide === sliderImages.length - 1 ? 0 : currentSlide + 1);
  };

  // Otomatik geçiş efekti (5 saniye)
  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);
  const router = useRouter();

  const navItemStyle = {
    userSelect: "none" as const,
    cursor: "pointer",
  };

  const aboutDesaNavStyles = {
    gap: '10px',
  };

  const aboutDesaNavItemStyles = {
    padding: '10px 20px',
    fontSize: '18px',
    lineHeight: '1.4',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontWeight: '500',
  };

  const navLinks = [
    { href: "/about-desa-tr/about", label: "DESA HAKKINDA" },
    { href: "/about-desa-tr/corporate-governance", label: "KURUMSAL YÖNETİM" },
    { href: "/about-desa-tr/general-assembly", label: "GENEL KURUL BİLGİLERİ" },
    { href: "/about-desa-tr/articles-of-association", label: "ANA SÖZLEŞME" },
    { href: "/about-desa-tr/commercial-info", label: "TİCARİ BİLGİLER" },
    { href: "/about-desa-tr/financials", label: "FİNANSAL VERİLER" },
    { href: "/about-desa-tr/annual-reports", label: "FAALİYET RAPORLARI" },
    { href: "/about-desa-tr/investor-presentations", label: "YATIRIMCI SUNUMLARI" },
    { href: "https://www.kap.org.tr/tr/sirket-bilgileri/ozet/1389-desa-deri-sanayi-ve-ticaret-a-s", label: "DUYURULAR", external: true },
    { href: "/about-desa-tr/other-reports", label: "DİĞER RAPORLAR" },
    { href: "/about-desa-tr/brokerage-reports", label: "ARACI KURUM RAPORLARI" },
    { href: "/about-desa-tr/press-releases", label: "BASIN BÜLTENLERİ" },
    { href: "/about-desa-tr/investor-relations-contact", label: "YATIRIMCI İLİŞKİLERİ İLETİŞİM" },
    { href: "/about-desa/investors", label: "ENG - INVESTOR RELATIONS" },
  ];

  return (
    <main className="main">
      <style jsx>{`
        .about-desa-nav-item {
          transition: all 0.3s ease !important;
        }
        .about-desa-nav-item:hover {
          transform: translateX(2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .custom-slider {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto 4px auto;
          height: 378px;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.13);
          background: #f7f7f7;
        }
        .custom-slider-img {
          width: 100%;
          height: 378px;
          object-fit: cover;
          display: block;
          opacity: 1;
          transition: opacity 0.35s cubic-bezier(.4,0,.2,1);
          position: absolute;
          top: 0; left: 0;
        }
        .custom-slider-img.hidden {
          opacity: 0;
          pointer-events: none;
        }
        .custom-slider-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg,rgba(0,0,0,0.13) 0%,rgba(0,0,0,0.07) 100%);
          z-index: 1;
        }
        .custom-slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          color: #222;
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          cursor: pointer;
          font-size: 26px;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(0,0,0,0.13);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .custom-slider-arrow:hover {
          background: #222;
          color: #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }
        .custom-slider-arrow.left { left: 16px; }
        .custom-slider-arrow.right { right: 16px; }
        .custom-slider-dots {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 4;
        }
        .custom-slider-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #bbb;
          opacity: 0.7;
          cursor: pointer;
          transition: border 0.2s, background 0.2s, opacity 0.2s;
        }
        .custom-slider-dot.active {
          border: 2px solid #222;
          background: #222;
          opacity: 1;
        }
        @media (max-width: 900px) {
          .custom-slider {
            max-width: 100vw;
            height: 220px;
            margin-bottom: 2px;
          }
          .custom-slider-img {
            height: 220px;
          }
        }
        @media (max-width: 600px) {
          .custom-slider {
            max-width: 100vw;
            height: 140px;
            border-radius: 8px;
            margin-bottom: 2px;
          }
          .custom-slider-img {
            height: 140px;
          }
          .custom-slider-arrow {
            width: 32px;
            height: 32px;
            font-size: 18px;
          }
          .custom-slider-dots {
            bottom: 8px;
            gap: 6px;
          }
          .custom-slider-dot {
            width: 9px;
            height: 9px;
          }
          .ql-video {
            margin-top: 0 !important;
            margin-bottom: 4px !important;
            height: 180px !important;
            max-height: 40vw !important;
            width: 100% !important;
            max-width: 100% !important;
            left: unset;
            transform: unset;
            position: unset;
            display: block;
          }
        }
        @media (max-width: 400px) {
          .custom-slider {
            height: 90px;
            margin-bottom: 1px;
          }
          .custom-slider-img {
            height: 90px;
          }
          .ql-video {
            margin-bottom: 2px !important;
            height: 100px !important;
            max-height: 35vw !important;
            width: 100% !important;
            max-width: 100% !important;
            left: unset;
            transform: unset;
            position: unset;
            display: block;
          }
        }
      `}</style>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Yatırımcı İlişkileri</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <ul className="my-account-nav" style={aboutDesaNavStyles}>
                {navLinks.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        className="my-account-nav-item about-desa-nav-item"
                        style={aboutDesaNavItemStyles}
                        title={item.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`my-account-nav-item about-desa-nav-item ${router.pathname === item.href ? "active" : ""
                          }`}
                        style={aboutDesaNavItemStyles}
                        title={item.label}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-9">
              <div
                style={{
                  background: '#fff',
                  padding: 30,
                  borderRadius: 8,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  width: '100%',
                  maxWidth: 'none',
                  marginBottom: 32,
                }}
              >
                {/* Custom React slider */}
                <div className="custom-slider">
                  {sliderImages.map((img, idx) => (
                    <img
                      key={img}
                      src={img}
                      alt={`Slider görseli ${idx + 1}`}
                      className={`custom-slider-img${idx === currentSlide ? '' : ' hidden'}`}
                      draggable={false}
                      style={{ pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
                    />
                  ))}
                  <div className="custom-slider-overlay" />
                  <button
                    className="custom-slider-arrow left"
                    onClick={goToPrev}
                    aria-label="Önceki"
                    disabled={isAnimating}
                  >
                    &#8592;
                  </button>
                  <button
                    className="custom-slider-arrow right"
                    onClick={goToNext}
                    aria-label="Sonraki"
                    disabled={isAnimating}
                  >
                    &#8594;
                  </button>
                  <div className="custom-slider-dots">
                    {sliderImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`custom-slider-dot${idx === currentSlide ? ' active' : ''}`}
                        onClick={() => goToSlide(idx)}
                        style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}
                        aria-label={`Slide ${idx + 1}`}
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goToSlide(idx); }}
                      />
                    ))}
                  </div>
                </div>
                {/* Video iframe */}
                <div style={{ lineHeight: 1.6, color: '#333', marginBottom: 2 }}>
                  <iframe width="100%" height="545px" className="ql-video" style={{marginTop:0, marginBottom:2}} frameBorder="0" allowFullScreen src="https://player.vimeo.com/video/876270670?badge=0&autopause=0&quality_selector=1&progress_bar=1&player_id=0&app_id=58479"></iframe>
                </div>
                {/* Page content */}
                <div style={{ lineHeight: 1.6, color: '#333' }}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


export function withAboutDesaTrLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAboutDesaTrLayout(props: P) {
    return (
      <AboutDesaTrLayout>
        <WrappedComponent {...props} />
      </AboutDesaTrLayout>
    );
  };
}

// Named export for Next.js/TypeScript compatibility
export default AboutDesaTrLayout;
