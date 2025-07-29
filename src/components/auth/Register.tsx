import { UserRole } from "@/constants/enums/UserRole";
import type { Register } from "@/constants/models/Register";
import {
  getPasswordValidationMessage,
  isPasswordValid,
} from "@/helpers/passwordUtils";
import { useRegister } from "@/hooks/services/useRegister";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface RegisterFormData extends Omit<Register, "companyAddress"> {
  confirmPassword: string;
  policy: boolean;
  emailNotification: boolean;
  smsNotification: boolean;
  termsAccepted: boolean;
  remember: boolean;
  companyAddress?: {
    country: number;
    state: number;
    city: number;
    fullAddress: number;
  };
}

interface RegisterProps {
  onSuccess?: () => void;
}

export default function Register({ onSuccess }: RegisterProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    birthDate: "",
    gender: 1,
    policy: false,
    isSeller: false,
    companyName: "",
    companyAddress: {
      country: 0,
      state: 0,
      city: 0,
      fullAddress: 0,
    },
    emailNotification: false,
    smsNotification: false,
    termsAccepted: false,
    remember: false,
  });

  // Telefon input referansı
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Telefon numarası değiştiğinde çağrılacak fonksiyon
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Sadece rakamları al
    const phoneNumber = value.replace(/\D/g, "");

    // Maksimum 11 rakam (Türkiye telefon numarası formatı)
    if (phoneNumber.length <= 10) {
      setFormData((prev) => ({ ...prev, phoneNumber: phoneNumber }));
    }
  };

  // Telefon numarasının görüntülenecek formatı
  const getFormattedPhoneNumber = () => {
    const { phoneNumber } = formData;

    if (!phoneNumber) return "";

    // Baştaki 0'ı kaldır
    let cleanedPhoneNumber = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;

    let formatted = "";

    if (cleanedPhoneNumber.length > 0) {
      formatted += cleanedPhoneNumber.substring(
        0,
        Math.min(3, cleanedPhoneNumber.length)
      );
    }

    if (cleanedPhoneNumber.length > 3) {
      formatted +=
        " " +
        cleanedPhoneNumber.substring(3, Math.min(6, cleanedPhoneNumber.length));
    }

    if (cleanedPhoneNumber.length > 6) {
      formatted +=
        " " +
        cleanedPhoneNumber.substring(6, Math.min(8, cleanedPhoneNumber.length));
    }

    if (cleanedPhoneNumber.length > 8) {
      formatted +=
        " " +
        cleanedPhoneNumber.substring(
          8,
          Math.min(10, cleanedPhoneNumber.length)
        );
    }

    return formatted.trim();
  };

  const { handleRegister, isPending } = useRegister();

  // Şifre göster/gizle state'leri
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Şifre göster/gizle toggle fonksiyonları
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const [termsError, setTermsError] = useState(false);

  // Form validasyonu için computed value
  const isFormValid = useMemo(() => {
    const baseValidation =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.policy &&
      formData.password === formData.confirmPassword &&
      isPasswordValid(formData.password);

    if (!formData.isSeller) return baseValidation;

    // Eğer satıcıysa ek alanların validasyonu
    return (
      baseValidation &&
      formData.companyName?.trim() !== "" &&
      formData.companyAddress?.country !== 0 &&
      formData.companyAddress?.state !== 0 &&
      formData.companyAddress?.city !== 0 &&
      formData.companyAddress?.fullAddress !== 0
    );
  }, [formData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(formData.password)) {
      toast.error(getPasswordValidationMessage());
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }

    if (!formData.termsAccepted) {
      setTermsError(true);
      toast.error("Üyelik koşullarını kabul etmelisiniz");
      return;
    }

    // if (!formData.policy) {
    //     toast.error('Lütfen gizlilik politikasını kabul edin');
    //     return;
    // }

    // Satıcı alanlarını kontrol et
    if (formData.isSeller) {
      if (!formData.companyName?.trim()) {
        toast.error("Lütfen şirket adını girin");
        return;
      }
      if (!formData.companyAddress?.country) {
        toast.error("Lütfen ülke bilgisini girin");
        return;
      }
      if (!formData.companyAddress?.state) {
        toast.error("Lütfen bölge bilgisini girin");
        return;
      }
      if (!formData.companyAddress?.city) {
        toast.error("Lütfen şehir bilgisini girin");
        return;
      }
      if (!formData.companyAddress?.fullAddress) {
        toast.error("Lütfen açık adres bilgisini girin");
        return;
      }
    }

    const registerData: Register = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      birthDate: formData.birthDate,
      gender: formData.gender,
      ...(formData.isSeller && {
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
      }),
    };

    await handleRegister(
      registerData,
      formData.isSeller ? UserRole.SELLER : UserRole.CUSTOMER,
      onSuccess
    );
  };

  return (
    <div
      className="tab-pane fade"
      id="register"
      role="tabpanel"
      aria-labelledby="register-tab"
    >
      <form onSubmit={onSubmit}>
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label>Ad *</label>
              <input
                type="text"
                className="form-control"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label>Soyad *</label>
              <input
                type="text"
                className="form-control"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>E-posta *</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Şifre *</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
            <i
              className={`bx ${
                showPassword ? "bx-hide" : "bx-show"
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

        <div className="form-group">
          <label>Şifre Tekrar *</label>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
            <i
              className={`bx ${
                showConfirmPassword ? "bx-hide" : "bx-show"
              } position-absolute`}
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "2rem",
                color: "#777",
              }}
              onClick={toggleConfirmPasswordVisibility}
            ></i>
          </div>
        </div>

        <div className="form-group">
          <label>Telefon *</label>
          <div className="position-relative">
            <input
              ref={phoneInputRef}
              type="tel"
              className="form-control"
              value={getFormattedPhoneNumber()}
              onChange={handlePhoneChange}
              placeholder="5XX XXX XX XX"
              required
              onKeyDown={(e) => {
                // Backspace tuşuna basıldığında ve input boş değilse
                if (e.key === "Backspace" && formData.phoneNumber.length > 0) {
                  // Varsayılan davranışı engelle
                  e.preventDefault();

                  // Son karakteri sil
                  const newPhoneNumber = formData.phoneNumber.slice(0, -1);
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: newPhoneNumber,
                  }));
                }
              }}
            />
            <i
              className="bx bx-phone position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                fontSize: "1.2rem",
                color: "#777",
              }}
            ></i>
          </div>
        </div>

        <div className="form-group">
          <label>Cinsiyet *</label>
          <select
            className="form-control"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gender: Number(e.target.value),
              }))
            }
            required
          >
            <option value={0}>Kadın</option>
            <option value={1}>Erkek</option>
          </select>
        </div>

        <div className="form-group">
          <label>Doğum Tarihi *</label>
          <input
            type="date"
            className="form-control"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                birthDate: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="form-footer">
          <div className="custom-control custom-checkbox ">
            <input
              type="checkbox"
              className="custom-control-input"
              id="email-notification"
              checked={formData.emailNotification}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emailNotification: e.target.checked,
                }))
              }
            />
            <label
              className="custom-control-label ms-2"
              htmlFor="email-notification"
            >
              Kampanya, duyuru, bilgilendirmelerden e-posta ile haberdar olmak
              istiyorum.
            </label>
          </div>

          <div className="custom-control custom-checkbox ">
            <input
              type="checkbox"
              className="custom-control-input"
              id="sms-notification"
              checked={formData.smsNotification}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  smsNotification: e.target.checked,
                }))
              }
            />
            <label
              className="custom-control-label ms-2"
              htmlFor="sms-notification"
            >
              Kampanya, duyuru, bilgilendirmelerden SMS ile haberdar olmak
              istiyorum.
            </label>
          </div>

          <div className="custom-control custom-checkbox ">
            <input
              type="checkbox"
              className={`custom-control-input ${
                termsError ? "is-invalid" : ""
              }`}
              id="terms-accept"
              checked={formData.termsAccepted}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  termsAccepted: e.target.checked,
                }));
                setTermsError(false);
              }}
              required
            />
            <label className="custom-control-label ms-2" htmlFor="terms-accept">
              <Link href="/terms" target="_blank" className="text-primary">
                Üyelik koşullarını ve kişisel verilerimin korunmasını
              </Link>{" "}
              kabul ediyorum.
            </label>
            {termsError && (
              <div className="invalid-feedback">
                Üyelik koşullarını kabul etmelisiniz
              </div>
            )}
          </div>

          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="signin-remember"
              checked={formData.remember}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, remember: e.target.checked }))
              }
            />
            {/* <label className="custom-control-label" htmlFor="signin-remember">Remember Me</label> */}
          </div>

          {/* <Link href="#" className="forgot-link">
            Forgot Your Password?
          </Link> */}
        </div>

        {/* <div className="form-group">
          <div className={styles.sellerSwitch}>
            <input
              type="checkbox"
              id="sellerSwitch"
              className={styles.sellerSwitchInput}
              checked={formData.isSeller}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isSeller: e.target.checked }))
              }
            />
            <label className={styles.sellerSwitchLabel} htmlFor="sellerSwitch">
              <span
                className={`${styles.sellerSwitchInner} ${
                  formData.isSeller ? styles.active : styles.inactive
                }`}
              ></span>
              <span className={styles.sellerSwitchSwitch}></span>
            </label>
            <span className={styles.sellerSwitchText}>
              Satıcı olarak kaydol
            </span>
          </div>
        </div> */}

        {formData.isSeller && (
          <div className="seller-fields">
            <div className="form-group">
              <label>Şirket Adı *</label>
              <input
                type="text"
                className="form-control"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Ülke *</label>
              <input
                type="number"
                className="form-control"
                value={formData.companyAddress?.country}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyAddress: {
                      ...prev.companyAddress!,
                      country: parseInt(e.target.value),
                    },
                  }))
                }
                required
              />
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Eyalet/Bölge *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.companyAddress?.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        companyAddress: {
                          ...prev.companyAddress!,
                          state: parseInt(e.target.value),
                        },
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Şehir *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.companyAddress?.city}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        companyAddress: {
                          ...prev.companyAddress!,
                          city: parseInt(e.target.value),
                        },
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Açık Adres *</label>
              <input
                type="number"
                className="form-control"
                value={formData.companyAddress?.fullAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyAddress: {
                      ...prev.companyAddress!,
                      fullAddress: parseInt(e.target.value),
                    },
                  }))
                }
                required
              />
            </div>
          </div>
        )}

        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-outline-primary-2"
            disabled={isPending}
          >
            <span>{isPending ? "Kaydediliyor..." : "KAYIT OL"}</span>
            <i className="icon-long-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
