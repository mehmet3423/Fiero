import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UNSUBSCRIBE_FROM_NOTIFICATIONS } from "@/constants/links";
import useMyMutation from "@/hooks/useMyMutation";
import SEOHead from "@/components/SEO/SEOHead";
import toast from "react-hot-toast";

export default function UnsubscribePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { mutateAsync, isPending } = useMyMutation();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "idle"
  >("idle");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // URL'den email parametresini al
    const emailParam = router.query.email as string;

    if (!emailParam) {
      setStatus("error");
      toast.error(
        t("footer.unsubscribe.error.email_missing") ||
          "Email parameter is missing"
      );
      return;
    }

    // Email'i decode et (URL encoded olabilir)
    const decodedEmail = decodeURIComponent(emailParam);
    setEmail(decodedEmail);

    // Otomatik olarak unsubscribe isteği gönder
    const unsubscribe = async () => {
      try {
        setStatus("loading");

        // LocaleType: tr = 0, en = 1
        const localeType = language === "tr" ? 0 : 1;

        // Query parametrelerini oluştur
        const queryParams = new URLSearchParams({
          UserMail: decodedEmail,
          IsEmailNotificationEnabled: "false",
          IsSMSNotificationEnabled: "false",
          LocaleType: localeType.toString(),
        });

        await mutateAsync({
          url: `${UNSUBSCRIBE_FROM_NOTIFICATIONS}?${queryParams.toString()}`,
          method: HttpMethod.POST,
          showErrorToast: true,
        });

        setStatus("success");
        toast.success(
          t("footer.unsubscribe.success") ||
            "Successfully unsubscribed from newsletter!"
        );
      } catch (error: any) {
        setStatus("error");
        if (!error.response?.data?.message && !error.response?.data?.detail) {
          toast.error(
            t("footer.unsubscribe.error.general") ||
              "An error occurred. Please try again."
          );
        }
      }
    };

    // Router hazır olduğunda unsubscribe işlemini başlat
    if (router.isReady) {
      unsubscribe();
    }
  }, [router.isReady, router.query.email, language, mutateAsync, t]);

  return (
    <>
      <SEOHead canonical="/unsubscribe" />
      <main className="main">
        <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0">
          <div className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">{t("breadcrumb.home") || "Home"}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {t("footer.unsubscribe.title") || "Unsubscribe"}
              </li>
            </ol>
          </div>
        </nav>

        <div className="page-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div
                  className="text-center py-5"
                  style={{
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {status === "loading" && (
                    <>
                      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                        {t("footer.unsubscribe.processing") || "Processing..."}
                      </h2>
                      <p style={{ fontSize: "1.4rem", color: "#666" }}>
                        {t("footer.unsubscribe.processing_desc") ||
                          "Please wait while we process your unsubscribe request."}
                      </p>
                    </>
                  )}

                  {status === "success" && (
                    <>
                      <div
                        className="mb-4"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          backgroundColor: "#28a745",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: "3rem" }}>
                          ✓
                        </span>
                      </div>
                      <h2
                        style={{
                          fontSize: "2rem",
                          marginBottom: "1rem",
                          color: "#28a745",
                        }}
                      >
                        {t("footer.unsubscribe.success_title") ||
                          "Successfully Unsubscribed"}
                      </h2>
                      <p
                        style={{
                          fontSize: "1.4rem",
                          color: "#666",
                          marginBottom: "2rem",
                        }}
                      >
                        {t("footer.unsubscribe.success_message") ||
                          "You have been successfully unsubscribed from our newsletter."}
                        {email && (
                          <span
                            style={{
                              display: "block",
                              marginTop: "0.5rem",
                              fontWeight: "500",
                            }}
                          >
                            {email}
                          </span>
                        )}
                      </p>
                      <Link
                        href="/"
                        className="btn btn-primary"
                        style={{
                          fontSize: "1.4rem",
                          padding: "1rem 2rem",
                        }}
                      >
                        {t("footer.unsubscribe.back_to_home") || "Back to Home"}
                      </Link>
                    </>
                  )}

                  {status === "error" && (
                    <>
                      <div
                        className="mb-4"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          backgroundColor: "#dc3545",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: "3rem" }}>
                          ✕
                        </span>
                      </div>
                      <h2
                        style={{
                          fontSize: "2rem",
                          marginBottom: "1rem",
                          color: "#dc3545",
                        }}
                      >
                        {t("footer.unsubscribe.error_title") ||
                          "Unsubscribe Failed"}
                      </h2>
                      <p
                        style={{
                          fontSize: "1.4rem",
                          color: "#666",
                          marginBottom: "2rem",
                        }}
                      >
                        {t("footer.unsubscribe.error_message") ||
                          "We encountered an error while processing your unsubscribe request. Please try again later or contact support."}
                      </p>
                      <div className="d-flex gap-3 justify-content-center">
                        <Link
                          href="/"
                          className="btn btn-outline-primary"
                          style={{
                            fontSize: "1.4rem",
                            padding: "1rem 2rem",
                          }}
                        >
                          {t("footer.unsubscribe.back_to_home") ||
                            "Back to Home"}
                        </Link>
                        <Link
                          href="/contact-us"
                          className="btn btn-primary"
                          style={{
                            fontSize: "1.4rem",
                            padding: "1rem 2rem",
                          }}
                        >
                          {t("footer.unsubscribe.contact_support") ||
                            "Contact Support"}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
