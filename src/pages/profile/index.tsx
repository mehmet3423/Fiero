import Link from "next/link";
import { useEffect, useState } from "react";
import { withProfileLayout } from "./_layout";
import { useUpdateUserProfile } from "@/hooks/services/user-profile/useUpdateUserProfile";
import { useAuth } from "@/hooks/context/useAuth";

function ProfilePage() {
  const { userProfile } = useAuth();
  const { updateProfile, isPending } = useUpdateUserProfile();

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

  if (!userProfile) return <>Profil bilgileri bulunmamaktadır</>;

  return (
    <div className="row">
      {/* Profil Bilgileri */}
      <div className="col-lg-8">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title border-bottom pb-3">Profil Bilgilerim</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Ad</label>
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
                <label className="form-label">Soyad</label>
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
                <label className="form-label">E-posta</label>
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
                <label className="form-label">Telefon</label>
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
                <label className="form-label">Doğum Tarihi</label>
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
                <label className="form-label">Cinsiyet</label>
                <select
                  className="form-select shadow-none"
                  name="gender"
                  value={formData.gender}
                  disabled={!isEditing}
                  style={{ 
                    outline: 'none',
                    boxShadow: 'none',
                    border: '1px solid #ced4da'
                  }}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }));
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#ced4da';
                  }}
                >
                  <option value="0">Erkek</option>
                  <option value="1">Kadın</option>
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
                  Bilgilerimi Güncelle
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleSave}
                    disabled={isPending}
                  >
                    {isPending ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleCancel}
                  >
                    İptal
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
            <h5 className="card-title border-bottom pb-3">Bildirim Tercihleri</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-start p-3 border rounded bg-light">
                <label htmlFor="smsNotification" className="form-check-label">
                  <h6 className="mb-1">SMS Bildirimleri</h6>
                  <p className="mb-0 text-muted small">
                    Kampanya ve fırsatlardan SMS ile haberdar olun
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
                  <h6 className="mb-1">E-posta Bildirimleri</h6>
                  <p className="mb-0 text-muted small">
                    Özel tekliflerden e-posta ile haberdar olun
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