import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "tr" ? "en" : "tr";
    setCurrentLanguage(newLanguage);
    setLanguage(newLanguage as "tr" | "en");
  };

  return (
    <div
      className="language-switcher"
      onClick={toggleLanguage}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "70px",
        height: "30px",
        borderRadius: "15px",
        background: "transparent",
        fontWeight: "lighter",
        fontSize: "16px",
        color: "#333",
        textTransform: "uppercase",
        marginLeft: "0px",
        gap: "5px",
      }}
    >
      <span
        style={{
          fontWeight: currentLanguage === "tr" ? "bold" : "lighter",
          cursor: "pointer",
        }}
      >
        TR
      </span>
      <span>/</span>
      <span
        style={{
          fontWeight: currentLanguage === "en" ? "bold" : "lighter",
          cursor: "pointer",
        }}
      >
        EN
      </span>
    </div>
  );
}