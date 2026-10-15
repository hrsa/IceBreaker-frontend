import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as Localization from "expo-localization";
import i18n, { InitOptions, TOptionsBase } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Category } from "@/src/types/entities";
import { Translations } from "@/constants/Translations";

export type SupportedLanguage = "en" | "ru" | "fr" | "it";
type $Dictionary<T = unknown> = { [key: string]: T };
type $SpecialObject = object | Array<string | object>;

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "ru", "fr", "it"];
const LANGUAGE_STORAGE_KEY = "userLanguage";
const RTL_LANGUAGES = ["ar", "he"];

const defaultLanguage = (): SupportedLanguage => {
  const deviceLang = Localization.getLocales()[0]?.languageCode ?? "en";
  return (SUPPORTED_LANGUAGES as string[]).includes(deviceLang) ? (deviceLang as SupportedLanguage) : "en";
};

i18n.use(initReactI18next).init({
  resources: Translations,
  compatibilityJSON: "v4",
  lng: defaultLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
} as InitOptions);

interface LanguageState {
  language: SupportedLanguage;
  isRTL: boolean;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  switchLanguage: () => Promise<void>;
  t: (key: string, options?: (TOptionsBase & $Dictionary) | undefined) => string;
  tObj: (key: string) => $SpecialObject;
  getLocalizedCardField: (entity: Card | Category, field: "question" | "description" | "name") => string;
}

// Migration: the pre-persist implementation stored the bare language code
// (e.g. "en"). The persist middleware expects a JSON envelope, so legacy
// values are converted on first read.
const languageStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const raw = await AsyncStorage.getItem(name);
    if (raw == null) {
      return null;
    }
    try {
      JSON.parse(raw);
      return raw;
    } catch {
      return JSON.stringify({ state: { language: raw }, version: 0 });
    }
  },
  setItem: (name: string, value: string) => AsyncStorage.setItem(name, value),
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: defaultLanguage(),
      isRTL: false,

      setLanguage: async (newLanguage: SupportedLanguage) => {
        i18n.changeLanguage(newLanguage);
        set({
          language: newLanguage,
          isRTL: RTL_LANGUAGES.includes(newLanguage),
        });
      },

      switchLanguage: async () => {
        const currentIndex = SUPPORTED_LANGUAGES.indexOf(get().language);
        const nextLanguage = SUPPORTED_LANGUAGES[(currentIndex + 1) % SUPPORTED_LANGUAGES.length];
        await get().setLanguage(nextLanguage);
      },

      t: (key: string, options?: (TOptionsBase & $Dictionary) | undefined) => {
        return i18n.t(key, options);
      },

      tObj: (key: string) => {
        return i18n.t(key, { returnObjects: true });
      },

      getLocalizedCardField: (entity: Card | Category, field: "question" | "description" | "name") => {
        const language = get().language;
        // For fields like "question_en", "question_ru", etc.
        const localizedField = `${field}_${language}`;
        const englishField = `${field}_en`;

        return (
          (entity as Record<string, string | undefined>)[localizedField] || (entity as Record<string, string | undefined>)[englishField] || ""
        );
      },
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      version: 0,
      storage: createJSONStorage(() => languageStorage),
      partialize: state => ({ language: state.language }),
      merge: (persistedState, currentState) => {
        const persistedLanguage = (persistedState as { language?: string } | undefined)?.language;
        const language =
          persistedLanguage != null && (SUPPORTED_LANGUAGES as string[]).includes(persistedLanguage)
            ? (persistedLanguage as SupportedLanguage)
            : currentState.language;

        // Keep i18next in sync with the rehydrated language.
        i18n.changeLanguage(language);

        return {
          ...currentState,
          language,
          isRTL: RTL_LANGUAGES.includes(language),
        };
      },
    }
  )
);
