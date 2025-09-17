import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    </div>
  ),
});

interface NotificationSettingsProps {
  value: NotificationSettingsType;
  onChange: (value: NotificationSettingsType) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (
    field: keyof NotificationSettingsType,
    newValue: any
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="notification-settings">
      <h5 className="mb-3">Bildirim Ayarları</h5>

      {/* Email Notification Settings */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="isEmailNotificationEnabled"
              checked={value.isEmailNotificationEnabled}
              onChange={(e) =>
                handleChange("isEmailNotificationEnabled", e.target.checked)
              }
              style={{ fontSize: "1.4rem" }}
            />
            <label
              className="form-check-label"
              htmlFor="isEmailNotificationEnabled"
              style={{ fontSize: "1rem" }}
            >
              Email Bildirimleri
            </label>
          </div>
        </div>

        {value.isEmailNotificationEnabled && (
          <div className="card-body">
            <div className="row">
              <div className="col-12 mb-3">
                <label className="form-label">Email Konu Başlığı</label>
                <input
                  type="text"
                  className="form-control"
                  value={value.emailNotificationSubject}
                  onChange={(e) =>
                    handleChange("emailNotificationSubject", e.target.value)
                  }
                  placeholder="Email konu başlığını girin"
                />
              </div>

              <div
                className="col-12"
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "inherit",
                  color: "#566A7F",
                }}
              >
                <RichTextEditor
                  value={value.emailNotificationHtmlBody}
                  onChange={(html) =>
                    handleChange("emailNotificationHtmlBody", html)
                  }
                  label="Email HTML İçeriği"
                  placeholder="Email HTML içeriğini girin..."
                  required={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SMS Notification Settings */}
      <div className="card">
        <div className="card-header">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="isSMSNotificationEnabled"
              checked={value.isSMSNotificationEnabled}
              onChange={(e) =>
                handleChange("isSMSNotificationEnabled", e.target.checked)
              }
              style={{ fontSize: "1.4rem" }}
            />
            <label
              className="form-check-label"
              htmlFor="isSMSNotificationEnabled"
              style={{ fontSize: "1rem" }}
            >
              SMS Bildirimleri
            </label>
          </div>
        </div>

        {value.isSMSNotificationEnabled && (
          <div className="card-body">
            <div className="row">
              <div className="col-12 mb-3">
                <label className="form-label">SMS Konu Başlığı</label>
                <input
                  type="text"
                  className="form-control"
                  value={value.smsNotificationSubject}
                  onChange={(e) =>
                    handleChange("smsNotificationSubject", e.target.value)
                  }
                  placeholder="SMS konu başlığını girin"
                />
              </div>

              <div className="col-12">
                <RichTextEditor
                  value={value.smsNotificationHtmlBody}
                  onChange={(html) =>
                    handleChange("smsNotificationHtmlBody", html)
                  }
                  label="SMS HTML İçeriği"
                  placeholder="SMS HTML içeriğini girin..."
                  required={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
