import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect } from "react";


interface AboutDesaTrLayoutProps {
  children: ReactNode;
}

function AboutDesaTrLayout({ children }: AboutDesaTrLayoutProps) {
  // Slider images array
  const sliderImages = [
   "/assets/site/images/blog/blog-1.jpg",
    "/assets/site/images/blog/blog-2.jpg",
    "/assets/site/images/blog/blog-3.jpg",
    "/assets/site/images/blog/blog-4.jpg",
    "/assets/site/images/blog/blog-5.jpg",
    "/assets/site/images/blog/blog-6.jpg",
    "/assets/site/images/blog/blog-7.jpg",
    "/assets/site/images/blog/blog-8.jpg",
    "/assets/site/images/blog/blog-9.jpg",
    "/assets/site/images/blog/blog-10.jpg"

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
    { href: "/about-desa-tr/about", label: "" },
    { href: "/about-desa-tr/corporate-governance", label: "" },
    { href: "/about-desa-tr/general-assembly", label: "" },
    { href: "/about-desa-tr/articles-of-association", label: "" },
    { href: "/about-desa-tr/commercial-info", label: "" },
    { href: "/about-desa-tr/financials", label: "" },
    { href: "/about-desa-tr/annual-reports", label: "" },
    { href: "/about-desa-tr/investor-presentations", label: "" },
    { href: "https://www.kap.org.tr/tr/sirket-bilgileri/ozet/1389-desa-deri-sanayi-ve-ticaret-a-s", label: "", external: true },
    { href: "/about-desa-tr/other-reports", label: "" },
    { href: "/about-desa-tr/brokerage-reports", label: "" },
    { href: "/about-desa-tr/press-releases", label: "" },
    { href: "/about-desa-tr/investor-relations-contact", label: "" },
    { href: "/about-desa/investors", label: "" },
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
          border-radius: 0;
          box-shadow: none;
          background: none;
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
                        className={`my-account-nav-item about-desa-nav-item ${router.pathname === item.href ? "active" : ""}`}
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
                  padding: 30,
                  width: '100%',
                  maxWidth: 'none',
                  marginBottom: 32,
                  background: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  borderRadius: 0,
                }}
              >
                {/* Custom React slider */}
                <div className="custom-slider" style={{ marginBottom: 50 }}>
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
