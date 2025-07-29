export interface Settings {
  id: string;
  key: string | null | undefined;
  value: string | null | undefined;
  description: string | null | undefined;
  createdDateTime: string;
  modifiedDateTime: string;
}

export interface SettingsResponse {
  data: Settings[];
  success: boolean;
  message: string;
}

// API direkt Settings array dönüyor
export type SettingsApiResponse = Settings[];

export interface UpdateSettingsRequest {
  id: string;
  value: string;
  description?: string;
}

export interface CreateSettingsRequest {
  id: string;
  key: number; // API enum value (integer)
  value: string;
  description: string;
}

export interface SystemSettingType {
  key: string;
  value: number; // API'den integer geliyor
  displayName: string;
}

export interface SystemSettingTypesResponse {
  data: SystemSettingType[];
  isSucceed: boolean;
  message: string;
}
