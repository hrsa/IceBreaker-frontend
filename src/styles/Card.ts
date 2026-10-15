import { useCommonStyles } from "@/constants/Styles";
import { Dimensions, StyleSheet } from "react-native";
import config from "@/src/config/config";

/** Card orientation flag for the current screen; shared by the styles and callers that
 * need the text constraints (e.g. AdaptiveText). */
const shouldRotateCard = () => config.isMobile || Dimensions.get("window").width < 600;

/** Card size for the current screen. */
export const getCardDimensions = () =>
  shouldRotateCard()
    ? {
        width: 300,
        height: 450,
      }
    : {
        width: 450,
        height: 300,
      };

export const useCardStyles = () => {
  const commonStyles = useCommonStyles();
  const cardColor = "rgb(181,127,87)";
  const rotateCard = shouldRotateCard();
  const cardDimensions = getCardDimensions();

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
      transform: [{ rotate: rotateCard ? "90deg" : "0deg" }],
      position: "relative",
    },
    cardFlippedContent: {
      ...cardDimensions,
      position: "absolute",
      alignItems: "center",
    },
    cardStatusBadge: {
      top: rotateCard ? cardDimensions.height * 0.2 : 15,
      left: rotateCard ? cardDimensions.width : cardDimensions.width - 75,
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
    },
    cardImageContainer: {
      ...cardDimensions,
      position: "relative",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: rotateCard ? -74 : 0,
      marginLeft: rotateCard ? -1 : 0,
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
