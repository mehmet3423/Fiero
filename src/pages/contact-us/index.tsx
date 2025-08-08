import Link from "next/link";
import SEOHead from "@/components/SEO/SEOHead";

function ContactUsPage() {
  return (
    <>
      <SEOHead canonical="/contact-us" />
      <main className="main">
        {/* Page Title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">
              Contact Us
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
                  <h5 className="mb_20">Visit Our Store</h5>
                  <div className="mb_20">
                    <p className="mb_15"><strong>Adres</strong></p>
                    <p>İSTANBUL</p>
                  </div>                  
                  <div className="mb_20">
                    <p className="mb_15"><strong>İnternet Sitemiz</strong></p>
                    <a  className="tf-btn btn-line" href="http://www.desa.com.tr">site adresi</a>
                  </div>
                  <div className="mb_20">
                    <p className="mb_15"><strong>Telefon</strong></p>
                    <p>444 44 44</p>
                  </div>                  
                  <div>
                    <ul className="tf-social-icon d-flex gap-20 style-default">
                      <li><a href="/" className="box-icon link round social-facebook border-line-black"><i className="icon fs-14 icon-fb"></i></a></li>
                      <li><a href="/" className="box-icon link round social-instagram border-line-black"><i className="icon fs-14 icon-instagram"></i></a></li>
                      <li><a href="/" className="box-icon link round social-tiktok border-line-black"><i className="icon fs-14 icon-tiktok"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Right: Contact Form */}
              <div className="bg_grey-7">
                <div className="flat-spacing-9">
                  <div className="container">
                    <div className="flat-title">
                      <span className="title">Get in Touch</span>
                      <p className="sub-title text_black-2">
                        If you've got great products your making or looking to work with us then drop us a line.
                      </p>
                    </div>
                    <div>
                      <form className="mw-705 mx-auto text-center form-contact" id="contactform" action="#" method="post">
                        <div className="d-flex gap-15 mb_15">
                          <fieldset className="w-100">
                            <input type="text" name="name" id="name" required placeholder="Name *" />
                          </fieldset>
                          <fieldset className="w-100">
                            <input type="email" name="email" id="email" required placeholder="Email *" />
                          </fieldset>
                        </div>
                        <div className="mb_15">
                          <textarea placeholder="Message" name="message" id="message" required cols={30} rows={10}></textarea>
                        </div>
                        <div className="send-wrap">
                          <button type="submit" className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center">
                            Send
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