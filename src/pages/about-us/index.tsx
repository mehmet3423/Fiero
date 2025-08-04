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
                  Empowering women to achieve{" "}
                  <br className="d-xl-block d-none" /> fitness goals with style
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
                {"Desa Hakkında"}
              </span>
              <p className="sub-title text_black-2">
                {(
                  <>
                    1972 yılında bir aile şirketi olarak kurulan Desa, 50 yıl boyunca büyük başarılara imza atarak Türkiye’nin lider deri ve deri mamulleri üreticisi olarak faaliyetlerine devam etmektedir. 2010, 2011, 2012 ve 2014 yıllarında Türkiye’de kendi alanında ihracat şampiyonu olmanın haklı gururunu yaşayan ve dikey entegrasyonunu tamamlamış benzersiz iş modeline sahip olan Desa, yüksek kalitedeki ürünleriyle mevcut profilini güçlendirerek uluslararası prestijli bir marka olarak yoluna devam etmektedir.
                  </>
                )}
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
                    { }
                  </div>
                  <div className="text">
                    {(
                      <>

                        Desa’nın operasyonları arasında deri tabakhanesinin yanında iki fabrikasındaki kadın ve erkek giyim ürünleri, çanta ve aksesuar üretiminin yanı sıra bu ürünlerin hem toptan hem de perakende satış kanalları yoluyla dağıtımı yer almaktadır. Yüksek kalitedeki ürünleriyle mevcut profilini güçlendirerek ulusal ve uluslararası piyasalarda prestijli bir marka olarak yoluna devam eden DESA Türkiye genelinde, 53 DESA, 36 Samsonite, 2 DESA franchise, 14 Samsonite JV, 2 Tumi JV, 1 1972 DESA ve 1 sanal mağaza olmak üzere toplam 109 mağazaya ve 14.663,7 metrekare mağaza alanına ulaştı.
                        <br></br>
                        <br></br>
                        İstanbul ve Düzce’de toplam 25.500 metrekare alana yayılan üretim tesislerine sahip olan Desa’nın Çorlu’daki tabakhanesi 20.000 metrekare alana sahiptir. Şirket, Prada, Miu Miu, Furla, Chanel, Emporio Armani ve Armani Collezioni gibi pek çok uluslararası lüks markaya entegre çözüm sağlayıcı olarak hizmet vermektedir. Desa, dünyanın en büyük seyahat ürünleri markası olan Samsonite’ın Türkiye’de 24 yıl boyunca distribütörlüğünün ardından, 2007 yılında Samsonite ile %40 - %60 ortaklık yapısıyla kurduğu ortak girişim sayesinde uluslararası profilini daha da güçlendirilmiştir.
                        <br></br>
                        <br></br>
                        Deri modasına yön veren ve Türkiye'nin deri mamulleri alanında öncü markası DESA, dünya markaları ile olan ilişkisini geliştirmek, deri çanta ve saraciye ürünleri üretimini ve satış hacmini artırmak amacıyla 2022 yılının ikinci yarısında İtalya’da Ar-Ge merkezi ve üretim tesisi yatırımı gerçekleştirdi. DESA’nın üretim operasyonlarının yürütüleceği yeni fabrikası, Casentino Vadisi'nin Arezzo ilindeki Poppi’de 5 dönüm arazi içerisinde 1.896 m² kapalı alana kuruldu. 2023 yılı Mart ayında satın alma sözleşmesinin ve imza sürecinin tamamlandığı DESA Internazionale fabrikası önümüzdeki günlerde faaliyete geçecek.


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
                    {}
                  </div>
                  <div className="text">
                    {(
                      <>
                        Desa, ürünlerine üstün kalite ve dayanıklılık sağlayan yüksek standarda sahip malzeme ve işçiliğe büyük önem vermektedir. Şirket, www.desa.com.tr üzerinden açtığı internet satış mağazası ile ürünlerini online olarak da satışa sunmaktadır. Servis kalitesinde benimsediği mükemmeliyetçilik anlayışı ile DESA, tasarım, araştırma ve geliştirme ile insan kaynağına aralıksız yatırım yapmaktadır. Şirketin uzun vadede stratejik hedefi, DESA markalı ürün satışlarını hem yurt içinde hem de yurt dışında artırmaktır.
                        <br></br><br></br>
                        DESA ürünleri 31 Ocak 2023 itibarıyla Avrupa'nın önde gelen moda e-ihracat/e-ticaret platformu Zalando'da satılıyor. İlk olarak Zalando Almanya’da, daha sonra Fransa, Hollanda, Belçika ve Avusturya’da satışa sunulan DESA ürünleri, ayakkabıdan konfeksiyona, çantadan küçük deri mamullerine kadar birçok farklı kategoride Avrupa'da geniş bir tüketici kitlesiyle buluşuyor.
                        <br></br><br></br>
                        Desa, Borsa İstanbul'da DESA kodu ile 2004 Mayıs ayından itibaren işlem görmekte olan halka açık bir şirkettir. 31.12.2022 itibariyle toplam varlıkları 1,283 Milyar TL'ye ulaşan Desa'nın toplam gelirleri ise 1,358 Milyar TL olarak gerçekleşmiştir.
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
                <span className="title fw-5">Quality is our priority</span>
                <div>
                  <p className="sub-title text_black-2">
                    Our talented stylists have put together outfits that are
                    perfect for the season.
                  </p>
                  <p className="sub-title text_black-2">
                    They've variety of ways to inspire your next fashion-forward
                    look.
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
                            <div className="title">High-Quality Materials</div>
                            <p className="text_black-2">
                              Crafted with precision and excellence, our
                              activewear is meticulously engineered using
                              premium materials to ensure unmatched comfort and
                              durability.
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
                            <div className="title">Laconic Design</div>
                            <p className="text_black-2">
                              Simplicity refined. Our activewear embodies the
                              essence of minimalistic design, delivering
                              effortless style that speaks volumes.
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
                            <div className="title">Various Sizes</div>
                            <p className="text_black-2">
                              Designed for every body and anyone, our activewear
                              embraces diversity with a wide range of sizes and
                              shapes, celebrating the beauty of individuality.
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
                        <h4 className="mb_40">Our customer’s reviews</h4>
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
                          "I have been shopping with this web fashion site for
                          over a year now and I can confidently say it is the
                          best online fashion site out there.The shipping is
                          always fast and the customer service team is friendly
                          and helpful. I highly recommend this site to anyone
                          looking for affordable clothing."
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
                            <div className="name">Robert smith</div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-item lg lg-2">
                        <h4 className="mb_40">Our customer’s reviews</h4>
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
                          "I have been shopping with this web fashion site for
                          over a year now and I can confidently say it is the
                          best online fashion site out there.The shipping is
                          always fast and the customer service team is friendly
                          and helpful. I highly recommend this site to anyone
                          looking for affordable clothing."
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
                            <div className="name">Jenifer Unix</div>
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
                Shop Gram
              </span>
              <p style={{ color: "#666", fontSize: "16px" }}>
                Inspire and let yourself be inspired, from one unique fashion to
                another.
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
        );
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
