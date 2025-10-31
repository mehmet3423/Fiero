import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";

const SalesAgreementPage = () => {
    const { contents, isLoading } = useGeneralContents(
        GeneralContentType.DistanceSalesAgreement
    );

    return (
        <>
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">Satış Sözleşmesi</div>
                </div>
            </div>
            <section className="flat-spacing-25">
                <div className="container">
                    <div className="tf-main-area-page">
                        <div className="flatpage__content">
                            <div className="flatpage__header">
                                <div className="flatpage__title flatpage__title--noimg">Satış Sözleşmesi</div>
                                <img className="lazyload flatpage__img" src="" alt="Satış Sözleşmesi" style={{ display: "none" }} />
                            </div>
                            <div className="flatpage__text">
                                {isLoading && <p>Yükleniyor...</p>}
                                {!isLoading && (
                                    <>
                                        {(contents?.items || [])
                                            .slice()
                                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                            .map((item) => (
                                                <div key={item.id} className="gc-block">
                                                    {item.title && <h3>{item.title}</h3>}
                                                    {item.content && (
                                                        <div className="gc-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                                    )}
                                                </div>
                                            ))}
                                        {(!contents || (contents.items || []).length === 0) && (
                                            <p>Şu anda görüntülenecek içerik bulunamadı.</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <style jsx>{`
        .tf-main-area-page { margin-bottom: 3rem; padding: 2.5rem; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,.1); border-radius: 10px; }
        .flatpage__header { display: flex; align-items: center; margin-bottom: 2rem; }
        .flatpage__title { font-size: 1.25rem; font-weight: bold; color: #333; margin-bottom: 0; }
        .flatpage__title--noimg { margin-right: 1rem; }
        .flatpage__img { max-width: 80px; margin-left: 1rem; }
        .flatpage__text { color: #666; line-height: 1.6; }
        .flatpage__text h3 { font-size: 1.1rem; margin: 1rem 0 .5rem; }
        .flatpage__text p { margin-bottom: .7rem; }
        .gc-block + .gc-block { margin-top: 1rem; }
        .gc-content :global(p) { margin: 0 0 .7rem 0; }
      `}</style>
        </>
    );
};

export default SalesAgreementPage;


