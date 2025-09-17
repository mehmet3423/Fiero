import { useAuth } from "@/hooks/context/useAuth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";

function AdminLoginPage() {
  const router = useRouter();
  const {
    handleLogin,
    loginLoading,
    userProfile,
    userProfileLoading,
    refetchUserProfile,
  } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // If user is already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (userProfile && isAdmin && !userProfileLoading) {
      router.replace("/admin");
    }
  }, [userProfile, isAdmin, userProfileLoading, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(formData);
      // Login başarılı olduktan sonra user profile otomatik güncellenecek
      // useEffect zaten userProfile ve isAdmin değiştiğinde yönlendirme yapacak
    } catch (error) {
      toast.error("Giriş yapılırken bir hata oluştu");
    }
  };

  return (
    <main className="main">
      <div className="login-page bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-8">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <div className="mb-4 text-center">
                    <h4 className="mb-2">Hoş Geldiniz! 👋</h4>
                    <p className="text-muted">
                      Lütfen admin hesabınıza giriş yapın
                    </p>
                  </div>

                  <form onSubmit={onSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        E-posta
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Şifre
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          required
                          style={{ paddingRight: "45px" }}
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                          style={{
                            border: "none",
                            background: "none",
                            padding: "0 10px",
                            color: "#6c757d",
                            textDecoration: "none",
                            zIndex: 10,
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <i className="fas fa-eye-slash small"></i>
                          ) : (
                            <i className="fas fa-eye small"></i>
                          )}
                        </button>
                      </div>
                    </div>

                    <div
                      className="mb-3 form-check"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                        checked={formData.remember}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            remember: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="remember">
                        Beni Hatırla
                      </label>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loginLoading}
                      >
                        {loginLoading ? (
                          <span>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Giriş Yapılıyor...
                          </span>
                        ) : (
                          "Giriş Yap"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 40px 0;
        }

        .card {
          border: none;
          border-radius: 10px;
        }

        .form-control {
          border-radius: 5px;
          padding: 12px;
        }

        .btn-primary {
          padding: 12px;
          font-weight: 500;
          border-radius: 5px;
        }
      `}</style>
    </main>
  );
}

export default AdminLoginPage;
