import React, { createContext, useContext, useState, ReactNode } from "react";
import trCommon from "@/locales/tr/common.json";
import trAuth from "@/locales/tr/auth.json";
import enCommon from "@/locales/en/common.json";
import enAuth from "@/locales/en/auth.json";

type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// JSON dosyalarından çeviri verilerini birleştir
const translations = {
  tr: {
    ...trCommon,
    ...trAuth,
  },
  en: {
    ...enCommon,
    ...enAuth,
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
