import React, { createContext, useContext, useState, ReactNode } from "react";
import trCommon from "@/locales/tr/common.json";
import trAuth from "@/locales/tr/auth.json";
import trProfile from "@/locales/tr/profile.json";
import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";
import enProfile from "@/locales/en/profile.json";

type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Nested objeleri düzleştiren yardımcı fonksiyon
function flattenObject(obj: any, prefix = ""): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// JSON dosyalarından çeviri verilerini birleştir ve düzleştir
const translations = {
  tr: {
    ...flattenObject(trCommon),
    ...flattenObject(trAuth),
    ...flattenObject(trProfile),
  },
  en: {
    ...flattenObject(enCommon),
    ...flattenObject(enAuth),
    ...flattenObject(enProfile),
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("tr");

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}