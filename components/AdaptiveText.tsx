import { StyleProp, Text, TextStyle } from "react-native";
import { FC } from "react";
import { estimateFontSize } from "@/src/helpers/adaptive-text";

interface AdaptiveTextProps {
  text: string;
  styles: StyleProp<TextStyle>;
  /** Preferred size for short text. */
  maxFontSize: number;
  /** Readability floor; longer text is truncated instead of shrinking further. */
  minFontSize: number;
  /** Maximum rendered lines before truncation. */
  maxLines: number;
  /** Available text width in logical pixels. */
  width: number;
  /** Average glyph advance / fontSize; ~0.55 Merriweather regular, ~0.65 bold uppercase. */
  glyphWidthRatio?: number;
}

/**
 * Sizes text down to fit a known width and line budget (see
 * `estimateFontSize`). Falls back to ellipsis at `minFontSize`, and caps OS
 * font scaling so user accessibility settings cannot break the fit.
 */
const AdaptiveText: FC<AdaptiveTextProps> = ({ text, styles, maxFontSize, minFontSize, maxLines, width, glyphWidthRatio }) => {
  const fontSize = estimateFontSize(text, { width, maxFontSize, minFontSize, maxLines, glyphWidthRatio });

  return (
    <Text style={[styles, { fontSize }]} numberOfLines={maxLines} ellipsizeMode="tail" maxFontSizeMultiplier={1.3}>
      {text}
    </Text>
  );
};

export default AdaptiveText;
