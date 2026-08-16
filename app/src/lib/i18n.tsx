import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "ko" | "hi";

export const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ko", label: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
];

export const copy = {
  en: { passport: "Passport", resources: "Resources", technical: "Technical Overview", builtIndia: "Built from India", forGlobal: "Designed for global builders", title: "GIWA Builder Passport", subtitle: "A portable, verifiable on-chain identity primitive for builders — connecting identity, skills, projects and contribution proofs into an ecosystem-readable builder profile.", problem: "Problem", primitive: "Primitive", proof: "Proof", explore: "Explore Developer Resources", ecosystem: "Built for the GIWA ecosystem", video: "See BuilderPass in action", watch: "Watch the technical walkthrough", channel: "Pawan Satoshi", verify: "Verify Contract", overview: "Technical Overview", identity: "Identity", credentials: "Credentials", reputation: "Reputation", graph: "Builder Graph", agents: "Agents", live: "Live on GIWA Sepolia" },
  ko: { passport: "패스포트", resources: "개발자 리소스", technical: "기술 개요", builtIndia: "인도에서 빌드", forGlobal: "글로벌 빌더를 위해 설계", title: "GIWA 빌더 패스포트", subtitle: "빌더의 신원, 기술, 프로젝트 및 기여 증명을 연결하는 검증 가능한 온체인 아이덴티티 프리미티브입니다.", problem: "문제", primitive: "프리미티브", proof: "검증", explore: "개발자 리소스 보기", ecosystem: "GIWA 생태계를 위해 설계", video: "BuilderPass 사용해보기", watch: "기술 데모 보기", channel: "Pawan Satoshi", verify: "컨트랙트 검증", overview: "기술 개요", identity: "신원", credentials: "자격 증명", reputation: "평판", graph: "빌더 그래프", agents: "에이전트", live: "GIWA Sepolia에서 운영" },
  hi: { passport: "पासपोर्ट", resources: "डेवलपर रिसोर्सेज", technical: "टेक्निकल ओवरव्यू", builtIndia: "भारत से निर्मित", forGlobal: "वैश्विक बिल्डर्स के लिए", title: "GIWA Builder Passport", subtitle: "बिल्डर्स के लिए portable और verifiable on-chain identity primitive, जो identity, skills, projects और contribution proofs को जोड़ता है।", problem: "समस्या", primitive: "प्रिमिटिव", proof: "प्रमाण", explore: "डेवलपर रिसोर्सेज देखें", ecosystem: "GIWA ecosystem के लिए बनाया गया", video: "BuilderPass को देखें", watch: "टेक्निकल डेमो देखें", channel: "Pawan Satoshi", verify: "कॉन्ट्रैक्ट सत्यापित करें", overview: "टेक्निकल ओवरव्यू", identity: "पहचान", credentials: "क्रेडेंशियल्स", reputation: "प्रतिष्ठा", graph: "Builder Graph", agents: "Agents", live: "GIWA Sepolia पर लाइव" },
} as const;

const STORAGE_KEY = "builderpass-language";
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (typeof copy)[Language] };
const LanguageContext = createContext<LanguageContextValue | null>(null);

function initialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored && LANGUAGES.some((item) => item.code === stored) ? stored : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: copy[language] }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
