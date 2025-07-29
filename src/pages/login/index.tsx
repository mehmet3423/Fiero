import { useLogin } from "@/hooks/services/useLogin";
import { useState } from "react";

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
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
    await handleLogin(formData, onSuccess);
    window.location.reload();
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
          <div className="heading text-center">Log in</div>
        </div>
      </div>
      {/* /Page Title */}

      <section className="flat-spacing-10">
        <div className="container">
          <div className="tf-grid-layout lg-col-2 tf-login-wrap">
            <div className="tf-login-form">
              {showRecover ? (
                <div id="recover">
                  <h5 className="mb_24">Reset your password</h5>
                  <p className="mb_30">We will send you an email to reset your password</p>
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
                        Cancel
                      </button>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                      >
                        Reset password
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div id="login">
                  <h5 className="mb_36">Log in</h5>
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
                          Password *
                        </label>
                        <i
                          className={`bx ${showPassword ? "bx-hide" : "bx-show"} position-absolute`}
                          style={{
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontSize: "1.5rem",
                            color: "#777",
                            position: "absolute"
                          }}
                          onClick={togglePasswordVisibility}
                        ></i>
                      </div>
                    </div>
                    <div className="mb_20">
                      <button
                        type="button"
                        className="tf-btn btn-line"
                        onClick={() => setShowRecover(true)}
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                        disabled={isPending}
                      >
                        Log in
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="tf-login-content">
              <h5 className="mb_36">I'm new here</h5>
              <p className="mb_20">
                Sign up for early Sale access plus tailored new arrivals, trends and promotions. To opt out, click unsubscribe in our emails.
              </p>
              <a href="/register" className="tf-btn btn-line">
                Register<i className="icon icon-arrow1-top-left"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}