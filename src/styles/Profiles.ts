import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

export const useProfileStyles = () => {
  const commonStyles = useCommonStyles();
  const profileDimensions = {
    width: 300,
    height: 200,
  };

  return StyleSheet.create({
    ...commonStyles,
    subtitle: {
      ...commonStyles.subtitle,
      marginVertical: 10,
    },
    profilesContainer: {
      paddingBottom: 100,
      alignItems: "center",
      minHeight: "100%",
    },
    createButonContainer: {
      position: "absolute",
      paddingVertical: 25,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor: commonStyles.container.backgroundColor,
    },
    createButton: {
      ...commonStyles.button,
      alignSelf: "center",
      elevation: 5,
    },
    profileBlob: {
      ...commonStyles.shadow,
      ...profileDimensions,
      borderRadius: 12,
      margin: 12,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      borderWidth: 1,
    },
    profileBlobContent: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    profileIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(0,0,0,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    profileInitial: {
      fontSize: 24,
      fontWeight: "bold",
    },
    profileName: {
      fontFamily: "MerriweatherBold",
      backgroundColor: "rgba(0,0,0,0.3)",
      borderRadius: 12,
      textAlign: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      textTransform: "uppercase",
      color: "white",
      position: "absolute",
      zIndex: 1,
    },
    profileImage: {
      ...profileDimensions,
      alignSelf: "center",
      borderRadius: 12,
    },
    emptyText: {
      ...commonStyles.text,
      textAlign: "center",
      opacity: 0.7,
      padding: 20,
    },
    trashZoneText: {
      fontFamily: "MerriweatherBold",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 10,
      borderRadius: 12,
      color: "white",
      marginTop: 8,
      fontSize: 24,
    },
    trashZone: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      justifyContent: "center",
      alignItems: "center",
    },
    trashZoneBlur: {
      width: "100%",
      height: "80%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    input: {
      ...commonStyles.input,
      width: 200,
      padding: 10,
      textAlign: "center",
      marginBottom: 20,
    },
    cancelButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.5)",
    },
  });
};
