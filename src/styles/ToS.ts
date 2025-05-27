import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

export const useToSStyles = () => {
  const commonStyles = useCommonStyles();

  return StyleSheet.create({
    ...commonStyles,
    sectionContainer: {
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      paddingBottom: 16,
      width: "100%",
      minWidth: 300,
      maxWidth: 1600,
      marginHorizontal: "auto",
    },
    sectionHeader: {
      flexDirection: "row",
      marginBottom: 4,
      alignItems: "flex-start",
      textTransform: "uppercase",
    },
    sectionNumber: {
      ...commonStyles.text,
      minWidth: 24,
      fontSize: 24,
      fontFamily: "SpaceMono",
      marginRight: 8,
    },
    sectionTitle: {
      ...commonStyles.subtitle,
      marginBottom: 0,
      fontFamily: "SpaceMono",
      textAlign: "left",
      flex: 1,
    },
    contentContainer: {
      marginLeft: 32,
    },
    subsectionContainer: {
      marginTop: 8,
      marginBottom: 10,
    },
    subsectionTitle: {
      ...commonStyles.subtitle,
      fontFamily: "SpaceMono",
      textAlign: "left",
      marginBottom: 6,
    },
    nestedSubsectionContainer: {
      marginLeft: 16,
      marginTop: 4,
      marginBottom: 4,
    },
    nestedSubsectionTitle: {
      ...commonStyles.subtitle,
      fontFamily: "SpaceMono",
      textAlign: "left",
      marginBottom: 6,
    },
    paragraph: {
      ...commonStyles.text,
      fontSize: 18,
      fontFamily: "SpaceMono",
      marginBottom: 6,
    },
    bulletListContainer: {
      marginBottom: 12,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 8,
      paddingRight: 8,
    },
    bullet: {
      marginRight: 8,
      fontFamily: "SpaceMono",
      color: commonStyles.text.color,
    },
    bulletText: {
      ...commonStyles.text,
      fontFamily: "SpaceMono",
      flex: 1,
    },
    footer: {
      marginTop: 32,
      alignItems: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
    },
    footerText: {
      fontSize: 14,
      color: "#666",
    },
    loginText: {
      color: "#007bff",
      marginTop: 8,
      fontWeight: "600",
    },
    scrollView: {
      ...commonStyles.scrollView,
      ...commonStyles.centerContent,
      width: "100%",
      marginHorizontal: "auto",
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
