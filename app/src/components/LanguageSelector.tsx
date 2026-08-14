import { LANGUAGES, useLanguage } from "../lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  return (
    <label className="relative inline-flex items-center rounded-full border border-line bg-white/80 px-2 py-1 shadow-sm backdrop-blur">
      <span className="mr-1 text-xs" aria-hidden="true">{current.flag}</span>
      <span className="sr-only">Language</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="appearance-none bg-transparent pr-4 font-mono text-[10px] uppercase tracking-[0.12em] text-ink outline-none"
        aria-label="Select language"
      >
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.native}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[9px] text-slate" aria-hidden="true">⌄</span>
    </label>
  );
}
