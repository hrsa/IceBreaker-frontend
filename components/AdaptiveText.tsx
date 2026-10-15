import { StyleProp, Text, TextStyle } from "react-native";
import { FC, useMemo } from "react";
import { useLanguageStore } from "@/src/stores/languageStore";

interface AdaptiveTextProps {
  fontSize: number;
  text: string;
  styles: StyleProp<TextStyle>;
  numerator?: number;
  denominator?: number;
}

const AdaptiveText: FC<AdaptiveTextProps> = ({ fontSize, text, styles, numerator = 4300, denominator = 0.7 }) => {
  const language = useLanguageStore(state => state.language);

  // The font size is a pure function of the text; derive it instead of
  // adjusting state in an effect.
  const currentFont = useMemo(() => {
    const lineBreaks = text.split("\n").length - 1;
    const newSize = numerator / (text.length * denominator + 28 * lineBreaks);
    return newSize < fontSize ? newSize : fontSize;
  }, [text, language, fontSize, numerator, denominator]);

  return <Text style={[styles, { fontSize: currentFont }]}>{text}</Text>;
};

export default AdaptiveText;
