import { useLogin } from "@/hooks/services/useLogin";
import { useRouter } from "next/router";
import { useState } from "react";

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRecover, setShowRecover] = useState(false);

  const { handleLogin, isPending } = useLogin();

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
          <div className="heading text-center">Giriş Yap</div>
        </div>
      </div>
      {/* /Page Title */}

      <section className="flat-spacing-10">
        <div className="container">
          <div className="tf-grid-layout lg-col-2 tf-login-wrap">
            <div className="tf-login-form">
              {showRecover ? (
                <div id="recover">
                  <h5 className="mb_24">Şifrenizi sıfırlayın</h5>
                  <p className="mb_30">Şifrenizi sıfırlamak için size bir e-posta göndereceğiz</p>
                  <form id="recover-form" onSubmit={onRecoverSubmit} acceptCharset="utf-8">
                    <div className="tf-field style-1 mb_15">
                      <input
                        className="tf-field-input tf-input"
                        placeholder=""
                        type="email"
                        id="recover-email"
                        name="email"
                        required
                      />
                      <label className="tf-field-label fw-4 text_black-2" htmlFor="recover-email">
                        Email *
                      </label>
                    </div>
                    <div className="mb_20">
                      <button
                        type="button"
                        className="tf-btn btn-line"
                        onClick={() => setShowRecover(false)}
                      >
                        İptal Et
                      </button>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                      >
                        Şifreyi Sıfırla
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div id="login">
                  <h5 className="mb_36">Giriş Yap</h5>
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
                          Şifre *
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
                          title={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                        >
                          {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.5C7.31 4.5 3.26 7.38 1.64 11.5c-.11.28-.11.72 0 1c1.62 4.12 5.67 7 10.36 7s8.74-2.88 10.36-7c.11-.28.11-.72 0-1C20.74 7.38 16.69 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                              <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.5C7.31 4.5 3.26 7.38 1.64 11.5c-.11.28-.11.72 0 1c1.62 4.12 5.67 7 10.36 7s8.74-2.88 10.36-7c.11-.28.11-.72 0-1C20.74 7.38 16.69 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mb_20">
                      <button
                        type="button"
                        className="tf-btn btn-line"
                        onClick={() => setShowRecover(true)}
                      >
                        Şifrenizi mi unuttunuz?
                      </button>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                        disabled={isPending}
                      >
                        Giriş Yap
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="tf-login-content">
              <h5 className="mb_36">Burada yeniyim</h5>
              <p className="mb_20">
                Kampanyalar, yeni ürünler, trendler ve promosyonlar için kaydolun. Abonelikten çıkmak için e-postalarımızdaki abonelikten çıkma bağlantısını tıklayın.
              </p>
              <a href="/register" className="tf-btn btn-line">
                Kayıt Ol<i className="icon icon-arrow1-top-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}