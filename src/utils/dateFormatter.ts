/**
 * Date formatting utilities for consistent date display across the application
 */

/**
 * Formats a date string or timestamp to Turkish locale date format
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date string (e.g., "15.10.2024")
 */
export const formatDate = (dateInput: string | Date | number): string => {
  if (!dateInput) return "Tarih belirtilmemiş";

  try {
    const date =
      typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);

    if (isNaN(date.getTime())) {
      return "Geçersiz Tarih";
    }

    return date.toLocaleDateString("tr-TR");
  } catch (error) {
    return "Geçersiz Tarih";
  }
};

/**
 * Formats a date string or timestamp to Turkish locale date and time format
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date-time string (e.g., "15.10.2024 14:30:00")
 */
export const formatDateTime = (dateInput: string | Date | number): string => {
  if (!dateInput) return "Tarih belirtilmemiş";

  try {
    const date =
      typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);

    if (isNaN(date.getTime())) {
      return "Geçersiz Tarih";
    }

    return date.toLocaleString("tr-TR");
  } catch (error) {
    return "Geçersiz Tarih";
  }
};

/**
 * Formats a date string or timestamp to Turkish locale time format
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted time string (e.g., "14:30:00")
 */
export const formatTime = (dateInput: string | Date | number): string => {
  if (!dateInput) return "Saat belirtilmemiş";

  try {
    const date =
      typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);

    if (isNaN(date.getTime())) {
      return "Geçersiz Saat";
    }

    return date.toLocaleTimeString("tr-TR");
  } catch (error) {
    return "Geçersiz Saat";
  }
};

/**
 * Calculates relative time from now (e.g., "2 gün önce")
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Relative time string
 */
export const getRelativeTime = (dateInput: string | Date | number): string => {
  if (!dateInput) return "Bilinmiyor";

  try {
    const date =
      typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);

    if (isNaN(date.getTime())) {
      return "Geçersiz Tarih";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ay önce`;
    } else if (diffDays > 0) {
      return `${diffDays} gün önce`;
    } else if (diffHours > 0) {
      return `${diffHours} saat önce`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} dakika önce`;
    } else {
      return "Az önce";
    }
  } catch (error) {
    return "Bilinmiyor";
  }
};
