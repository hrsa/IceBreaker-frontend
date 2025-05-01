import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import React, { FC } from "react";
import { useCommonStyles } from "@/constants/Styles";

interface ButtonProps {
  text: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

const Button: FC<ButtonProps> = ({ text, onPress, buttonStyle, buttonTextStyle }) => {
  const defaultStyles = useCommonStyles();

  return (
    <TouchableOpacity style={[defaultStyles.button, buttonStyle]} onPress={onPress}>
      <Text style={[defaultStyles.buttonText, buttonTextStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
