import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useConfirmEmail } from "@/hooks/services/useConfirmEmail";
import { useAuth } from "@/hooks/context/useAuth";

function ConfirmedEmailPage() {
  const router = useRouter();
  const { userId, token } = router.query;
  const { handleConfirmEmail, isPending } = useConfirmEmail();
  const { refetchUserProfile } = useAuth();
  const [confirmationStatus, setConfirmationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [countdown, setCountdown] = useState(20);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (
      userId &&
      token &&
      typeof userId === "string" &&
      typeof token === "string" &&
      !hasRequestedRef.current
    ) {
      hasRequestedRef.current = true;
      handleConfirmEmail(userId, token, (isSuccess: boolean) => {
        setConfirmationStatus(isSuccess ? "success" : "error");
        if (isSuccess) {
          // Refetch user profile to update emailConfirmed status
          refetchUserProfile();
        }
      });
    }
  }, [userId, token]);

  useEffect(() => {
    if (confirmationStatus === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [confirmationStatus, router]);

  if (!userId || !token) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center p-5">
                <i
                  className="bx bx-error-circle"
                  style={{ fontSize: "4rem", color: "#dc3545" }}
                ></i>
                <h3 className="mt-3 text-danger">Geçersiz Link</h3>
                <p className="text-muted">
                  E-posta onay linki geçersiz veya eksik parametreler içeriyor.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/")}
                >
                  Anasayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center p-5">
              {confirmationStatus === "loading" && (
                <>
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="sr-only">Yükleniyor...</span>
                  </div>
                  <h3>E-posta Onayı Kontrol Ediliyor</h3>
                  <p className="text-muted">Lütfen bekleyiniz...</p>
                </>
              )}

              {confirmationStatus === "success" && (
                <>
                  <i
                    className="bx bx-check-circle"
                    style={{ fontSize: "4rem", color: "#28a745" }}
                  ></i>
                  <h3 className="mt-3 text-success">Hesabınız Onaylandı!</h3>
                  <p className="text-muted mb-4">
                    E-posta adresiniz başarıyla onaylandı!
                  </p>
                  <div className="alert alert-primary mb-5">
                    <i className="bx bx-time me-2"></i>
                    {countdown} saniye sonra anasayfaya yönlendirileceksiniz...
                  </div>
                  <button
                    className="btn btn-success mb-3"
                    onClick={() => router.push("/")}
                  >
                    Şimdi Anasayfaya Git
                  </button>
                </>
              )}

              {confirmationStatus === "error" && (
                <>
                  <i
                    className="bx bx-error-circle"
                    style={{ fontSize: "4rem", color: "#dc3545" }}
                  ></i>
                  <h3 className="mt-3 text-danger">Onaylama Başarısız</h3>
                  <p className="text-muted mb-4">
                    E-posta onayı sırasında bir hata oluştu.
                    <br />
                    Link kullanılmış, geçersiz veya süresi dolmuş olabilir.
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary mr-3"
                      onClick={() => router.push("/")}
                    >
                      Anasayfaya Dön
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.reload()}
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmedEmailPage;
