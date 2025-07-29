  import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
  import Image from "next/image";
  import Link from "next/link";
  import { Swiper, SwiperSlide } from "swiper/react";
  import { Navigation, Autoplay } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/navigation";

  interface HeroSliderProps {
    slides: {
      image: string;
      title?: string;
      subtitle?: string;
      buttonText?: string;
      buttonLink?: string;
    }[];
    className?: string;
  }

  const HeroSlider: React.FC<HeroSliderProps> = ({ slides, className = "" }) => {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
      const timer = setTimeout(() => {
        if (prevRef.current && nextRef.current) {
          setReady(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }, []);


    return (
      <div className={`hero-slider ${className}`} style={{ position: "relative", marginBottom: "1.1rem", marginTop: "1.1rem", width: "100%", overflowX: "hidden" }}>
        {ready && slides.length > 0 && (
          <Swiper
            key={slides.length} // içerik değişiminde yeniden render
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            loop={true}
            autoplay={{
              delay: 113000,
              disableOnInteraction: false,
            }}
            className="hero-slider-carousel"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="tf-hero-slide-modern">
                  {/* <div className="tf-hero-content">
                    {slide.title && <h1 className="tf-hero-title">{slide.title}</h1>}
                    {slide.subtitle && <p className="tf-hero-subtitle">{slide.subtitle}</p>}
                    {slide.buttonText && slide.buttonLink && (
                      <Link href={slide.buttonLink} className="tf-hero-btn">
                        <span>{slide.buttonText}</span>
                        <i className="icon icon-arrow-right" style={{marginLeft:8,fontSize:'1.3em'}}></i>
                      </Link>
                    )}
                  </div> */}
                  <div className="tf-hero-image">
                    <div className="tf-hero-img-bg">
                      <Image
                        src={slide.image}
                        alt={slide.title || "Hero Image"}
                        title={slide.title || "Hero Image"}
                        fill
                        className="tf-hero-img"
                        priority
                        style={{objectFit:'cover'}}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}


        <button
          ref={prevRef}
          className="custom-prev"
          style={{
            position: "absolute",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#333",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            opacity: 0.8,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.opacity = "0.8";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          {/* Sol ok ikonu */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          ref={nextRef}
          className="custom-next"
          style={{
            position: "absolute",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#333",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            opacity: 0.8,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.opacity = "0.8";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          {/* Sağ ok ikonu */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L16 12L9 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <style jsx>{`
          .tf-hero-slide-modern {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            max-width: 1280px;
            margin: 0 auto 0.5rem auto;
            height: 400px;
            background: #fafafa;
            padding: 0 2vw;
            position: relative;
          }
          .tf-hero-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            z-index: 2;
          }
          .tf-hero-title {
            font-size: 3rem;
            font-weight: 500;
            margin-bottom: 1.1rem;
            color: #111;
            letter-spacing: -1px;
          }
          .tf-hero-subtitle {
            font-size: 1.5rem;
            color: #222;
            margin-bottom: 2.5rem;
          }
          .tf-hero-btn {
            display: inline-flex;
            align-items: center;
            background: #111;
            color: #fff;
            font-size: 1.25rem;
            font-weight: 600;
            border-radius: 2.5rem;
            padding: 0.75rem 2.5rem;
            text-decoration: none;
            transition: background 0.2s, color 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .tf-hero-btn:hover {
            background: #222;
            color: #fff;
          }
          .tf-hero-image {
            flex: 1.5;
            position: relative;
            min-width: 0;
            height: 100%;
            max-width: 700px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .tf-hero-img-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: #f7f7f7;
          }
          .tf-hero-img {
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 0;
            box-shadow: none;
            display: block;
          }
          @media (max-width: 1200px) {
            .tf-hero-slide-modern {
              height: 300px;
              padding: 0 1vw;
            }
            .tf-hero-image {
              max-width: 500px;
              height: 300px;
            }
            .tf-hero-title {
              font-size: 2.2rem;
            }
          }
          @media (max-width: 900px) {
            .tf-hero-slide-modern {
              flex-direction: column-reverse;
              align-items: center;
              justify-content: center;
              padding: 0 1vw;
              max-width: 100vw;
              height: 220px;
            }
            .tf-hero-content {
              min-width: 0;
              align-items: center;
              text-align: center;
            }
            .tf-hero-title {
              font-size: 1.3rem;
            }
            .tf-hero-image {
              justify-content: center;
              max-width: 100vw;
              height: 120px;
            }
          }
          @media (max-width: 600px) {
            .tf-hero-slide-modern {
              height: 120px;
            }
            .tf-hero-image {
              height: 80px;
            }
          }
        `}</style>
      </div>
    );
  };

  export default HeroSlider;
