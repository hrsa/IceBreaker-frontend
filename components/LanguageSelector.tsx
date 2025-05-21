import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useLanguageStore, SupportedLanguage } from "@/src/stores/languageStore";
import { useLanguageImages } from "@/hooks/useLanguageImages";
import { useLanguageSelectorStyles } from "@/src/styles/LanguageSelector";

const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
];

const LanguageSelector = () => {
  const language = useLanguageStore(state => state.language);
  const t = useLanguageStore(state => state.t);
  const setLanguage = useLanguageStore(state => state.setLanguage);
  const { getLanguageImage } = useLanguageImages();

  const styles = useLanguageSelectorStyles();

  return (
    <View style={styles.container}>
      <View style={styles.languageList}>
        {languages.map(lang => (
          <View key={lang.code} style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => setLanguage(lang.code as SupportedLanguage)}>
              <Image source={getLanguageImage(lang.code as SupportedLanguage)} style={styles.languageImage}></Image>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LanguageSelector;
