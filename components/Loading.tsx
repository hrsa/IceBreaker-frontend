import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";
import React, { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface LoadingProps {
  color?: string;
  size?: number | "large" | "small";
  style?: StyleProp<ViewStyle>;
}

const Loading: FC<LoadingProps> = ({ color, size, style }) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <View style={style}>
      <ActivityIndicator size={size ?? "large"} color={color ?? theme.primary} />
    </View>
  );
};

export default Loading;
