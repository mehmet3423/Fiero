import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGetAllGeneralContent";
import Link from "next/link";
import SEOHead from "@/components/SEO/SEOHead";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

// SustainabilitySub için props interface
interface SustainabilitySubProps {
    bannerImage: string;
    sideImage: string;
    bannerTitle: string;
    title: string;
    content: string;
    canonical?: string;
    seoData?: AboutSEOData;
}

function SustainabilitySub({ 
    bannerTitle,
    bannerImage, 
    sideImage, 
    title, 
    content, 
    canonical = "/sustainability", 
    seoData 
}: SustainabilitySubProps) {

    return (
        <>
            <SEOHead canonical={canonical} />
            <main>
                {/* Slider Section */}
                <section className="tf-slideshow about-us-page position-relative">
                    <div className="banner-wrapper" style={{ minWidth: "100vw",}}>
                        <img
                            className="lazyload w-100"
                            src={bannerImage}
                            data-src={bannerImage}
                            alt={title}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    </div>
                </section>
                <div className="container mt-5" >
                    <div className="line"></div>
                </div>
                {/* Content Section */}
                <section className=" w-100">
                    <div className="container">
                        <div className="row align-items-center" style={{ minHeight: "500px" }}>
                            <div className="col-lg-9 col-md-8 col-12">
                                <div className="pe-lg-4">
                                    <h5 className="fw-semi-bold mb-4">{title}</h5>
                                    <div className="text fs-6">
                                        <div dangerouslySetInnerHTML={{ __html: content }} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-lg-3 col-md-4 col-12">
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    <img
                                        className="lazyload rounded"
                                        data-src={sideImage}
                                        src={sideImage}
                                        alt={title}
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            objectFit: "cover"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default SustainabilitySub;