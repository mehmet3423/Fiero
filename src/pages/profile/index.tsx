import Link from "next/link";
import { useEffect, useState } from "react";
import { withProfileLayout } from "./_layout";
import { useUpdateUserProfile } from "@/hooks/services/user-profile/useUpdateUserProfile";
import { useAuth } from "@/hooks/context/useAuth";
import { useLanguage } from "@/context/LanguageContext"; // Import useLanguage

function ProfilePage() {
  const { userProfile } = useAuth();
  const { updateProfile, isPending } = useUpdateUserProfile();
  const { t } = useLanguage(); // Initialize useLanguage

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    smsNotification: false,
    emailNotification: false,
  });

  useEffect(() => {
    if (userProfile) {
      const isCustomer = "cart" in userProfile;

      const rawBirthDate =
        isCustomer && userProfile.applicationUser
          ? (userProfile.applicationUser as any).birthDate
          : "";

      const formatBirthDate = (dateString: string) => {
        if (!dateString) return "";
        return dateString.split("T")[0];
      };

      const birthDateValue = formatBirthDate(rawBirthDate || "");

      setFormData({
        firstName: userProfile.applicationUser?.firstName || "",
        lastName: userProfile.applicationUser?.lastName || "",
        email: userProfile.applicationUser?.email || "",
        phoneNumber: userProfile.applicationUser?.phoneNumber || "",
        gender: isCustomer ? userProfile.gender?.toString() || "" : "",
        birthDate: birthDateValue,
        smsNotification: "smsNotification" in userProfile ? (userProfile as any).smsNotification || false : false,
        emailNotification: "emailNotification" in userProfile ? (userProfile as any).emailNotification || false : false,
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (userProfile) {
      const isCustomer = "cart" in userProfile;

      const formatBirthDate = (dateString: string) => {
        if (!dateString) return "";
        return dateString.split("T")[0];
      };

      setFormData({
        firstName: userProfile.applicationUser?.firstName || "",
        lastName: userProfile.applicationUser?.lastName || "",
        email: userProfile.applicationUser?.email || "",
        phoneNumber: userProfile.applicationUser?.phoneNumber || "",
        gender: isCustomer ? userProfile.gender?.toString() || "" : "",
        birthDate: formatBirthDate(
          isCustomer && userProfile.applicationUser
            ? (userProfile.applicationUser as any).birthDate || ""
            : ""
        ),
        smsNotification: "smsNotification" in userProfile ? (userProfile as any).smsNotification || false : false,
        emailNotification: "emailNotification" in userProfile ? (userProfile as any).emailNotification || false : false,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        ...formData,
        id: userProfile?.id,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!userProfile) return <>{t("profile.noProfileInfo")}</>;

  return (
    <div className="row">
      {/* Profil Bilgileri */}
      <div className="col-lg-8">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title border-bottom pb-3">{t("profile.myProfileInfo")}</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("profile.firstName")}</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("profile.lastName")}</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("profile.email")}</label>
                <input
                  type="email"
                  className="form-control shadow-none"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("profile.phone")}</label>
                <input
                  type="tel"
                  className="form-control shadow-none"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("profile.birthDate")}</label>
                <input
                  type="date"
                  className="form-control shadow-none"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("profile.gender")}</label>
                <select
                  className="form-select shadow-none"
                  name="gender"
                  value={formData.gender}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }));
                  }}
                >
                  <option value="0">{t("profile.male")}</option>
                  <option value="1">{t("profile.female")}</option>
                </select>
              </div>
            </div>
            <div className="d-flex gap-3 pt-3 border-top">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={handleEdit}
                >
                  {t("profile.updateInfo")}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleSave}
                    disabled={isPending}
                  >
                    {isPending ? t("profile.saving") : t("profile.save")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCancel}
                  >
                    {t("profile.cancel")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bildirim Tercihleri */}
      <div className="col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title border-bottom pb-3">{t("profile.notificationPreferences")}</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-start p-3 border rounded bg-light">
                <label htmlFor="smsNotification" className="form-check-label">
                  <h6 className="mb-1">{t("profile.smsNotifications")}</h6>
                  <p className="mb-0 text-muted small">
                    {t("profile.smsDescription")}
                  </p>
                </label>
                <input
                  id="smsNotification"
                  type="checkbox"
                  className="form-check-input"
                  name="smsNotification"
                  checked={formData.smsNotification}
                  onChange={handleInputChange}
                />
              </div>
              <div className="d-flex justify-content-between align-items-start p-3 border rounded bg-light">
                <label htmlFor="emailNotification" className="form-check-label">
                  <h6 className="mb-1">{t("profile.emailNotifications")}</h6>
                  <p className="mb-0 text-muted small">
                    {t("profile.emailDescription")}
                  </p>
                </label>
                <input
                  id="emailNotification"
                  type="checkbox"
                  className="form-check-input"
                  name="emailNotification"
                  checked={formData.emailNotification}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withProfileLayout(ProfilePage);