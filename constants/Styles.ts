import { StyleSheet } from "react-native";
import { Colors, ColorScheme } from "./Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export const createCommonStyles = (theme: ColorScheme) => {
  const base = {
    text: {
      color: theme.text,
      fontFamily: "Merriweather",
      fontSize: 16,
    },
  };

  return StyleSheet.create({
    flexFullWidth: {
      flex: 1,
      width: "100%",
    },
    centerContent: {
      alignItems: "center",
      justifyContent: "center",
    },
    shadow: {
      boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 3, color: theme.shadow, spreadDistance: 0 }],
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      alignItems: "center",
    },
    content: {
      flex: 1,
      marginHorizontal: "auto",
      justifyContent: "center",
      padding: 20,
    },
    scrollView: {
      flexGrow: 1,
    },
    centeredContainer: {
      width: "auto",
      alignItems: "center",
    },
    title: {
      ...base.text,
      fontFamily: "MerriweatherBold",
      fontSize: 36,
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      ...base.text,
      fontFamily: "MerriweatherBold",
      fontSize: 24,
      marginBottom: 20,
      opacity: 0.9,
      textAlign: "center",
    },
    text: {
      ...base.text,
    },
    errorText: {
      ...base.text,
      color: "red",
      marginTop: 10,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      ...base.text,
      marginBottom: 8,
      textAlign: "center",
    },
    input: {
      ...base.text,
      backgroundColor: theme.inputBackground,
      borderRadius: 8,
      padding: 15,
      borderWidth: 1,
      borderColor: theme.border,
      marginHorizontal: "auto",
      width: "auto",
      minWidth: 250,
    },

    buttonContainer: {
      marginTop: 10,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      width: "auto",
      margin: "auto",
      paddingHorizontal: 25,
    },
    buttonText: {
      ...base.text,
      color: "white",
      fontFamily: "MerriweatherBold",
    },

    suggestionLink: {
      ...base.text,
      color: theme.primary,
      fontSize: 14,
      fontFamily: "MerriweatherBold",
    },

    // Modal styles

    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.9)",
    },
    modalContent: {
      width: "auto",
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
      overflow: "hidden",
    },
    modalTitle: {
      fontFamily: "MerriweatherBold",
      fontSize: 22,
      color: "white",
      marginBottom: 48,
    },
    modalButtons: {
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "center",
      width: "auto",
      gap: 40,
    },
    modalButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: "center",
      textTransform: "uppercase",
    },

    // Card styles
    card: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
};

export const useCommonStyles = () => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  return createCommonStyles(theme);
};
