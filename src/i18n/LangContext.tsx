import { createContext, useContext, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import {
  type Lang,
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  translations,
  type TranslationKey,
} from './translations';

interface LangContextValue {
  lang: Lang;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  t: (key) => translations[DEFAULT_LANG][key] as string,
});

interface LangProviderProps {
  children: ReactNode;
  /** When set, bypasses URL param detection and uses this fixed language. */
  forceLang?: Lang;
}

export function LangProvider({ children, forceLang }: LangProviderProps) {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = forceLang
    ? forceLang
    : (SUPPORTED_LANGS as string[]).includes(rawLang ?? '')
      ? (rawLang as Lang)
      : DEFAULT_LANG;

  function t(key: TranslationKey): string {
    return translations[lang][key] as string;
  }

  return (
    <LangContext.Provider value={{ lang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
