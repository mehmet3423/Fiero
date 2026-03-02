import { useLogin } from "@/hooks/services/useLogin";
import { useRouter } from "next/router";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/context/useAuth";
import { GoogleLogin } from "@react-oauth/google";

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRecover, setShowRecover] = useState(false);

  const { handleLogin, isPending } = useLogin();
  const { handleGoogleLogin, googleLoginLoading } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleLogin(formData, onSuccess);
      // Login başarılı ise home sayfasına yönlendir
      router.push('/');
    } catch (error) {
      // Hata durumunda login sayfasında kal
      console.error('Login failed:', error);
    }
  };

  // Şifre sıfırlama formu için dummy handler
  const onRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Buraya şifre sıfırlama işlemi eklenebilir
    setShowRecover(false);
  };

  return (
    <>
      {/* Page Title */}
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">{t("login.title")}</div>
        </div>
      </div>
      {/* /Page Title */}

      <section className="flat-spacing-10">
        <div className="container">
          <div className="tf-grid-layout lg-col-2 tf-login-wrap">
            <div className="tf-login-form">

              <div id="login">
                <h5 className="mb_36">{t("loginPage.title")}</h5>
                <form id="login-form" onSubmit={onSubmit} acceptCharset="utf-8">
                  <div className="tf-field style-1 mb_15">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=""
                      type="email"
                      id="property3"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property3">
                      Email *
                    </label>
                  </div>
                  <div className="tf-field style-1 mb_30">
                    <div style={{ position: "relative" }}>
                      <input
                        className="tf-field-input tf-input"
                        placeholder=""
                        type={showPassword ? "text" : "password"}
                        id="property4"
                        name="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                      />
                      <label className="tf-field-label fw-4 text_black-2" htmlFor="property4">
                        {t("loginPage.passwordLabel")}
                      </label>
                      <button
                        type="button"
                        className="btn-show-pass"
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "15px",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "18px",
                          color: "#777",
                          padding: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onClick={togglePasswordVisibility}
                        title={showPassword ? t("loginPage.hidePassword") : t("loginPage.showPassword")}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7.31 4.5 3.26 7.38 1.64 11.5c-.11.28-.11.72 0 1c1.62 4.12 5.67 7 10.36 7s8.74-2.88 10.36-7c.11-.28.11-.72 0-1C20.74 7.38 16.69 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7.31 4.5 3.26 7.38 1.64 11.5c-.11.28-.11.72 0 1c1.62 4.12 5.67 7 10.36 7s8.74-2.88 10.36-7c.11-.28.11-.72 0-1C20.74 7.38 16.69 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb_20">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ marginTop: "7px", cursor: "pointer" }}
                        id="remember"
                        checked={formData.remember}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, remember: e.target.checked }))
                        }
                      />
                      <label
                        className="form-check-label ml-2"
                        htmlFor="remember"
                        style={{ cursor: "pointer" }}
                      >
                        {t("login.rememberMe")}
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                      disabled={isPending}
                    >
                      {t("loginPage.loginButton")}
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <div className="mb-2" style={{ fontSize: "14px", color: "#666" }}>
                      {t("login.or")}
                    </div>
                    <div className="d-flex justify-content-center">
                      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                        <GoogleLogin
                          onSuccess={(credentialResponse) => {
                            if (credentialResponse?.credential) {
                              handleGoogleLogin(credentialResponse.credential, () => {
                                router.push("/");
                              });
                            }
                          }}
                          onError={() => {}}
                          theme="filled_black"
                          size="large"
                          text="signin_with"
                          shape="rectangular"
                          width={320}
                        />
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="tf-btn radius-3 btn-fill"
                          style={{
                            opacity: 0.6,
                            cursor: "not-allowed",
                            padding: "10px 24px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          {t("login.loginWithGoogle")}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

            </div>
            <div className="tf-login-content">
              <h5 className="mb_36">{t("loginPage.newHereTitle")}</h5>
              <p className="mb_20">
                {t("loginPage.newHereMessage")}
              </p>
              <a href="/register" className="tf-btn btn-line">
                {t("loginPage.registerButton")}<i className="icon icon-arrow1-top-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}