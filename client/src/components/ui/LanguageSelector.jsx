import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelector({ className = "" }) {
  const { language, setLanguage, languages, currentLangObj } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-white/80 hover:border-cyan-glow/50 hover:text-cyan-glow transition shadow-sm"
        title="Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / भाषा चुनें"
      >
        <Globe size={15} className="text-cyan-600 dark:text-cyan-glow flex-shrink-0" />
        <span className="text-sm leading-none">{currentLangObj?.flag}</span>
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          {language}
        </span>
        <ChevronDown size={12} className="text-slate-400 dark:text-white/40" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-cyan-glow/30 bg-white dark:bg-[#0B1224] p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 border-b border-slate-100 dark:border-white/5 mb-1">
            Choose Language / ಭಾಷೆ
          </div>
          <div className="space-y-0.5 max-h-64 overflow-y-auto">
            {languages.map((lang) => {
              const isActive = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition ${
                    isActive
                      ? "bg-cyan-glow/15 text-cyan-700 dark:text-cyan-glow font-semibold border border-cyan-glow/30"
                      : "text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <span className="block leading-tight font-medium">{lang.native}</span>
                      <span className="text-[10px] text-slate-400 dark:text-white/40">
                        {lang.label}
                      </span>
                    </div>
                  </div>
                  {isActive && <Check size={14} className="text-cyan-glow flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
