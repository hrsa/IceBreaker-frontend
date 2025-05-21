import { StyleProp, Text, TextStyle } from "react-native";
import { FC, useEffect, useState } from "react";
import { useLanguageStore } from "@/src/stores/languageStore";

interface AdaptiveTextProps {
  fontSize: number;
  text: string;
  styles: StyleProp<TextStyle>;
  numerator?: number;
  denominator?: number;
}

const AdaptiveText: FC<AdaptiveTextProps> = ({ fontSize, text, styles, numerator = 4300, denominator = 0.7 }) => {
  const [currentFont, setCurrentFont] = useState(fontSize);
  const language = useLanguageStore(state => state.language);

  const adjustFontSize = () => {
    const lineBreaks = text.split("\n").length - 1;
    const newSize = numerator / (text.length * denominator + 28 * lineBreaks);
    console.log(text.length, newSize, lineBreaks);
    if (newSize < fontSize) {
      setCurrentFont(newSize);
    }
  };

  useEffect(() => {
    adjustFontSize();
  }, [text, language]);

  return <Text style={[styles, { fontSize: currentFont }]}>{text}</Text>;
};

export default AdaptiveText;
