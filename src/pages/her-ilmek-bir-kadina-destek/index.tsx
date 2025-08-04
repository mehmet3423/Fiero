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
                <section className="video-section py-2">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-10 col-lg-12">
                                <div className="video-wrapper position-relative rounded shadow-lg overflow-hidden">
                                    {/* Video Container */}
                                    <div
                                        className="video-container position-relative bg-black"
                                        style={{
                                            paddingBottom: "56.25%",
                                            height: 0,
                                            overflow: "hidden"
                                        }}
                                    >
                                        <video
                                            id="kadina-destek-video"
                                            className="position-absolute top-0 start-0 w-100 h-100"
                                            controls
                                            preload="metadata"
                                            playsInline
                                            muted
                                            autoPlay
                                            loop
                                            style={{
                                                objectFit: "contain"
                                            }}
                                            onLoadStart={() => {
                                                // Video ekrana geldiğinde otomatik başlat
                                                const video = document.getElementById('kadina-destek-video') as HTMLVideoElement;
                                                if (video) {
                                                    const observer = new IntersectionObserver((entries) => {
                                                        entries.forEach(entry => {
                                                            if (entry.isIntersecting) {
                                                                video.play().catch(console.log);
                                                            } else {
                                                                video.pause();
                                                            }
                                                        });
                                                    }, { threshold: 0.5 });

                                                    observer.observe(video);
                                                }
                                            }}
                                        >
                                            <source src="/assets/site/videos/kadina-destek/Her-ilmek-Bir-Kadina-Destek.mp4" type="video/mp4" />
                                            <p className="text-white text-center p-4">
                                                Tarayıcınız video oynatmayı desteklemiyor veya video dosyası bulunamıyor.
                                                <br />
                                            </p>
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resim Galerisi Section */}
                <section className="py-5">
                    <div className="container text-center">
                        <div className="row g-4 justify-content-center">
                            <div className="col-12">
                                <Link href="/hedef-sayfa" className="text-decoration-none">
                                    <div className="image-gallery-wrapper d-flex flex-column align-items-center">

                                        {/* Resim 1 */}
                                        <div className="gallery-item mb-4">
                                            <div className="image-container">
                                                <img
                                                    src="/assets/site/images/kadina-destek/1.png"
                                                    alt="Galeri Resmi 1"
                                                    className="w-100 h-auto rounded shadow-sm"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        </div>

                                        {/* Resim 2 */}
                                        <div className="gallery-item mb-4">
                                            <div className="image-container">
                                                <img
                                                    src="/assets/site/images/kadina-destek/2.png"
                                                    alt="Galeri Resmi 2"
                                                    className="w-100 h-auto rounded shadow-sm"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        </div>

                                        {/* Resim 3 */}
                                        <div className="gallery-item mb-4">
                                            <div className="image-container">
                                                <img
                                                    src="/assets/site/images/kadina-destek/3.png"
                                                    alt="Galeri Resmi 3"
                                                    className="w-100 h-auto rounded shadow-sm"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        </div>

                                        {/* Resim 4 */}
                                        <div className="gallery-item mb-4">
                                            <div className="image-container">
                                                <img
                                                    src="/assets/site/images/kadina-destek/4.png"
                                                    alt="Galeri Resmi 4"
                                                    className="w-100 h-auto rounded shadow-sm"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        </div>

                                        {/* Resim 5 */}
                                        <div className="gallery-item mb-4">
                                            <div className="image-container">
                                                <img
                                                    src="/assets/site/images/kadina-destek/5.png"
                                                    alt="Galeri Resmi 5"
                                                    className="w-100 h-auto rounded shadow-sm"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        </div>

                                        {/* Resim 6 */}
                                        <div className="gallery-item mb-4">
                                            <div className="image-container">
                                                <img
                                                    src="/assets/site/images/kadina-destek/6.png"
                                                    alt="Galeri Resmi 6"
                                                    className="w-100 h-auto rounded shadow-sm"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Text Section - Sayfa Sonu */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-md-10 col-12">
                                <div className="text-content text-center">
                                    <h4 className="mb-4 fw-bold text-dark">
                                        Her İlmek Bir Kadına Destek
                                    </h4>
                                    <p>Kadın, hayatın kendisidir; dünyayı değiştirir ve geleceği şekillendirir. Bir hayat, ancak özgür bir gelecekle anlam 
                                        bulur.Ve değer verilen her katkı, gerçek gücünü gösterir.<br></br>
                                        İşte bu yüzden, hayatın her anında kendi yolunda ilerleyen, Cesaretiyle dünyayı dönüştüren her kadının
                                        Ekonomik bağımsızlığı ve profesyonel hayattaki yeri, Hepimizin ortak sorumluluğudur.<br></br>
                                        Desa olarak, 4 yıldır KEDV ile birlikte, Her 8 Mart’ta “Her İlmek Bir Kadına Destek” projemizi hayata geçiriyoruz.<br></br>
                                        Amacımız; kadınların üretime katılmalarını sağlamak, onları sosyal ve ekonomik açıdan güçlendirmek.<br></br>
                                        KEDV’in desteklediği kadın kooperatifleri tarafından üretilen, yüzde yüz el işçiliği ile tasarlanmış deri 
                                        çantalar keşfedilmeyi bekliyor.<br></br>
                                        Kadınların potansiyellerini keşfetmelerine ve dünyayı etkilemelerine destek olmak isteyen herkesi, binlerce 
                                        kadının el emeğiylehazırlanan bu özel çantaları keşfetmeye davet ediyoruz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default AboutUs;
