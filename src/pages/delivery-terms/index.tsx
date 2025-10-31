import { GeneralContentType } from "@/constants/models/GeneralContent";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";

const DeliveryTermsPage = () => {
    const { contents, isLoading } = useGeneralContents(
        GeneralContentType.DeliveryTerms
    );

    const fallbackHtml = `
  <h3>Teslimat Koşulları</h3>
  <p>Siparişleriniz, banka onayı alındıktan sonra 3 iş günü (Pazartesi-Cuma) içerisinde kargoya teslim edilir. Teslimat adresinin www.fiero.com'a uzaklığına göre kargo şirketi 1-3 gün içerisinde siparişinizi size ulaştıracaktır.</p>
  <p>Özel üretim ürünlerin teslim süreleri imalat zamanına göre farklılık göstermektedir. Bu tür ürünlerin teslimat bilgileri ve süreleri ürün sayfalarında belirtilmiştir.</p>
  <p>Tarafımızdan kaynaklanan bir aksilik olması halinde size üyelik bilgilerinizden yola çıkılarak haber verilecektir. Bu yüzden üyelik bilgilerinizin eksiksiz ve doğru olması önemlidir. Bayram ve tatil günlerinde teslimat yapılmamaktadır.</p>
  <p>Seçtiğiniz ürünlerin tamamı anlaşmalı olduğumuz kargo şirketleri tarafından www.fiero.com garantisi ile size teslim edilecektir.</p>
  <p>Satın aldığınız ürünler bir teyit e-postası ile tarafınıza bildirilecektir. Seçtiğiniz ürünlerden herhangi birinin stokta mevcut olmaması durumunda konu ile ilgili bir e-posta size yollanacak ve ürünün ilk stoklara gireceği tarih tarafınıza bildirilecektir.</p>
  <p>www.fiero.com on-line alışveriş sitesidir. Aynı anda birden çok kullanıcıya alışveriş yapma imkanı tanır. Ender de olsa tüketicinin aynı ürünü alması söz konusudur ve ürün stoklarda tükenebilmektedir; bu durumda ödeme iade süreci işletilir.</p>
  <p>Ödemesini internet üzerinden yaptığınız ürün stoklarımızda kalmamış ise en az 4 (dört) en fazla 30 (otuz) gün bekleme süresi vardır. Ürün bu tarihler arasında tüketiciye verilemez ise yapılan ödeme iade edilir.</p>`;

    return (
        <>
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">Teslimat Koşulları</div>
                </div>
            </div>
            <section className="flat-spacing-25">
                <div className="container">
                    <div className="tf-main-area-page">
                        <div className="flatpage__content">
                            <div className="flatpage__header">
                                <div className="flatpage__title flatpage__title--noimg">Teslimat Koşulları</div>
                                <img className="lazyload flatpage__img" src="" alt="Teslimat Koşulları" style={{ display: "none" }} />
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
                                            <div className="gc-content" dangerouslySetInnerHTML={{ __html: fallbackHtml }} />
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
        .tf-page-title .heading { font-size: 1.6rem; }
        .flatpage__header { display: flex; align-items: center; margin-bottom: 2rem; }
        .flatpage__title { font-size: 1.25rem; font-weight: bold; color: #333; margin-bottom: 0; }
        .flatpage__title--noimg { margin-right: 1rem; }
        .flatpage__img { max-width: 80px; margin-left: 1rem; }
        .flatpage__text { color: #444; line-height: 1.8; }
        .flatpage__text h3 { font-size: 1.1rem; margin: 1rem 0 .5rem; }
        .flatpage__text p { margin-bottom: .8rem; }
        .gc-block + .gc-block { margin-top: 1rem; }
      `}</style>
        </>
    );
};

export default DeliveryTermsPage;


