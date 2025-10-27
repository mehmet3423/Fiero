// Email ve SMS notification modelleri
export interface EmailNotification {
  isEmailNotificationEnabled: boolean;
  emailNotificationSubject: string;
  emailNotificationTextBody: string;
  emailNotificationHtmlBody: string;
}

export interface SMSNotification {
  isSMSNotificationEnabled: boolean;
  smsNotificationSubject: string;
  smsNotificationTextBody: string;
  smsNotificationHtmlBody: string;
}

// Tüm notification özelliklerini birleştiren model
export interface NotificationSettings
  extends EmailNotification,
    SMSNotification {}

// Discount modellerine notification özelliklerini eklemek için base interface
export interface DiscountWithNotifications {
  notificationSettings?: NotificationSettings;
}
