import Link from "next/link";
import { useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";

// Gerekirse enum ve yardımcı fonksiyonları ekleyebilirsin
const isPasswordValid = (password: string) => password.length >= 6;
const getPasswordValidationMessage = () => "Şifre en az 6 karakter olmalı.";

export default function RegisterPage() {
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
            formatted += cleanedPhoneNumber.substring(0, Math.min(3, cleanedPhoneNumber.length));
        }
        if (cleanedPhoneNumber.length > 3) {
            formatted += " " + cleanedPhoneNumber.substring(3, Math.min(6, cleanedPhoneNumber.length));
        }
        if (cleanedPhoneNumber.length > 6) {
            formatted += " " + cleanedPhoneNumber.substring(6, Math.min(8, cleanedPhoneNumber.length));
        }
        if (cleanedPhoneNumber.length > 8) {
            formatted += " " + cleanedPhoneNumber.substring(8, Math.min(10, cleanedPhoneNumber.length));
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
            toast.error("Şifreler eşleşmiyor!");
            return;
        }
        if (!formData.termsAccepted) {
            setTermsError(true);
            toast.error("Üyelik koşullarını kabul etmelisiniz");
            return;
        }
        // Satıcı alanlarını kontrol et
        if (formData.isSeller) {
            if (!formData.companyName.trim()) {
                toast.error("Lütfen şirket adını girin");
                return;
            }
            if (!formData.companyAddress.country) {
                toast.error("Lütfen ülke bilgisini girin");
                return;
            }
            if (!formData.companyAddress.state) {
                toast.error("Lütfen bölge bilgisini girin");
                return;
            }
            if (!formData.companyAddress.city) {
                toast.error("Lütfen şehir bilgisini girin");
                return;
            }
            if (!formData.companyAddress.fullAddress) {
                toast.error("Lütfen açık adres bilgisini girin");
                return;
            }
        }
        toast.success("Kayıt başarılı!");
        // Burada API'ye gönderme işlemini ekleyebilirsin
    };

    return (
        <>
            {/* page-title */}
            <div className="tf-page-title style-2">
                <div className="container-full">
                    <div className="heading text-center">Register</div>
                </div>
            </div>
            {/* /page-title */}

            <section className="flat-spacing-10">
                <div className="container">
                    <div className="form-register-wrap">
                        <div className="flat-title align-items-start gap-0 mb_30 px-0">
                            <h5 className="mb_18">Register</h5>
                            <p className="text_black-2">
                                Sign up for early Sale access plus tailored new arrivals, trends and promotions. To opt out, click unsubscribe in our emails
                            </p>
                        </div>
                        <div>
                            <form className="" id="register-form" onSubmit={onSubmit} accept-charset="utf-8">
                                <div className="tf-field style-1 mb_15">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type="text"
                                        id="property1"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        required
                                    />
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property1">First name</label>
                                </div>
                                <div className="tf-field style-1 mb_15">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type="text"
                                        id="property2"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        required
                                    />
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property2">Last name</label>
                                </div>
                                <div className="tf-field style-1 mb_15">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type="email"
                                        id="property3"
                                        name="email"
                                        value={formData.email}
                                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property3">Email *</label>
                                </div>
                                <div className="tf-field style-1 mb_15">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type={showPassword ? "text" : "password"}
                                        id="property4"
                                        name="password"
                                        value={formData.password}
                                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        required
                                    />
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property4">Password *</label>

                                </div>
                                <div className="tf-field style-1 mb_15">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="property5"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        required
                                    />
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property5">Confirm Password *</label>

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
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property6">Phone *</label>
                                </div>
                                <div className="tf-field style-1 mb_30">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type="date"
                                        id="property8"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                                        required
                                    />
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property8">Birth Date *</label>
                                </div>
                                <div className="tf-field style-1 mb_15">
                                    <select
                                        className="tf-field-input tf-input"
                                        id="property7"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={e => setFormData(prev => ({ ...prev, gender: Number(e.target.value) }))}
                                        required
                                    >
                                        <option value={1}>Male</option>
                                        <option value={0}>Female</option>
                                    </select>
                                    <label className="tf-field-label fw-4 text_black-2" htmlFor="property7">Gender *</label>
                                </div>
                                
                                <div className="mb_15">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.emailNotification}
                                            onChange={e => setFormData(prev => ({ ...prev, emailNotification: e.target.checked }))}
                                        /> Email notifications
                                    </label>
                                </div>
                                <div className="mb_15">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.smsNotification}
                                            onChange={e => setFormData(prev => ({ ...prev, smsNotification: e.target.checked }))}
                                        /> SMS notifications
                                    </label>
                                </div>
                                <div className="mb_15">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.termsAccepted}
                                            onChange={e => {
                                                setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }));
                                                setTermsError(false);
                                            }}
                                            required
                                        /> I accept the <Link href="/terms" target="_blank">terms and conditions</Link>
                                    </label>
                                    {termsError && (
                                        <div className="error-message">
                                            You must accept the terms and conditions
                                        </div>
                                    )}
                                </div>
                                <div className="mb_20">
                                    <button type="submit" className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center">
                                        Register
                                    </button>
                                </div>
                                <div className="text-center">
                                    <Link href="/login" className="tf-btn btn-line">
                                        Already have an account? Log in here
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