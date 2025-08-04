import { sustainabilityCollections } from "./sustainabilityData";
import Link from "next/link";
import SEOHead from "@/components/SEO/SEOHead";

function Sustainability() {
    return (
        <>
            <SEOHead canonical="/sustainability" />
            <main>
                {/* Banner */}
                <section className="tf-slideshow about-us-page position-relative">
                    <div className="banner-wrapper" style={{ minWidth: "100vw", }}>
                        <img
                            className="lazyload w-100"
                            src="/assets/site/images/sustainability/index/desa-ile-yarina-deger.jpg"
                            data-src="/assets/site/images/sustainability/index/desa-ile-yarina-deger.jpg"
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

                {/* Text section */}
                <section className="flat-image-text-section w-100">
                    <div className="container w-100 d-flex justify-content-center">
                        <div className="tf-grid-layout col-xl-9 md-col-2 tf-img-with-text style-4">
                            <div className="tf-image-wrap">
                                <img
                                    className="lazyload w-100"
                                    data-src="/assets/site/images/sustainability/index/filizlenmis-toprak.jpg"
                                    src="/assets/site/images/sustainability/index/filizlenmis-toprak.jpg"
                                    alt="collection-img"
                                />
                            </div>
                            <div className="tf-content-wrap px-0 d-flex justify-content-center align-items-center w-100" style={{ minHeight: "400px" }}>
                                <div className="text-center w-100">
                                    <div className="text fs-5">
                                        Her adımda, her kararda geleceği düşünerek ilerliyoruz. Doğayı koruyor, kaynakları
                                        özenle kullanıyoruz. Sürdürülebilir üretim ve çevreye saygıyla, yarına değer katıyoruz.
                                        Çünkü yarının değeri, bugünde başlar.<br /><br />
                                        DESA ile doğayı ve geleceği koruyarak, yarına umut bırakıyoruz.<br /><br />
                                        <br></br><b>#desaileyarınadeğer</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container my-5">
                    <div className="line"></div>
                </div>

                {/* Grid section */}
                <section className="py-1">
                    <div className="container">
                        <div className="row" style={{ columnGap: '0px', rowGap: '3.5rem' }}>
                            {sustainabilityCollections.map((col) => (
                                <div key={col.key} className="col-lg-4 col-md-6 col-sm-6 col-12 d-flex justify-content-center align-items-center">
                                    <Link href={`/sustainability/${col.slug}`} passHref>
                                        <div
                                            className="position-relative overflow-hidden rounded my-0"
                                            style={{
                                                height: "370px",
                                                width: "370px",
                                                transition: "transform 0.3s ease",
                                                cursor: "pointer"
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.transform = "scale(1.05)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.transform = "scale(1)")
                                            }
                                        >
                                            <img
                                                className="lazyload w-100 h-100 "
                                                data-src={col.image}
                                                src={col.image}
                                                alt="collection-img"
                                                style={{ objectFit: "cover" }}
                                            />
                                            <div className="position-absolute bottom-0 start-50 translate-middle-x p-2">
                                                <h6
                                                    className="text-white text-center mb-0 fw-bold lh-1"
                                                    style={{
                                                        border: "1px solid rgba(255,255,255,0.8)",
                                                        padding: "10px 10px",
                                                        borderRadius: "4px",
                                                        whiteSpace: "normal",
                                                        wordWrap: "break-word",
                                                        maxWidth: "190px"
                                                    }}
                                                >
                                                    {col.bannerTitle}
                                                </h6>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Text section */}
                <section className="flat-image-text-section w-100">
                    <div className="container w-100 d-flex justify-content-center">
                        <div className="tf-grid-layout col-xl-10 md-col-2 tf-img-with-text style-4 align-items-center" style={{ height: "400px" }}>
                            <div className="tf-content-wrap col-xl-8 px-0 d-flex align-items-center w-100" style={{ minHeight: "400px" }}>
                                <div className="text-end w-100">
                                    <div className="text fs-5">
                                        <b>Türkiyenin Altın Dereceli Markasını #farket</b><br />
                                        Uluslararası deri üretici markalarını denetleyen Leather Working Group'un denetimleri sonucunda; çevre koruma,
                                        sürdürülebilirlik politikaları, üretim kalitesi ve güvenlik uygulamaları konularında Desa, en yüksek derece olan
                                        "Altın Derece"nin sahibi oldu.
                                    </div>
                                </div>
                            </div>
                            <div className="container d-flex justify-content-center align-items-center" style={{ paddingLeft: "0" }}>
                                <div className="tf-image-wrap col-xl-2 d-flex justify-content-center align-items-center" style={{ maxHeight: "200px", width: "200px", }}>
                                    <img
                                        className="lazyload w-100"
                                        data-src="/assets/site/images/sustainability/index/leather-working-group.png"
                                        src="/assets/site/images/sustainability/index/leather-working-group.png"
                                        alt="collection-img"
                                        width="200px"
                                        height="200px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container mt-4 align-items-center d-flex justify-content-center">
                        <a
                            href="/mevzu-derin"                            
                        >
                            <img
                                src="/assets/site/images/sustainability/index/mevzu-derin.jpg"
                                data-src="/assets/site/images/sustainability/index/mevzu-derin.jpg"
                                alt="collection-img"
                            />
                        </a>                    
                </div>
                <div className="container mt-4">
                    <div className="tf-image-wrap">
                        <img
                            className="lazyload w-100"
                            data-src="/assets/site/images/sustainability/index/kuresel-amaclar.jpg"
                            src="/assets/site/images/sustainability/index/kuresel-amaclar.jpg"
                            alt="collection-img"
                        />
                    </div>
                </div>
                {/* Text section */}
                <section className="flat-image-text-section w-100">
                    <div className="container w-100 d-flex justify-content-center">
                        <div className="tf-grid-layout col-xl-10 md-col-2 tf-img-with-text style-4 align-items-center" style={{ height: "400px" }}>
                            <div className="container d-flex justify-content-center align-items-center" style={{ paddingRight: "0" }}>
                                <div className="tf-image-wrap col-xl-2 d-flex justify-content-center align-items-center" style={{ maxHeight: "200px", width: "200px", }}>
                                    <img
                                        className="lazyload w-100"
                                        data-src="/assets/site/images/sustainability/index/higg-logo.jpg"
                                        src="/assets/site/images/sustainability/index/higg-logo.jpg"
                                        alt="collection-img"
                                        width="200px"
                                        height="200px"
                                    />
                                </div>
                            </div>
                            <div className="tf-content-wrap col-xl-8 px-0 d-flex align-items-center w-100" style={{ minHeight: "400px" }}>
                                <div className="text-start w-100">
                                    <div className="text fs-5">
                                        <b>Sürdürülebilirlik Yolculuğunu #farket</b><br />
                                        Çevresel ve sosyal sürdürülebilirlik değerlendirmemizi; sürdürülebilirlik yolculuğunun her aşamasında markaların,
                                        tesislerin, bir şirketin veya ürünün sürdürülebilirlik performansını doğru bir şekilde ölçmesini ve puanlamasını
                                        sağlayan Higg Index FEM(Facility Environmental Module) ve FSLM(Facility Social & Labor Module) modülleri ile
                                        gerçekleştiriyoruz.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Sustainability;