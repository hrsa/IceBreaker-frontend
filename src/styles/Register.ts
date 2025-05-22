import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

export const useRegisterStyles = () => {
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
      marginBottom: 40,
    },
    title: {
      ...commonStyles.title,
      fontSize: 28,
    },
    subtitle: {
      ...commonStyles.subtitle,
      fontSize: 16,
      marginBottom: 8,
    },
    label: {
      ...commonStyles.label,
      textAlign: "center",
    },
    loginContainer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
    },
    loginText: {
      ...commonStyles.text,
      fontSize: 14,
    },
    loginLink: {
      ...commonStyles.text,
      color: commonStyles.button.backgroundColor,
      fontSize: 14,
      fontFamily: "MerriweatherBold",
      marginLeft: 5,
    },
    errorText: {
      ...commonStyles.errorText,
      marginTop: 20,
    },
  });
};
