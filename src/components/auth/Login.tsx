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

  const { handleLogin, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleLogin(formData, onSuccess);
    window.location.reload();
  };

  return (
    <div
      className="tab-pane fade show active"
      id="signin"
      role="tabpanel"
      aria-labelledby="signin-tab"
    >
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="singin-email">Email Adresi *</label>
          <input
            type="email"
            className="form-control"
            id="singin-email"
            name="singin-email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="singin-password">Şifre *</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="singin-password"
              name="singin-password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
            <i
              className={`bx ${showPassword ? "bx-hide" : "bx-show"
                } position-absolute`}
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "2rem",
                color: "#777",
              }}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-outline-primary-2 w-100 "
          disabled={isPending}
        >
          <span>Giriş Yap</span>
          <i className="icon-long-arrow-right"></i>
        </button>
      </form>
      {/* <div className="form-choice">
                <p className="text-center">or sign in with</p>
                <div className="row">
                    <div className="col-sm-6">
                        <Link href="#" className="btn btn-login btn-g">
                            <i className="icon-google"></i>
                            Login With Google
                        </Link>
                    </div>
                    <div className="col-sm-6">
                        <Link href="#" className="btn btn-login btn-f">
                            <i className="icon-facebook-f"></i>
                            Login With Facebook
                        </Link>
                    </div>
                </div>
            </div> */}
    </div>
  );
}
