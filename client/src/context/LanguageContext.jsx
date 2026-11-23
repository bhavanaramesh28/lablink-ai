import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { LANGUAGES, TRANSLATIONS } from "../lib/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem("lablink_lang");
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {}
    return "en";
  });

  const setLanguage = (langCode) => {
    if (LANGUAGES.some((l) => l.code === langCode)) {
      setLanguageState(langCode);
      try {
        localStorage.setItem("lablink_lang", langCode);
      } catch (e) {}
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    return (path, fallback = "") => {
      if (!path) return fallback;
      const keys = path.split(".");

      // Try current language
      let cur = TRANSLATIONS[language];
      let found = true;
      for (const k of keys) {
        if (cur && typeof cur === "object" && k in cur) {
          cur = cur[k];
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof cur === "string") return cur;

      // Fallback to English
      let enCur = TRANSLATIONS.en;
      for (const k of keys) {
        if (enCur && typeof enCur === "object" && k in enCur) {
          enCur = enCur[k];
        } else {
          return fallback || path;
        }
      }
      return typeof enCur === "string" ? enCur : fallback || path;
    };
  }, [language]);

  const currentLangObj = useMemo(
    () => LANGUAGES.find((l) => l.code === language) || LANGUAGES[0],
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        currentLangObj,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
