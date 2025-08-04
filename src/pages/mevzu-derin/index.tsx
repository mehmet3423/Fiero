
import Link from "next/link";
import SEOHead from "@/components/SEO/SEOHead";

function MevzuDerin() {
    return (
        <>
            <SEOHead canonical="/mevzu-derin" />
            <main>
                {/* Banner */}
                <section className="tf-slideshow about-us-page position-relative">
                    <div className="banner-wrapper" style={{ minWidth: "100vw", }}>
                        <img
                            className="lazyload w-100"
                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-banner.jpg"
                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-banner.jpg"
                            alt="image-collection"
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    </div>
                </section>

                {/* Content sections */}
                <div className="container my-5">
                    <div className="line"></div>
                </div>

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
                                            id="mevzu-derin-video"
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
                                                const video = document.getElementById('mevzu-derin-video') as HTMLVideoElement;
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
                                            <source src="/assets/site/videos/mevzu-derin/DESAnın-50-Yılı-Mevzu-Derin.mp4" type="video/mp4" />
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

                {/* Image-Text Section 1*/}
                <section className="flat-spacing-23 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-1.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-1.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            Türkiye'deki deri modasının geçmişi ve bugününün, <b>Desa</b>'nın tarihiyle şekillendiğini biliyor muydun?
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Image-Text Section 2*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">

                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            <b>1972 yılında</b> bir eczacılık öğrencisinin vizyoner
                                                            girişimi ve titiz çalışmasıyla başlıyor bu öykü…
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-2.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-2.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Image-Text Section 3*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-3.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-3.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            <b>Desa</b> markası kısa zamanda hem Türkiye’de hem de dünya deri sektöründe fark ediliyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Image-Text Section 4*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">

                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            Küçük bir atölyede eczacı titizliğiyle başlayan kaliteli üretim ve ürün süreci, <b>Desa</b>’nın geleceğini şekillendiriyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-4.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-4.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Image-Text Section 5*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-5.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-5.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            Türkiye’de ihracatın tarım rünlerinden ibaret olduğu dönemde <b>Desa</b>, moda ürünü ihraç ediyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Image-Text Section 6*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">

                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            <b>Desa</b> bugün, <b>Gold sertifikalı</b> derileriyle üç ayrı tesiste sürdürülebilir çevre misyonuyla üretim yapıyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-6.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-6.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Image-Text Section 7*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-7.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-7.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            <b>Desa</b> bugün, Türkiye’nin yaptığı deri saraciye ürünü ihracatının yaklaşık <b>%70’ini</b> gerçekleştiriyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Image-Text Section 8*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">

                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            <b>Desa</b> bugün, kendiyetiştirdiği iki bine yakın çalışanıyla Türkiye’deki deri sektörüne insan kaynağı sağlıyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-8.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-8.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Image-Text Section 9*/}
                <section className="flat-spacing-20 flat-image-text-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-9 col-lg-10 col-md-11 col-12">
                                <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
                                    <div className="tf-image-wrap">
                                        <img
                                            className="lazyload w-100"
                                            data-src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-9.jpg"
                                            src="/assets/site/images/sustainability/mevzu-derin/mevzu-derin-9.jpg"
                                            alt="collection-img"
                                        />
                                    </div>
                                    <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
                                        <div>
                                            <div className="heading">
                                                { }
                                            </div>
                                            <div className="text-center">
                                                {(
                                                    <>
                                                        <h5>
                                                            <b>Desa</b> bugün, İtalya’da da ar-ge ve üretim tesisi kurarak dünya markalarına “Ben buradayım” diyor.
                                                        </h5>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container align-items-center d-flex justify-content-center ">
                    <img
                        className="lazyload w-50"
                        data-src="/assets/site/images/sustainability/mevzu-derin/desa-mevzu-derin.jpg"
                        src="/assets/site/images/sustainability/mevzu-derin/desa-mevzu-derin.jpg"
                        alt="collection-img"
                    />
                </div>



            </main>
        </>
    );
}

export default MevzuDerin;