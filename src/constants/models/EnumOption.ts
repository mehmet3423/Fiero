export interface EnumOption {
  key: string;        // Enum'un string karşılığı
  value: number;      // Enum'un int karşılığı
  displayName: string; // Kullanıcıya gösterilecek açıklama
}

export interface EnumOptionsResponse {
  data: EnumOption[];
}