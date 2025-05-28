import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from "react-native";

export const useLoginStyles = () => {
  const commonStyles = useCommonStyles();

  return StyleSheet.create({
    ...commonStyles,
    header: {
      ...commonStyles.header,
      marginBottom: 40,
    },
    content: {
      ...commonStyles.content,
      maxWidth: 800,
    },
    registerContainer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
    },
    tosContainer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignSelf: "center",
      flexWrap: "wrap",
      maxWidth: 350,
    },
    registerText: {
      ...commonStyles.text,
      fontSize: 14,
    },
    registerLink: {
      ...commonStyles.suggestionLink,
      marginLeft: 5,
    },
    forgotPasswordLink: {
      ...commonStyles.suggestionLink,
      textAlign: "center",
      marginTop: 12,
    },
  });
};
