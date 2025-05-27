import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

/**
 * Hook for Index screen styles
 */
export const useIndexStyles = () => {
  const commonStyles = useCommonStyles();

  return StyleSheet.create({
    ...commonStyles,
    title: {
      ...commonStyles.title,
      margin: "auto",
      marginTop: 25,
      marginBottom: 10,
    },
    logo: {
      width: 350,
      height: 350,
      marginHorizontal: "auto",
    },
    userInfo: {
      marginBottom: 30,
      alignItems: "center",
    },
    userText: {
      ...commonStyles.text,
      marginBottom: 5,
    },
    buttonContainer: {
      ...commonStyles.centerContent,
      margin: "auto",
      marginVertical: 35,
      flexDirection: "column",
      width: "100%",
      gap: 35,
    },
    startButton: {
      ...commonStyles.button,
      backgroundColor: "#47b2cd",
    },
    logoutButton: {
      ...commonStyles.button,
      backgroundColor: "darkred",
    },
  });
};
