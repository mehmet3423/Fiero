import NotificationSettings from "@/components/shared/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/constants/models/Notification";
import { ReactNode } from "react";
import CampaignActiveToggle from "./CampaignActiveToggle";
import CampaignBackButton from "./CampaignBackButton";
import CampaignBasicFields from "./CampaignBasicFields";
import CampaignBreadcrumb from "./CampaignBreadcrumb";
import CampaignDateRangePicker from "./CampaignDateRangePicker";

interface CampaignFormWrapperProps {
  // Campaign type info
  campaignType: string;
  campaignTypeLabel: string;
  action: "create" | "edit";

  // Form data
  name: string;
  nameEn: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  notificationSettings?: NotificationSettingsType;

  // Handlers
  onNameChange: (value: string) => void;
  onNameEnChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onActiveToggle: (value: boolean) => void;
  onNotificationSettingsChange?: (settings: NotificationSettingsType) => void;
  onSubmit: (e: React.FormEvent) => void;

  // Children - campaign-specific fields
  children: ReactNode;

  // Submit button config
  isSubmitting: boolean;
  submitDisabled?: boolean;
  submitButtonText?: string;
  submitButtonVariant?: "primary" | "warning" | "light";

  // Optional custom name label
  nameLabel?: string;
}

export default function CampaignFormWrapper({
  campaignType,
  campaignTypeLabel,
  action,
  name,
  nameEn,
  description,
  startDate,
  endDate,
  isActive,
  notificationSettings,
  onNameChange,
  onNameEnChange,
  onDescriptionChange,
  onStartDateChange,
  onEndDateChange,
  onActiveToggle,
  onNotificationSettingsChange,
  onSubmit,
  children,
  isSubmitting,
  submitDisabled = false,
  submitButtonText,
  submitButtonVariant = "primary",
  nameLabel,
}: CampaignFormWrapperProps) {
  const getButtonClass = () => {
    if (isSubmitting || submitDisabled) {
      return "btn-light text-muted";
    }
    switch (submitButtonVariant) {
      case "warning":
        return "btn-warning";
      case "light":
        return "btn-light";
      default:
        return "btn-primary";
    }
  };

  const getButtonText = () => {
    if (submitButtonText) {
      return isSubmitting ? "Kaydediliyor..." : submitButtonText;
    }
    return isSubmitting ? "Kaydediliyor..." : "Kaydet";
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <CampaignBreadcrumb
            campaignType={campaignType}
            campaignTypeLabel={campaignTypeLabel}
            action={action}
          />
          <CampaignBackButton href={`/admin/campaigns/${campaignType}`} />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            {/* Basic Fields */}
            <CampaignBasicFields
              name={name}
              nameEn={nameEn}
              description={description}
              onNameChange={onNameChange}
              onNameEnChange={onNameEnChange}
              onDescriptionChange={onDescriptionChange}
              nameLabel={nameLabel}
            />

            {/* Campaign-specific fields */}
            {children}

            {/* Date Range */}
            <CampaignDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />

            {/* Active Toggle */}
            <CampaignActiveToggle
              isActive={isActive}
              onToggle={onActiveToggle}
            />

            {/* Notification Settings - Only for create action */}
            {notificationSettings && onNotificationSettingsChange && (
              <NotificationSettings
                value={notificationSettings}
                onChange={onNotificationSettingsChange}
              />
            )}

            {/* Submit Button */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${getButtonClass()}`}
                disabled={isSubmitting || submitDisabled}
                style={{
                  filter:
                    isSubmitting || submitDisabled ? "grayscale(50%)" : "none",
                  opacity: isSubmitting || submitDisabled ? 0.7 : 1,
                }}
              >
                {getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
