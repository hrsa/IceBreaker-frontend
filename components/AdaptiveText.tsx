import { StyleProp, Text, TextStyle, View } from "react-native";
import { FC, useEffect, useState } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { estimateFontSize } from "@/src/helpers/adaptive-text";

interface AdaptiveTextProps {
  text: string;
  styles: StyleProp<TextStyle>;
  /** Preferred size for short text; in credits mode this is always the render size. */
  maxFontSize: number;
  /** Readability floor for truncate mode (text never renders smaller). */
  minFontSize?: number;
  /** Maximum rendered lines before truncation (truncate mode). */
  maxLines?: number;
  /** Available text width in logical pixels. */
  width: number;
  /** Height of the clipping window for overflow="credits". */
  height?: number;
  /** What happens when the text does not fit the window. */
  overflow?: "truncate" | "credits";
  /** Average glyph advance / fontSize; ~0.55 Merriweather regular, ~0.65 bold uppercase. */
  glyphWidthRatio?: number;
  /** Credits scroll speed in px per second. */
  scrollSpeedPxPerSec?: number;
}

const SCROLL_START_HOLD_MS = 1000;
const SCROLL_END_HOLD_MS = 1500;

/**
 * Sizes text to fit a known width and line budget (see `estimateFontSize`).
 *
 * - truncate mode: shrinks down to `minFontSize`, then ellipsizes at
 *   `maxLines`.
 * - credits mode: shrinks down to `minFontSize` (readable floor) first;
 *   if the measured text is still taller than `height` at that size, it
 *   flows vertically inside a clipped window like movie end titles: hold,
 *   linear scroll, hold, restart.
 */
const AdaptiveText: FC<AdaptiveTextProps> = ({
  text,
  styles,
  maxFontSize,
  minFontSize = maxFontSize,
  maxLines = 2,
  width,
  height,
  overflow = "truncate",
  glyphWidthRatio,
  scrollSpeedPxPerSec = 25,
}) => {
  const fontSize = estimateFontSize(text, { width, maxFontSize, minFontSize, maxLines, glyphWidthRatio });

  const [contentHeight, setContentHeight] = useState(0);
  const translateY = useSharedValue(0);

  const canScroll = overflow === "credits" && height != null && contentHeight > height;
  const distance = Math.max(0, contentHeight - (height ?? 0));

  useEffect(() => {
    if (!canScroll) {
      translateY.value = 0;
      return;
    }

    const scrollDuration = (distance / scrollSpeedPxPerSec) * 1000;

    translateY.value = withRepeat(
      withSequence(
        withDelay(SCROLL_START_HOLD_MS, withTiming(-distance, { duration: scrollDuration, easing: Easing.linear })),
        withDelay(SCROLL_END_HOLD_MS, withTiming(0, { duration: 1 }))
      ),
      -1
    );
  }, [canScroll, distance, scrollSpeedPxPerSec, translateY]);

  const scrollStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (overflow === "credits" && height != null) {
    return (
      <View style={{ height, overflow: "hidden", justifyContent: canScroll ? "flex-start" : "center" }}>
        <Animated.View style={scrollStyle} onLayout={event => setContentHeight(event.nativeEvent.layout.height)}>
          <Text style={[styles, { fontSize }]} maxFontSizeMultiplier={1.3}>
            {text}
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <Text
      style={[styles, { fontSize }]}
      numberOfLines={maxLines}
      ellipsizeMode="tail"
      maxFontSizeMultiplier={1.3}
    >
      {text}
    </Text>
  );
};

export default AdaptiveText;
