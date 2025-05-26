import { useCommonStyles } from "@/constants/Styles";
import { Dimensions, StyleSheet } from "react-native";
import config from "@/src/config/config";

export const useGameStyles = () => {
  const commonStyles = useCommonStyles();
  const { width: screenWidth } = Dimensions.get("window");
  const isNarrowScreen = screenWidth < 600;
  const shouldRotateCard = config.isMobile || isNarrowScreen;
  const gameButton = {
    borderRadius: 999,
    padding: 20,
    transform: [{ rotate: shouldRotateCard ? "90deg" : "0deg" }],
  };

  return StyleSheet.create({
    ...commonStyles,
    gameButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 25,
      alignItems: "center",
      marginTop: 25,
      minHeight: 60,
      gap: 30,
    },
    undoButton: {
      ...gameButton,
      backgroundColor: "#4f86f7",
    },
    loveButton: {
      ...gameButton,
      backgroundColor: "#F06292",
    },
    languageButton: {
      ...gameButton,
      padding: 0,
      width: 80,
      height: 80,
    },
    gameSwitchesContainer: {
      flexDirection: shouldRotateCard ? "column" : "row",
      gap: 10,
      alignItems: "center",
      marginTop: 25,
      marginHorizontal: "auto",
      transform: [{ rotate: shouldRotateCard ? "90deg" : "0deg" }],
      height: 80,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    switch: {
      margin: "auto",
      alignSelf: "center",
      marginRight: 10,
    },
  });
};
