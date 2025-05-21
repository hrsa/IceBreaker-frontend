import { SupportedLanguage } from "@/src/stores/languageStore";

export const useLanguageImages = () => {
  const languageImages: Record<SupportedLanguage, any> = {
    en: require("../assets/images/languages/en.webp"),
    fr: require("../assets/images/languages/fr.webp"),
    it: require("../assets/images/languages/it.webp"),
    ru: require("../assets/images/languages/ru.webp"),
  };

  const getLanguageImage = (language: SupportedLanguage) => {
    return languageImages[language] || languageImages.en;
  };

  return { languageImages, getLanguageImage };
};
