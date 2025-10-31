import SEOHead from "@/components/SEO/SEOHead";
import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { GetStaticProps } from "next";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  const { contents: aboutUsContents, isLoading } = useGeneralContents(
    GeneralContentType.AboutUsContent
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
                {"Hakkımızda - Fiero"}
              </span>
              {/* <p className="sub-title text_black-2">
                {"Bu alan, bir şirketin vizyonunu ve misyonunu özetleyen rastgele bir metindir. Hayal gücünüzü kullanın!"}
              </p> */}
            </div>
          </div>
        </section>
        <div className="container">
          <div className="line"></div>
        </div>
        {/* Dynamic content using General Content images (alternating left/right). */}
        <section className="flat-spacing-23 flat-image-text-section">
          <div className="container">
            {isLoading && <p>Yükleniyor...</p>}
            {!isLoading && (
              <>
                {(aboutUsContents?.items || [])
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((item, index) => {
                    const hasImage = !!item.imageUrl;
                    const isEven = index % 2 === 0;
                    if (!hasImage) {
                      return (
                        <div key={item.id} style={{ maxWidth: "900px", margin: "0 auto 14px" }}>
                          <p style={{ color: "#333", lineHeight: 1.8, marginBottom: 0 }}>
                            {item.content || item.title}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={item.id} className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                        {isEven ? (
                          <>
                            <div className="tf-image-wrap">
                              <img
                                className="lazyload w-100"
                                src={item.imageUrl || ""}
                                data-src={item.imageUrl || ""}
                                alt={item.title || "about-image"}
                              />
                            </div>
                            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                              <div>
                                {item.title && <div className="heading">{item.title}</div>}
                                <div className="text">
                                  {item.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                              <div>
                                {item.title && <div className="heading">{item.title}</div>}
                                <div className="text">
                                  {item.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="grid-img-group">
                              <div className="tf-image-wrap box-img item-1">
                                <div className="img-style">
                                  <img
                                    className="lazyload"
                                    src={item.imageUrl || ""}
                                    data-src={item.imageUrl || ""}
                                    alt={item.title || "about-image"}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                {(aboutUsContents?.items || []).length === 0 && (
                  <p>Şu anda görüntülenecek içerik bulunamadı.</p>
                )}
              </>
            )}
          </div>
          <style jsx>{`
            /* Dinamik image-text blokları arası ekstra boşluk */
            .flat-image-text-section :global(.tf-grid-layout.tf-img-with-text.style-4) {
              margin-bottom: 56px !important;
              position: relative;
              z-index: 1;
              display: flex !important;
              flex-direction: row;
              align-items: center; /* resim ve metni birbirine ortala */
              justify-content: space-between;
              gap: 40px;
              width: 100%;
              clear: both;
            }
            .flat-image-text-section :global(.tf-grid-layout.tf-img-with-text.style-4:last-of-type) {
              margin-bottom: 0 !important;
            }
            /* Paragrafların bloklarla çakışmasını engelle */
            .flat-image-text-section :global(p) {
              clear: both;
            }
            /* Sağdaki küçük görsel grubunun üstten taşmasını engelle */
            .flat-image-text-section :global(.grid-img-group) { display: flex; gap: 16px; justify-content: flex-end; width: 50%; }
            .flat-image-text-section :global(.tf-image-wrap) { width: 50%; }
            .flat-image-text-section :global(.tf-content-wrap) { width: 50%; }
            /* Görsellerin taşmasını kesin olarak engelle */
            .flat-image-text-section :global(.tf-image-wrap img),
            .flat-image-text-section :global(.grid-img-group img) {
              max-width: 100%;
              height: auto;
              display: block;
              object-fit: cover;
            }
            /* Mobilde dikey hizalama */
            @media (max-width: 767px) {
              .flat-image-text-section :global(.tf-grid-layout.tf-img-with-text.style-4) {
                flex-direction: column;
                gap: 20px;
              }
              .flat-image-text-section :global(.tf-image-wrap),
              .flat-image-text-section :global(.tf-content-wrap),
              .flat-image-text-section :global(.grid-img-group) { width: 100%; }
            }
          `}</style>
        </section>
        {/* Iconbox Section */}
        {/* <section>
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
        </section> */}

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
