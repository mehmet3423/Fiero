import SEOHead from "@/components/SEO/SEOHead";
import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";

const OurStoryPage = () => {
    const { contents, isLoading } = useGeneralContents(
        GeneralContentType.OurStoryContent
    );

    return (
        <>
            <SEOHead canonical="/our-story" />
            <main>
                <section className="tf-page-title style-2">
                    <div className="container-full">
                        <div className="heading text-center">Hikayemiz</div>
                    </div>
                </section>

                <section className="flat-spacing-23 flat-image-text-section">
                    <div className="container">
                        {isLoading && <p>Yükleniyor...</p>}
                        {!isLoading && (
                            <>
                                {(contents?.items || [])
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
                                                                alt={item.title || "our-story-image"}
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
                                                                        alt={item.title || "our-story-image"}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                {(contents?.items || []).length === 0 && (
                                    <p>Şu anda görüntülenecek içerik bulunamadı.</p>
                                )}
                            </>
                        )}
                    </div>
                    <style jsx>{`
            .flat-image-text-section :global(.tf-grid-layout.tf-img-with-text.style-4) {
              margin-bottom: 56px !important;
              position: relative;
              z-index: 1;
              display: flex !important;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 40px;
              width: 100%;
              clear: both;
            }
            .flat-image-text-section :global(.tf-grid-layout.tf-img-with-text.style-4:last-of-type) {
              margin-bottom: 0 !important;
            }
            .flat-image-text-section :global(.grid-img-group) { display: flex; gap: 16px; justify-content: flex-end; width: 50%; }
            .flat-image-text-section :global(.tf-image-wrap) { width: 50%; }
            .flat-image-text-section :global(.tf-content-wrap) { width: 50%; }
            .flat-image-text-section :global(.tf-image-wrap img),
            .flat-image-text-section :global(.grid-img-group img) {
              max-width: 100%;
              height: auto;
              display: block;
              object-fit: cover;
            }
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
            </main>
        </>
    );
};

export default OurStoryPage;


