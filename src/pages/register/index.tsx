import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";
import { useRegister } from "@/hooks/services/useRegister";
import { useAuth } from "@/hooks/context/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import { UserRole } from "@/constants/enums/UserRole";
import type { Register } from "@/constants/models/Register";

// Gerekirse enum ve yardımcı fonksiyonları ekleyebilirsin
const isPasswordValid = (password: string) => password.length >= 6;
const getPasswordValidationMessage = () => "Şifre en az 6 karakter olmalı.";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { handleRegister, isPending } = useRegister();
  const { handleGoogleLogin } = useAuth();
  const [formData, setFormData] = useState({
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
      fullAddress: "",
    },
    emailNotification: false,
    smsNotification: false,
    termsAccepted: false,
    remember: false,
  });

  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Telefon numarası değiştiğinde çağrılacak fonksiyon
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 10) {
      setFormData((prev) => ({ ...prev, phoneNumber }));
    }
  };

  // Telefon numarasının görüntülenecek formatı
  const getFormattedPhoneNumber = () => {
    const { phoneNumber } = formData;
    if (!phoneNumber) return "";
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

  // Şifre göster/gizle state'leri
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // Form validasyonu
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

    return (
      baseValidation &&
      formData.companyName.trim() !== "" &&
      formData.companyAddress.country !== 0 &&
      formData.companyAddress.state !== 0 &&
      formData.companyAddress.city !== 0 &&
      formData.companyAddress.fullAddress !== ""
    );
  }, [formData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(formData.password)) {
      toast.error(getPasswordValidationMessage());
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t("register.errors.passwordMismatch"));
      return;
    }
    if (!formData.termsAccepted) {
      setTermsError(true);
      toast.error(t("register.errors.termsRequired"));
      return;
    }
    // Satıcı alanlarını kontrol et
    if (formData.isSeller) {
      if (!formData.companyName.trim()) {
        toast.error(t("register.errors.companyName"));
        return;
      }
      if (!formData.companyAddress.country) {
        toast.error(t("register.errors.country"));
        return;
      }
      if (!formData.companyAddress.state) {
        toast.error(t("register.errors.state"));
        return;
      }
      if (!formData.companyAddress.city) {
        toast.error(t("register.errors.city"));
        return;
      }
      if (!formData.companyAddress.fullAddress) {
        toast.error(t("register.errors.address"));
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
      IsSMSNotificationEnabled: formData.smsNotification,
      IsEmailNotificationEnabled: formData.emailNotification,
      ...(formData.isSeller && {
        companyName: formData.companyName,
        companyAddress: {
          country: formData.companyAddress.country,
          state: formData.companyAddress.state,
          city: formData.companyAddress.city,
          fullAddress: typeof formData.companyAddress.fullAddress === "string" 
            ? (formData.companyAddress.fullAddress === "" ? 0 : parseInt(formData.companyAddress.fullAddress) || 0)
            : formData.companyAddress.fullAddress,
        },
      }),
    };

    await handleRegister(
      registerData,
      formData.isSeller ? UserRole.SELLER : UserRole.CUSTOMER,
      () => {
        // Success callback - redirect or show success message
      }
    );
  };

  return (
    <>
      {/* page-title */}
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">{t("register.title")}</div>
        </div>
      </div>
      {/* /page-title */}

      <section className="flat-spacing-10">
        <div className="container">
          <div className="form-register-wrap">
            <div className="flat-title align-items-start gap-0 mb_30 px-0">
              <h5 className="mb_18">{t("register.title")}</h5>
              <p className="text_black-2">{t("register.subtitle")}</p>
            </div>
            <div>
              <form
                className=""
                id="register-form"
                onSubmit={onSubmit}
                accept-charset="utf-8"
              >
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    id="property1"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property1"
                  >
                    {t("register.firstName")}
                  </label>
                </div>
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    id="property2"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property2"
                  >
                    {t("register.lastName")}
                  </label>
                </div>
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="email"
                    id="property3"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property3"
                  >
                    {t("register.email")} *
                  </label>
                </div>
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type={showPassword ? "text" : "password"}
                    id="property4"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property4"
                  >
                    {t("register.password")} *
                  </label>
                </div>
                <div className="tf-field style-1 mb_15">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type={showConfirmPassword ? "text" : "password"}
                    id="property5"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property5"
                  >
                    {t("register.confirmPassword")} *
                  </label>
                </div>
                <div className="tf-field style-1 mb_15">
                  <input
                    ref={phoneInputRef}
                    className="tf-field-input tf-input"
                    placeholder="5XX XXX XX XX"
                    type="tel"
                    id="property6"
                    name="phoneNumber"
                    value={getFormattedPhoneNumber()}
                    onChange={handlePhoneChange}
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property6"
                  >
                    {t("register.phone")} *
                  </label>
                </div>
                <div className="tf-field style-1 mb_30">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="date"
                    id="property8"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    required
                  />
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property8"
                  >
                    {t("register.birthDate")} *
                  </label>
                </div>
                <div className="tf-field style-1 mb_15">
                  <select
                    className="tf-field-input tf-input"
                    id="property7"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: Number(e.target.value),
                      }))
                    }
                    required
                  >
                    <option value={1}>{t("register.genderMale")}</option>
                    <option value={0}>{t("register.genderFemale")}</option>
                  </select>
                  <label
                    className="tf-field-label fw-4 text_black-2"
                    htmlFor="property7"
                  >
                    {t("register.gender")} *
                  </label>
                </div>

                <div className="mb_15">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.emailNotification}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          emailNotification: e.target.checked,
                        }))
                      }
                    />{" "}
                    {t("register.newsletter")}
                  </label>
                </div>
                <div className="mb_15">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.smsNotification}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          smsNotification: e.target.checked,
                        }))
                      }
                    />{" "}
                    {t("register.smsNotification")}
                  </label>
                </div>
                <div className="mb_15">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          termsAccepted: e.target.checked,
                        }));
                        setTermsError(false);
                      }}
                      required
                    />{" "}
                    {t("register.termsAndConditions")}
                  </label>
                  {termsError && (
                    <div className="error-message">
                      {t("register.termsError")}
                    </div>
                  )}
                </div>
                <div className="mb_20">
                  <button
                    type="submit"
                    className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                    disabled={isPending}
                  >
                    {isPending ? t("register.registering") || "Kaydediliyor..." : t("register.registerButton")}
                  </button>
                </div>

                <div className="mt-3 mb_20 text-center">
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
                        text="signup_with"
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
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t("register.registerWithGoogle")}
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/login" className="tf-btn btn-line">
                    {t("register.alreadyHaveAccount")}
                    <i className="icon icon-arrow1-top-left"></i>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
