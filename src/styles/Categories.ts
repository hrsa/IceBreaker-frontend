import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

export const useCategoryStyles = () => {
  const commonStyles = useCommonStyles();
  const categoryDimensions = {
    width: 300,
    height: 200,
    borderRadius: 12,
  };

  return StyleSheet.create({
    ...commonStyles,
    categoryContainer: {
      ...categoryDimensions,
      flex: 1,
      margin: 10,
      position: "relative",
    },
    categoryBlurView: {
      ...categoryDimensions,
      zIndex: 1,
      position: "absolute",
      backgroundColor: "rgba(0, 102, 0, 0.8)",
    },
    categoryCard: {
      ...commonStyles.centerContent,
      ...categoryDimensions,
      position: "relative",
    },
    categoryImage: {
      ...categoryDimensions,
      resizeMode: "cover",
      position: "absolute",
      borderRadius: 12,
    },
    categoryText: {
      textAlign: "center",
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 12,
      color: "white",
      fontFamily: "MerriweatherBold",
    },
  });
};
