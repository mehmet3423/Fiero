import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGetAllGeneralContent";
import Link from "next/link";
import SEOHead from "@/components/SEO/SEOHead";
import { GetStaticProps } from "next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useRef, useState } from "react";

// SEO prop interface
interface AboutSEOData {
  id?: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonical?: string;
  ogImageUrl?: string;
}

interface AboutProps {
  seoData?: AboutSEOData;
}

function AboutUs({ seoData }: AboutProps) {
  const thumbsSwiperRef = useRef<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const handleMainSlideChange = (swiper: any) => {
    setActiveSlide(swiper.activeIndex);
    if (thumbsSwiperRef.current && thumbsSwiperRef.current.slideTo) {
      thumbsSwiperRef.current.slideTo(swiper.activeIndex, 800);
    }
  };
  
  const { contents: aboutName } = useGeneralContents(
    GeneralContentType.AboutName
  );
  const { contents: aboutDesign } = useGeneralContents(
    GeneralContentType.AboutDesign
  );

  return (
    <>
      <SEOHead canonical="/about-us" />
      <main>
        {/* Slider Section */}
        <section className="tf-slideshow about-us-page position-relative">
          <div className="banner-wrapper">
            <img
              className="lazyload"
              src="/assets/site/images/slider/about-banner-01.jpg"
              data-src="/assets/site/images/slider/about-banner-01.jpg"
              alt="image-collection"
            />
            <div className="box-content text-center">
              <div className="container">
                <div className="text text-white">
                 
                  <br className="d-xl-block d-none" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Title Section */}
        <section className="flat-spacing-9">
          <div className="container">
            <div className="flat-title my-0">
              <span className="title">
                {"Hakkımızda - Rastgele Şirket Başlığı"}
              </span>
              <p className="sub-title text_black-2">
                {"Bu alan, bir şirketin vizyonunu ve misyonunu özetleyen rastgele bir metindir. Hayal gücünüzü kullanın!"}
              </p>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="line"></div>
        </div>
        {/* Image-Text Section */}
        <section className="flat-spacing-23 flat-image-text-section">
          <div className="container">
            <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
              <div className="tf-image-wrap">
                <img
                  className="lazyload w-100"
                  data-src="/assets/site/images/collections/collection-69.jpg"
                  src="/assets/site/images/collections/collection-69.jpg"
                  alt="collection-img"
                />
              </div>
              <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                <div>
                  <div className="heading">
                    {"Şirketimizin hikayesi burada başlar. Rastgele bir başlık örneği."}
                  </div>
                  <div className="text">
                    {(
                      <>
                        {"2000 yılında kurulan şirketimiz, yenilikçi çözümler ve eğlenceli projelerle tanınır. Rastgele içerik örneği."}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flat-spacing-15">
          <div className="container">
            <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
              <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                <div>
                  <div className="heading">
                    {"Tasarımda mükemmellik - Rastgele başlık"}
                  </div>
                  <div className="text">
                    {(
                      <>
                        {"Şirketimiz, modern ve klasik tasarımları bir araya getirir. Rastgele metin örneği."}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid-img-group">
                <div className="tf-image-wrap box-img item-1">
                  <div className="img-style">
                    <img
                      className="lazyload"
                      src="/assets/site/images/collections/collection-71.jpg"
                      data-src="/assets/site/images/collections/collection-71.jpg"
                      alt="img-slider"
                    />
                  </div>
                </div>
                <div className="tf-image-wrap box-img item-2">
                  <div className="img-style">
                    <img
                      className="lazyload"
                      src="/assets/site/images/collections/collection-70.jpg"
                      data-src="/assets/site/images/collections/collection-70.jpg"
                      alt="img-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Iconbox Section */}
        <section>
          <div className="container">
            <div className="bg_grey-2 radius-10 flat-wrap-iconbox">
              <div className="flat-title lg">
                <span className="title fw-5"></span>
                <span className="title fw-5">Malzeme, Tasarım ve Boyutlarda Rastgele Başlık</span>
                <div>
                  <p className="sub-title text_black-2">
                    {"Ürünlerimizde kullanılan malzemeler hakkında rastgele bir açıklama. Hayal gücünüzü kullanın!"}
                  </p>
                  <p className="sub-title text_black-2">
                    {"Tasarımda yenilikçi yaklaşımlar ve fonksiyonellik. Rastgele metin."}
                  </p>
                </div>
              </div>
              <div className="flat-iconbox-v3 lg">
                <div className="wrap-carousel wrap-mobile">
                  <div
                    className="swiper tf-sw-mobile"
                    data-preview="1"
                    data-space="15"
                  >
                    <div className="swiper-wrapper wrap-iconbox lg">
                      <div className="swiper-slide">
                        <div className="tf-icon-box text-center">
                          <div className="icon">
                            <i className="icon-materials"></i>
                          </div>
                          <div className="content">
                            <div className="title"></div>
                            <div className="title">Malzeme Kalitesi</div>
                            <p className="text_black-2">
                              {"Ürünlerimizde kullanılan malzemeler, dayanıklılığı ve estetiğiyle öne çıkar. Rastgele metin."}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="tf-icon-box text-center">
                          <div className="icon">
                            <i className="icon-design"></i>
                          </div>
                          <div className="content">
                            <div className="title"></div>
                            <div className="title">Tasarım Detayları</div>
                            <p className="text_black-2">
                              {"Her ürünümüz, özgün tasarım anlayışıyla üretilir. Rastgele metin."}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="tf-icon-box text-center">
                          <div className="icon">
                            <i className="icon-sizes"></i>
                          </div>
                          <div className="content">
                            <div className="title"></div>
                            <div className="title">Boyut Seçenekleri</div>
                            <p className="text_black-2">
                              {"Farklı boyut seçenekleriyle her ihtiyaca uygun ürünler. Rastgele metin."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sw-dots style-2 sw-pagination-mb justify-content-center"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Testimonial Section */}
        <section className="flat-testimonial-v2 flat-spacing-24">
          <div className="container">
            <div className="wrapper-thumbs-testimonial-v2 flat-thumbs-testimonial">
              <div className="box-left">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={40}
                  slidesPerView={1}
                  speed={800}
                  navigation={{
                    nextEl: '.nav-next-tes-2',
                    prevEl: '.nav-prev-tes-2',
                  }}
                  pagination={{
                    el: '.sw-pagination-tes-2',
                    clickable: true,
                  }}
                  onSlideChange={handleMainSlideChange}
                  className="tf-sw-tes-2"
                >
                  <SwiperSlide>
                    <div className="testimonial-item lg lg-2">
                        <h4 className="mb_40"></h4>
                        <h4 className="mb_40">Müşteri Yorumları - Rastgele Başlık</h4>
                        <div className="icon">
                          <img
                            className="lazyload"
                            data-src="/assets/site/images/item/quote.svg"
                            alt=""
                            src="/assets/site/images/item/quote.svg"
                          />
                        </div>
                        <div className="rating">
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                        </div>
                        <p className="text">
                          {"Ürünlerinizden çok memnun kaldım. Rastgele müşteri yorumu."}
                        </p>
                        <div className="author box-author">
                          <div className="box-img d-md-none rounded-0">
                            <img
                              className="lazyload img-product"
                              data-src="/assets/site/images/item/tets3.jpg"
                              src="/assets/site/images/item/tets3.jpg"
                              alt="image-product"
                            />
                          </div>
                          <div className="content">
                            <div className="name"></div>
                            <div className="name">Rastgele İsim</div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-item lg lg-2">
                        <h4 className="mb_40"></h4>
                        <h4 className="mb_40">Müşteri Yorumları - Rastgele Başlık 2</h4>
                        <div className="icon">
                          <img
                            className="lazyload"
                            data-src="/assets/site/images/item/quote.svg"
                            alt=""
                            src="/assets/site/images/item/quote.svg"
                          />
                        </div>
                        <div className="rating">
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                          <i className="icon-start"></i>
                        </div>
                        <p className="text">
                          {"Kalite ve tasarım harika! Rastgele müşteri yorumu 2. Hayal gücünüzü kullanın!"}
                        </p>
                        <div className="author box-author">
                          <div className="box-img d-md-none rounded-0">
                            <img
                              className="lazyload img-product"
                              data-src="/assets/site/images/item/tets4.jpg"
                              src="/assets/site/images/item/tets4.jpg"
                              alt="image-product"
                            />
                          </div>
                          <div className="content">
                            <div className="name"></div>
                            <div className="name">Rastgele İsim 2</div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                </Swiper>
                <div className="d-md-flex d-none box-sw-navigation">
                  <div className="nav-sw nav-prev-slider nav-prev-tes-2">
                    <span className="icon icon-arrow-left"></span>
                  </div>
                  <div className="nav-sw nav-next-slider nav-next-tes-2">
                    <span className="icon icon-arrow-right"></span>
                  </div>
                </div>
                <div className="d-md-none sw-dots style-2 sw-pagination-tes-2"></div>
              </div>
              <div className="box-right">
                <Swiper
                  modules={[]}
                  spaceBetween={30}
                  slidesPerView={1}
                  speed={800}
                  allowTouchMove={false}
                  initialSlide={activeSlide}
                  onSwiper={(swiper) => {
                    thumbsSwiperRef.current = swiper;
                    console.log('Thumbnail swiper initialized:', swiper);
                  }}
                  className="tf-thumb-tes"
                >
                  <SwiperSlide>
                    <div className="img-sw-thumb">
                      <img
                        className="lazyload img-product"
                        data-src="/assets/site/images/item/tets3.jpg"
                        src="/assets/site/images/item/tets3.jpg"
                        alt="image-product"
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="img-sw-thumb">
                      <img
                        className="lazyload img-product"
                        data-src="/assets/site/images/item/tets4.jpg"
                        src="/assets/site/images/item/tets4.jpg"
                        alt="image-product"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="line"></div>
        </div>
        <section style={{ padding: "40px 0" }}>
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                {"Galeri - Rastgele Başlık"}
              </span>
              <p style={{ color: "#666", fontSize: "16px" }}>
                {"Rastgele ürünlerden seçilmiş galeri açıklaması."}
              </p>
            </div>

            <Swiper
              modules={[Pagination]}
              spaceBetween={7}
              slidesPerView={5}
              pagination={{ clickable: true }}
              breakpoints={{
                1024: { slidesPerView: 5 },
                768: { slidesPerView: 3 },
                480: { slidesPerView: 2 },
              }}
              style={{ paddingBottom: "20px" }}
            >
              {[
                "/assets/site/images/shop/gallery/gallery-7.jpg",
                "/assets/site/images/shop/gallery/gallery-3.jpg",
                "/assets/site/images/shop/gallery/gallery-5.jpg",
                "/assets/site/images/shop/gallery/gallery-8.jpg",
                "/assets/site/images/shop/gallery/gallery-6.jpg",
              ].map((src, index) => (
                <SwiperSlide key={index}>
                  <div
                    style={{
                      overflow: "hidden",
                      borderRadius: "8px",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img
                      src={src}
                      alt={`image-gallery-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
        ;
      </main>
    </>
  );
}

// getStaticProps - About us sayfası SEO verilerini çeker
export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/SEO/GetSEOBySlug?slug=/about-us`
    );
    if (response.ok) {
      const seoData = await response.json();
      return {
        props: {
          seoData: seoData || null,
        },
        revalidate: 300,
      };
    }
  } catch (error) {
    console.error("About us SEO verisi alınamadı:", error);
  }
  return {
    props: {
      seoData: null,
    },
    revalidate: 300,
  };
};

export default AboutUs;
