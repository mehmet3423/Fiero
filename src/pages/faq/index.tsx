import { NextPage } from "next";
import { useState } from "react";
import SEOHead from "@/components/SEO/SEOHead";
import { useGeneralContents } from "@/hooks/services/general-content/useGeneralContents";
import { GeneralContentType } from "@/constants/models/GeneralContent";

const FAQPage: NextPage = () => {
  const { contents: cargoInfos } = useGeneralContents(
    GeneralContentType.AccordionCargoInfos
  );
  const { contents: ordersAndReturns } = useGeneralContents(
    GeneralContentType.AccordionOrderAndReturns
  );
  const { contents: payment } = useGeneralContents(
    GeneralContentType.AccordionPayment
  );

  const shippingFaqs = cargoInfos?.items.map((faq) => ({
    id: faq.id,
    question: faq.title,
    answer: faq.content,
  }));

  // Accordion açık/kapalı durumları için state'ler
  const [openedShipping, setOpenedShipping] = useState<number | null>(0);
  const [openedOrders, setOpenedOrders] = useState<number | null>(0);
  const [openedPayment, setOpenedPayment] = useState<number | null>(0);

  return (
    <>
      <SEOHead canonical="/faq" />
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Sıkça Sorulan Sorular</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="tf-accordion-wrap d-flex justify-content-between">
            <div className="content" style={{ flex: 1, minWidth: 0 }}>
              {/* --- Kargo Bilgileri --- */}
              <h5 className="mb_24">Kargo Bilgileri</h5>
              <div className="flat-accordion style-default has-btns-arrow mb_60">
                {shippingFaqs?.map((faq, index) => (
                  <div
                    className={`flat-toggle${openedShipping === index ? " active" : ""}`}
                    key={faq.id}
                  >
                    <div
                      className={`toggle-title${openedShipping === index ? " active" : ""}`}
                      onClick={() =>
                        setOpenedShipping(openedShipping === index ? null : index)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {faq.question}
                    </div>
                    <div
                      className="toggle-content"
                      style={{ display: openedShipping === index ? "block" : "none" }}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Sipariş ve İadeler --- */}
              <h5 className="mb_24">Sipariş ve İadeler</h5>
              <div className="flat-accordion style-default has-btns-arrow mb_60">
                {ordersAndReturns?.items.map((faq, index) => (
                  <div
                    className={`flat-toggle${openedOrders === index ? " active" : ""}`}
                    key={faq.id}
                  >
                    <div
                      className={`toggle-title${openedOrders === index ? " active" : ""}`}
                      onClick={() =>
                        setOpenedOrders(openedOrders === index ? null : index)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {faq.title}
                    </div>
                    <div
                      className="toggle-content"
                      style={{ display: openedOrders === index ? "block" : "none" }}
                    >
                      <p>{faq.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Ödeme --- */}
              <h5 className="mb_24">Ödeme</h5>
              <div className="flat-accordion style-default has-btns-arrow">
                {payment?.items.map((faq, index) => (
                  <div
                    className={`flat-toggle${openedPayment === index ? " active" : ""}`}
                    key={faq.id}
                  >
                    <div
                      className={`toggle-title${openedPayment === index ? " active" : ""}`}
                      onClick={() =>
                        setOpenedPayment(openedPayment === index ? null : index)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {faq.title}
                    </div>
                    <div
                      className="toggle-content"
                      style={{ display: openedPayment === index ? "block" : "none" }}
                    >
                      <p>{faq.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ kutu */}
            <div
              className="box tf-other-content radius-10 bg_grey-8"
              style={{ maxWidth: 400, marginLeft: 32 }}
            >
              <h5 className="mb_20">Sorunuz mu var?</h5>
              <p className="text_black-2 mb_40">
                Burada cevabını bulamadığınız sorularınız için bizimle iletişime geçebilirsiniz.
                <br />
                <br />
                Lütfen paketiniz bize ulaştıktan sonra 6 - 12 iş günü içinde iade işleminizin
                tamamlanacağını unutmayın.
              </p>
              <div className="d-flex gap-20 align-items-center">
                <a
                  href="/contact-us"
                  className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center"
                >
                  İletişim
                </a>
                <a href="/live-chat" className="tf-btn btn-line">
                  Canlı Sohbet <i className="icon icon-arrow1-top-left"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
