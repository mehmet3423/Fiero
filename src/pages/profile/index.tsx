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
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ 
            marginBottom: "24px", 
            fontSize: "20px", 
            fontWeight: "600",
            color: "#333",
            borderBottom: "1px solid #eee",
            paddingBottom: "12px"
          }}>
            Profil Bilgilerim
          </h3>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500",
                color: "#555"
              }}>
                Ad
              </label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: !isEditing ? "#f8f9fa" : "#fff",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500",
                color: "#555"
              }}>
                Soyad
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: !isEditing ? "#f8f9fa" : "#fff",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500",
                color: "#555"
              }}>
                E-posta
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: !isEditing ? "#f8f9fa" : "#fff",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500",
                color: "#555"
              }}>
                Telefon
              </label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: !isEditing ? "#f8f9fa" : "#fff",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500",
                color: "#555"
              }}>
                Doğum Tarihi
              </label>
              <input
                type="date"
                className="form-control"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: !isEditing ? "#f8f9fa" : "#fff",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500",
                color: "#555"
              }}>
                Cinsiyet
              </label>
              <select
                className="form-control"
                name="gender"
                value={formData.gender}
                disabled={!isEditing}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }));
                }}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: !isEditing ? "#f8f9fa" : "#fff",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.outline = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              >
                <option value="0">Erkek</option>
                <option value="1">Kadın</option>
              </select>
            </div>
          </div>
          
          <div style={{ 
            marginTop: "24px", 
            paddingTop: "20px",
            borderTop: "1px solid #eee",
            display: "flex", 
            gap: "12px" 
          }}>
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  padding: "12px 24px",
                  border: "1px solid #000",
                  borderRadius: "4px",
                  backgroundColor: "#000",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#333";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#000";
                }}
              >
                Bilgilerimi Güncelle
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #000",
                    borderRadius: "4px",
                    backgroundColor: "#000",
                    color: "#fff",
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.6 : 1,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {isPending ? "Kaydediliyor..." : "Kaydet"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "#f8f9fa",
                    color: "#666",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  İptal
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bildirim Tercihleri */}
      <div className="col-lg-4">
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "24px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h5 style={{ 
            marginBottom: "20px", 
            fontSize: "18px", 
            fontWeight: "600",
            color: "#333",
            borderBottom: "1px solid #eee",
            paddingBottom: "12px"
          }}>
            Bildirim Tercihleri
          </h5>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              padding: "16px",
              border: "1px solid #eee",
              borderRadius: "6px",
              backgroundColor: "#f8f9fa"
            }}>
              <label
                htmlFor="smsNotification"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                <h6 style={{ 
                  margin: "0 0 4px 0", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  SMS Bildirimleri
                </h6>
                <p style={{ 
                  margin: 0, 
                  fontSize: "12px", 
                  color: "#666",
                  lineHeight: "1.4"
                }}>
                  Kampanya ve fırsatlardan SMS ile haberdar olun
                </p>
              </label>
              <input
                id="smsNotification"
                type="checkbox"
                name="smsNotification"
                checked={formData.smsNotification}
                onChange={handleInputChange}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  marginLeft: "12px",
                }}
              />
            </div>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              padding: "16px",
              border: "1px solid #eee",
              borderRadius: "6px",
              backgroundColor: "#f8f9fa"
            }}>
              <label
                htmlFor="emailNotification"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                <h6 style={{ 
                  margin: "0 0 4px 0", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  E-posta Bildirimleri
                </h6>
                <p style={{ 
                  margin: 0, 
                  fontSize: "12px", 
                  color: "#666",
                  lineHeight: "1.4"
                }}>
                  Özel tekliflerden e-posta ile haberdar olun
                </p>
              </label>
              <input
                id="emailNotification"
                type="checkbox"
                name="emailNotification"
                checked={formData.emailNotification}
                onChange={handleInputChange}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  marginLeft: "12px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withProfileLayout(ProfilePage);