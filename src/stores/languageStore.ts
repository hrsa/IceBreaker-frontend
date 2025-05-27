import { create } from "zustand";
import * as Localization from "expo-localization";
import i18n, { InitOptions, TOptionsBase } from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Category } from "@/src/types/entities";
import { Translations } from "@/constants/Translations";

export type SupportedLanguage = "en" | "ru" | "fr" | "it";
type $Dictionary<T = unknown> = { [key: string]: T };
type $SpecialObject = object | Array<string | object>;

i18n.use(initReactI18next).init({
  resources: Translations,
  compatibilityJSON: "v4",
  lng: Localization.getLocales()[0]?.languageCode ?? "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
} as InitOptions);

interface LanguageState {
  language: SupportedLanguage;
  isRTL: boolean;
  isLoading: boolean;
  error: string | null;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  switchLanguage: () => Promise<void>;
  t: (key: string, options?: (TOptionsBase & $Dictionary) | undefined) => string;
  tObj: (key: string) => $SpecialObject;
  getLocalizedCardField: (entity: Card | Category, field: "question" | "description" | "name") => string;
  initializeLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()((set, get) => ({
  language: "en",
  isRTL: false,
  isLoading: true,
  error: null,

  setLanguage: async (newLanguage: SupportedLanguage) => {
    try {
      set({ isLoading: true, error: null });

      i18n.changeLanguage(newLanguage);

      const isRTL = ["ar", "he"].includes(newLanguage);

      await AsyncStorage.setItem("userLanguage", newLanguage);

      set({
        language: newLanguage,
        isRTL,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to set language:", error);
      set({
        error: "Failed to set language",
        isLoading: false,
      });
    }
  },

  switchLanguage: async () => {
    try {
      set({ isLoading: true, error: null });
      const supportedLanguages = ["en", "ru", "fr", "it"];
      const currentLanguage = get().language ?? "en";
      let nextLanguage = "ru";
      switch (currentLanguage) {
        case "en":
          nextLanguage = "ru";
          break;
        case "ru":
          nextLanguage = "fr";
          break;
        case "fr":
          nextLanguage = "it";
          break;
        case "it":
        default:
          nextLanguage = "en";
          break;
      }

      i18n.changeLanguage(nextLanguage);

      await AsyncStorage.setItem("userLanguage", nextLanguage);

      set({
        language: nextLanguage as SupportedLanguage,
        isRTL: ["ar", "he"].includes(nextLanguage),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to set language:", error);
      set({
        error: "Failed to set language",
        isLoading: false,
      });
    }
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

  initializeLanguage: async () => {
    try {
      set({ isLoading: true, error: null });

      const storedLanguage = await AsyncStorage.getItem("userLanguage");

      if (storedLanguage && ["en", "ru", "fr", "it"].includes(storedLanguage)) {
        const isRTL = ["ar", "he"].includes(storedLanguage);
        await i18n.changeLanguage(storedLanguage);
        set({
          language: storedLanguage as SupportedLanguage,
          isRTL,
          isLoading: false,
        });
      } else {
        const deviceLang = Localization.getLocales()[0]?.languageCode ?? "en";
        const supportedLang = ["en", "ru", "fr", "it"].includes(deviceLang) ? (deviceLang as SupportedLanguage) : "en";

        const isRTL = ["ar", "he"].includes(supportedLang);
        await i18n.changeLanguage(supportedLang);

        await AsyncStorage.setItem("userLanguage", supportedLang);

        set({
          language: supportedLang,
          isRTL,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to initialize language:", error);
      set({
        language: "en",
        isRTL: false,
        error: "Failed to initialize language",
        isLoading: false,
      });
    }
  },
}));

useLanguageStore.getState().initializeLanguage();
