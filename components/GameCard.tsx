import { Platform, TouchableOpacity, Image, View } from "react-native";
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
import { useCardStyles } from "@/src/styles/Card";

interface GameCardProps {
  card: Card;
  updatePreference: (card: Card, action: PreferenceAction) => void;
  onFlipped?: (flipped: boolean) => void;
  onDragged?: (dragged: boolean) => void;
}

const SWIPE_THRESHOLD = config.isMobile ? 200 : 400;
const ROTATION_MAGNITUDE = 0.2;
const DRAG_THRESHOLD = 10;

const GameCard: FC<GameCardProps> = ({ card, updatePreference, onFlipped, onDragged }) => {
  const { getCategoryImage } = useCardImages();
  const getLocalizedQuestion = useLanguageStore(state => state.getLocalizedCardField(card, "question"));
  const getLocalizedCategoryName = useLanguageStore(state => state.getLocalizedCardField(card.category, "name"));
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const styles = useCardStyles();
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

  useEffect(() => {
    runEntranceAnimation();
    setFlipped(false);
  }, [card.id]);

  useEffect(() => {
    if (onFlipped) {
      onFlipped(flipped);
    }
  }, [flipped, onFlipped]);

  useEffect(() => {
    if (onDragged) {
      onDragged(isDragging);
    }
  }, [isDragging, onDragged]);

  const handleCardPress = () => {
    if (!isDragging) {
      setFlipped(!flipped);
    }
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
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      rotationAngle.value = (event.translationY / 200) * ROTATION_MAGNITUDE;

      const movement = Math.sqrt(event.translationX * event.translationX + event.translationY * event.translationY);

      if (movement > DRAG_THRESHOLD) {
        runOnJS(setIsDragging)(true);
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

      runOnJS(setTimeout)(() => {
        runOnJS(setIsDragging)(false);
      }, 50);
    })
    .onFinalize(() => {
      "worklet";
      runOnJS(setTimeout)(() => {
        runOnJS(setIsDragging)(false);
      }, 50);
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
                  <AdaptiveText text={getLocalizedQuestion} fontSize={28} styles={styles.cardText}></AdaptiveText>
                </View>
              </>
            ) : (
              <View style={styles.cardImageContainer}>
                <Image style={styles.cardImage} source={getCategoryImage(card.category!.id)} />
                <AdaptiveText
                  text={getLocalizedCategoryName}
                  fontSize={32}
                  numerator={1000}
                  denominator={0.75}
                  styles={styles.cardCategoryText}
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
