import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

export const useMyProfileStyles = () => {
  const commonStyles = useCommonStyles();

  return StyleSheet.create({
    ...commonStyles,
    scrollView: {
      ...commonStyles.scrollView,
      ...commonStyles.centerContent,
      width: "100%",
      maxWidth: 500,
    },
    header: {
      ...commonStyles.header,
      marginBottom: 15,
    },
    title: {
      ...commonStyles.title,
      fontSize: 28,
    },
    label: {
      ...commonStyles.label,
      textAlign: "center",
    },
    suggestionLink: {
      ...commonStyles.suggestionLink,
      textAlign: "center",
    },
    modalContent: {
      ...commonStyles.centerContent,
      flexDirection: "column",
      gap: 25,
      maxWidth: 500,
      paddingHorizontal: 25,
    },
    modalText: {
      ...commonStyles.text,
      textAlign: "center",
    },
    botLink: {
      ...commonStyles.text,
      color: commonStyles.button.backgroundColor,
      fontFamily: "MerriweatherBold",
    },
    deleteAccountLink: {
      ...commonStyles.text,
      color: "darkred",
      textAlign: "center",
      marginTop: 20,
      fontSize: 14,
    },
  });
};
