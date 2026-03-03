"use client";
import SEOHead from "@/components/SEO/SEOHead";
import { useGetSupportEmailAddress } from "@/hooks/services/settings";
import { useSubmitContactForm } from "@/hooks/services/contact/useSubmitContactForm";
import { SEND_MAIL } from "@/constants/links";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

function ContactUsPage() {
  const { t } = useLanguage();
  const { supportEmail } = useGetSupportEmailAddress();
  const defaultEmail = "merhaba@nors.com.tr";
  const emailAddress = supportEmail || defaultEmail;
  const { submit, isPending } = useSubmitContactForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const message = (formData.get("message") as string).trim();

    const subject = `${t("contactUs.emailSubject")}: ${name}`;
    const body = `${t("contactUs.emailFrom")}: ${email}\n\n${t("contactUs.emailMessage")}:\n${message}`;
    const mailUrl = new URL(SEND_MAIL);
    mailUrl.searchParams.set("to", emailAddress);
    mailUrl.searchParams.set("subject", subject);
    mailUrl.searchParams.set("body", body);

    const sendMailPromise = fetch(mailUrl.toString(), { method: HttpMethod.POST });

    try {
      const [contactResponse] = await Promise.all([
        submit({
          firstName: name,
          surname: null,
          email,
          title: t("contactUs.emailSubject"),
          body: message,
        }),
        sendMailPromise,
      ]);

      if (contactResponse.ok) {
        toast.success(t("contactUs.successMessage"));
        form.reset();
      } else {
        toast.error(t("contactUs.errorMessage"));
      }
    } catch {
      toast.error(t("contactUs.errorMessage"));
    }
  };
  return (
    <>
      <SEOHead canonical="/contact-us" />
      <main className="main">
        {/* Page Title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">
              {t("contactUs.pageTitle")}
            </div>
          </div>
        </div>
        {/* /Page Title */}

        <section className="flat-spacing-9">
          <div className="container">
            <div className="tf-grid-layout gap-0 lg-col-2">
              {/* Left: Contact Info */}
              <div className="tf-content-left has-mt">
                <div className="sticky-top">
                  <h5 className="mb-4">{t("contactUs.visitStore")}</h5>
                  <div className="row g-3 mb-4  ">
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-start gap-3 p-3 rounded border bg-white contact-info-item">
                        <span className="contact-info-icon text-muted">
                          <i className="icon-place" style={{ fontSize: "1.25rem" }}></i>
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <small className="text-muted d-block mb-1">{t("contactUs.address")}</small>
                          <span>{t("contactUs.addressValue")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-start gap-3 p-3 rounded border bg-white contact-info-item">
                        <span className="contact-info-icon text-muted">
                          <i className="icon-shop" style={{ fontSize: "1.25rem" }}></i>
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <small className="text-muted d-block mb-1">{t("contactUs.website")}</small>
                          <a href="https://www.eserleather.com" target="_blank" rel="noopener noreferrer" className="text-decoration-underline">
                            {t("contactUs.websiteLink")}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-start gap-3 p-3 rounded border bg-white contact-info-item">
                        <span className="contact-info-icon text-muted">
                          <i className="icon-suport" style={{ fontSize: "1.25rem" }}></i>
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <small className="text-muted d-block mb-1">{t("contactUs.phone")}</small>
                          <a href="tel:4444444" className="text-body">444 44 44</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="d-flex align-items-start gap-3 p-3 rounded border bg-white contact-info-item">
                        <span className="contact-info-icon text-muted">
                          <i className="icon-mail" style={{ fontSize: "1.25rem" }}></i>
                        </span>
                        <div className="flex-grow-1 min-w-0">
                          <small className="text-muted d-block mb-1">{t("contactUs.email")}</small>
                          <a href={`mailto:${emailAddress}`} className="text-body text-break">{emailAddress}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted d-block mb-2">{t("contactUs.socialMedia")}</small>
                    <ul className="tf-social-icon d-flex gap-3 style-default list-unstyled mb-0">
                      <li><a href="/" className="box-icon link round social-facebook border-line-black" aria-label="Facebook"><i className="icon fs-14 icon-fb"></i></a></li>
                      <li><a href="/" className="box-icon link round social-instagram border-line-black" aria-label="Instagram"><i className="icon fs-14 icon-instagram"></i></a></li>
                      <li><a href="/" className="box-icon link round social-tiktok border-line-black" aria-label="TikTok"><i className="icon fs-14 icon-tiktok"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Right: Contact Form */}
              <div className="bg_grey-7 m-1">
                <div className="flat-spacing-9">
                  <div className="container">
                    <div className="flat-title">
                      <span className="title">{t("contactUs.getInTouch")}</span>
                      <p className="sub-title text_black-2">
                        {t("contactUs.getInTouchDesc")}
                      </p>
                    </div>
                    <div>
                      <form className="mw-705 mx-auto text-center form-contact" id="contactform" onSubmit={handleSubmit}>
                        <div className="d-flex gap-15 mb_15">
                          <fieldset className="w-100">
                            <input type="text" name="name" id="name" required placeholder={t("contactUs.namePlaceholder")} />
                          </fieldset>
                          <fieldset className="w-100">
                            <input type="email" name="email" id="email" required placeholder={t("contactUs.emailPlaceholder")} />
                          </fieldset>
                        </div>
                        <div className="mb_15">
                          <textarea placeholder={t("contactUs.messagePlaceholder")} name="message" id="message" required cols={30} rows={10}></textarea>
                        </div>
                        <div className="send-wrap">
                          <button type="submit" className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center" disabled={isPending}>
                            {isPending ? t("contactUs.sending") : t("contactUs.send")}
                          </button>
                        </div>
                      </form>
                    </div>
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

export default ContactUsPage;