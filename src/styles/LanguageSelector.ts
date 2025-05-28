import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";
import config from "@/src/config/config";

export const useLanguageSelectorStyles = () => {
  const commonStyles = useCommonStyles();

  return StyleSheet.create({
    ...commonStyles,
    container: {
      ...commonStyles.container,
      padding: 16,
    },
    title: {
      ...commonStyles.title,
      fontSize: 18,
    },
    languageList: {
      flexDirection: "row",
      flexWrap: config.isMobile ? undefined : "wrap",
      justifyContent: "center",
      minWidth: 300,
      gap: 10,
    },
    languageButton: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ccc",
      minWidth: 120,
      alignItems: "center",
    },
    selectedLanguage: {
      backgroundColor: "#4f86f7",
      borderColor: "#4f86f7",
    },
    languageImage: {
      width: 60,
      height: 60,
      transform: [{ rotate: config.isMobile ? "90deg" : "0deg" }],
    },
  });
};
