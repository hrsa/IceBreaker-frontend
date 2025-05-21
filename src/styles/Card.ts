import { useCommonStyles } from "@/constants/Styles";
import { Dimensions, StyleSheet } from "react-native";
import config from "@/src/config/config";

export const useCardStyles = () => {
  const commonStyles = useCommonStyles();
  const { width: screenWidth } = Dimensions.get("window");
  const isNarrowScreen = screenWidth < 600;
  const shouldRotateCard = config.isMobile && isNarrowScreen;
  const cardColor = "rgb(181,127,87)";
  const cardDimensions = shouldRotateCard
    ? {
        width: 300,
        height: 450,
      }
    : {
        width: 450,
        height: 300,
      };

  return StyleSheet.create({
    ...commonStyles,
    cardContainer: {
      ...cardDimensions,
      borderColor: cardColor,
      backgroundColor: cardColor,
      borderWidth: 1,
      borderRadius: 12,
      marginVertical: 25,
      marginHorizontal: 30,
    },
    card: {
      ...cardDimensions,
      transform: [{ rotate: config.isMobile ? "90deg" : "0deg" }],
      position: "relative",
    },
    cardFlippedContent: {
      ...cardDimensions,
      position: "absolute",
      alignItems: "center",
    },
    cardStatusBadge: {
      top: cardDimensions.height * 0.2,
      left: cardDimensions.width,
      opacity: 0.5,
      position: "absolute",
    },
    cardTextContainer: {
      ...cardDimensions,
      ...commonStyles.centerContent,
      position: "relative",
    },
    cardText: {
      ...commonStyles.text,
      color: "white",
      textAlign: "center",
      width: cardDimensions.width * 0.95,
      maxHeight: cardDimensions.height * 0.95,
    },
    cardImageContainer: {
      ...cardDimensions,
      position: "relative",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: shouldRotateCard ? -74 : 0,
      marginLeft: shouldRotateCard ? -1 : 0,
    },
    cardImage: {
      width: 450,
      height: 300,
      borderWidth: 1,
      borderColor: commonStyles.text.color,
      borderRadius: 12,
      resizeMode: "contain",
    },
    cardCategoryText: {
      ...commonStyles.text,
      textAlign: "center",
      color: "white",
      position: "absolute",
      paddingVertical: 5,
      marginBottom: 1,
      paddingHorizontal: 20,
      backdropFilter: "blur(1px)",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 12,
    },
  });
};
