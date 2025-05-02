import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { ComponentProps, FC } from "react";
import { useCommonStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";

type IonIconsName = ComponentProps<typeof Ionicons>["name"];

interface ButtonProps {
  text: string;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  icon?: IonIconsName;
  iconColor?: string;
  iconSize?: number;
  iconStyles?: StyleProp<TextStyle>;
}

const Button: FC<ButtonProps> = ({ text, onPress, buttonStyle, buttonTextStyle, icon, iconColor, iconSize, iconStyles }) => {
  const defaultStyles = useCommonStyles();

  return (
    <TouchableOpacity style={[defaultStyles.button, buttonStyle]} onPress={onPress}>
      {icon && (
        <Ionicons
          name={icon}
          color={iconColor ?? defaultStyles.text.color}
          size={iconSize ?? 24}
          style={[{ marginRight: text.length > 0 ? 12 : 0 }, iconStyles]}
        />
      )}
      <Text style={[defaultStyles.buttonText, buttonTextStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
