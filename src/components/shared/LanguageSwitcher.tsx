import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as "tr" | "en");
  };

  return (
    <div className="language-switcher">
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="form-select"
        style={{ minWidth: "100px", fontSize: "12px" }}
      >
        <option value="tr">🇹🇷 Türkçe</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </div>
  );
}
