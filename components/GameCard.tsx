import { Platform, TouchableOpacity, Image, View, Dimensions } from "react-native";
import { FC, useEffect, useState } from "react";
import { Card, PreferenceAction } from "@/src/types/entities";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useCardAnimations from "@/hooks/useCardAnimations";
import { useCardImages } from "@/hooks/useCardImages";
import { Ionicons } from "@expo/vector-icons";
import config from "@/src/config/config";
import { useLanguageStore } from "@/src/stores/languageStore";
import AdaptiveText from "./AdaptiveText";
import Animated, { runOnJS } from "react-native-reanimated";
import { getCardDimensions, useCardStyles } from "@/src/styles/Card";

interface GameCardProps {
  card: Card;
  updatePreference: (card: Card, action: PreferenceAction) => void;
  onFlipped?: (flipped: boolean) => void;
  onDragged?: (dragged: boolean) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const isNarrowScreen = screenWidth < 600;
const shouldRotateCard = config.isMobile || isNarrowScreen;
const SWIPE_THRESHOLD = shouldRotateCard ? 200 : 400;
const ROTATION_MAGNITUDE = 0.2;
const DRAG_THRESHOLD = 10;

// Card text constraints. The question shrinks to a readable floor; anything
// that still overflows the card window at that size flows vertically
// (credits mode) instead of truncating.
const QUESTION_FONT_SIZE = 26;
const QUESTION_MIN_FONT_SIZE = 20;
// Measured on device: rendered Merriweather averages ~0.8x the font size.
const QUESTION_GLYPH_RATIO = 0.8;
const LINE_HEIGHT_RATIO = 1.3;
const CATEGORY_FONT_SIZE = 32;
const CATEGORY_MIN_FONT_SIZE = 18;

const GameCard: FC<GameCardProps> = ({ card, updatePreference, onFlipped, onDragged }) => {
  const { getCategoryImage } = useCardImages();
  const getLocalizedQuestion = useLanguageStore(state => state.getLocalizedCardField(card, "question"));
  const getLocalizedCategoryName = useLanguageStore(state => state.getLocalizedCardField(card.category, "name"));
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const styles = useCardStyles();
  const cardDimensions = getCardDimensions();
  const questionWindow = cardDimensions.height * 0.8;
  // Line budget at the preferred size; the estimate scales the font down to
  // fit this budget before the credits flow takes over.
  const questionLineBudget = Math.floor((questionWindow * 0.9) / (QUESTION_FONT_SIZE * LINE_HEIGHT_RATIO));
  const { translateX, translateY, rotationAngle, cardAnimatedStyle, runEntranceAnimation, animateSwipeOut, animateSpringBack } =
    useCardAnimations();

  const handleUpdatePreference = () => {
    if (card.cardPreference?.status === "loved") {
      updatePreference(card, "love");
      return;
    }

    if (flipped) {
      updatePreference(card, "archive");
    } else {
      updatePreference(card, "reactivate");
    }
  };

  // The parent remounts this component per card via `key={card.id}`, so a
  // mount-only entrance animation is enough; there is nothing to reset.
  useEffect(() => {
    runEntranceAnimation();
  }, []);

  const updateDragging = (dragging: boolean) => {
    setIsDragging(dragging);
    onDragged?.(dragging);
  };

  const handleCardPress = () => {
    if (isDragging) return;
    const nextFlipped = !flipped;
    setFlipped(nextFlipped);
    onFlipped?.(nextFlipped);
  };

  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      "worklet";
      runOnJS(triggerHaptic)();
    })
    .onChange(event => {
      "worklet";
      // SharedValue assignment is the documented Reanimated worklet API.
      // eslint-disable-next-line react-hooks/immutability
      translateX.value = event.translationX;
      // eslint-disable-next-line react-hooks/immutability
      translateY.value = event.translationY;

      // eslint-disable-next-line react-hooks/immutability
      rotationAngle.value = (event.translationY / 200) * ROTATION_MAGNITUDE;

      const movement = Math.sqrt(event.translationX * event.translationX + event.translationY * event.translationY);

      if (movement > DRAG_THRESHOLD) {
        runOnJS(updateDragging)(true);
      }
    })
    .onEnd(event => {
      "worklet";
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      const swipeVelocity = {
        x: event.velocityX || 1000,
        y: event.velocityY || 0,
      };

      if (isHorizontal && Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? "right" : "left";
        animateSwipeOut(direction, swipeVelocity, event.translationY, event.translationX);
        runOnJS(handleUpdatePreference)();
      } else if (!isHorizontal && Math.abs(event.translationY) > SWIPE_THRESHOLD) {
        const direction = event.translationY > 0 ? "down" : "up";
        animateSwipeOut(direction, swipeVelocity, event.translationY, event.translationX);
        runOnJS(handleUpdatePreference)();
      } else {
        animateSpringBack();
      }

      runOnJS(updateDragging)(false);
    })
    .onFinalize(() => {
      "worklet";
      runOnJS(updateDragging)(false);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        <TouchableOpacity onPress={handleCardPress} style={{ width: "100%", height: "100%" }}>
          <View style={styles.card}>
            {flipped ? (
              <>
                <View style={styles.cardFlippedContent}>
                  {card.cardPreference?.status === "loved" && (
                    <Ionicons name={"heart"} size={60} color={"white"} style={styles.cardStatusBadge} />
                  )}
                  {card.cardPreference?.status === "archived" && (
                    <Ionicons name={"archive"} size={56} color={"white"} style={styles.cardStatusBadge} />
                  )}
                </View>
                <View style={styles.cardTextContainer}>
                  <AdaptiveText
                    text={getLocalizedQuestion}
                    styles={styles.cardText}
                    maxFontSize={QUESTION_FONT_SIZE}
                    minFontSize={QUESTION_MIN_FONT_SIZE}
                    maxLines={questionLineBudget}
                    glyphWidthRatio={QUESTION_GLYPH_RATIO}
                    width={cardDimensions.width * 0.95}
                    height={questionWindow}
                    overflow="credits"
                  ></AdaptiveText>
                </View>
              </>
            ) : (
              <View style={styles.cardImageContainer}>
                <Image style={styles.cardImage} source={getCategoryImage(card.category!.id)} />
                <AdaptiveText
                  text={getLocalizedCategoryName}
                  styles={styles.cardCategoryText}
                  maxFontSize={CATEGORY_FONT_SIZE}
                  minFontSize={CATEGORY_MIN_FONT_SIZE}
                  maxLines={2}
                  width={cardDimensions.width - 40}
                  glyphWidthRatio={0.6}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default GameCard;
