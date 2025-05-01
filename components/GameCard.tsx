import { Animated, Dimensions, Platform, Text, TouchableOpacity, View } from "react-native";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Card, PreferenceAction } from "@/src/types/entities";
import { useCommonStyles } from "@/constants/Styles";
import * as Haptics from "expo-haptics";
import { State, PanGestureHandlerGestureEvent, PanGestureHandler } from "react-native-gesture-handler";
import useCardAnimations from "@/hooks/useCardAnimations";

interface GameCardProps {
  card: Card;
  updatePreference: (card: Card, action: PreferenceAction) => void;
}

const SWIPE_THRESHOLD = 400;
const ROTATION_MAGNITUDE = 0.2;
const DRAG_THRESHOLD = 10;
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isNarrowScreen = screenWidth < 600;
const isMobile = Platform.OS === "ios" || Platform.OS === "android";
const shouldRotateCard = isMobile && isNarrowScreen;

const GameCard: FC<GameCardProps> = ({ card, updatePreference }) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const totalMovement = useRef(0);
  const styles = useCommonStyles();
  const { fadeAnim, pan, rotationAngle, scale, runEntranceAnimation, animateSwipeOut, animateSpringBack } = useCardAnimations();
  const handleUpdatePreference = () => {
    if (open) {
      updatePreference(card, "archive");
    } else {
      updatePreference(card, "reactivate");
    }
  };

  useEffect(() => {
    runEntranceAnimation();
    setOpen(false);
  }, [card.id]);

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationX, translationY } = event.nativeEvent;

    pan.x.setValue(translationX);
    pan.y.setValue(translationY);

    const calculatedRotation = (translationY / 200) * ROTATION_MAGNITUDE;
    rotationAngle.setValue(calculatedRotation);

    const movement = Math.sqrt(translationX * translationX + translationY * translationY);
    totalMovement.current = movement;

    if (movement > DRAG_THRESHOLD) {
      setIsDragging(true);
    }
  };

  const handleStateChange = (event: PanGestureHandlerGestureEvent) => {
    const { state, translationX, translationY, velocityX, velocityY } = event.nativeEvent;

    if (state === State.END) {
      const isHorizontal = Math.abs(translationX) > Math.abs(translationY);
      const swipeVelocity = { x: velocityX || 1000, y: velocityY || 0 };

      if (isHorizontal && Math.abs(translationX) > SWIPE_THRESHOLD) {
        const direction = translationX > 0 ? "right" : "left";
        animateSwipeOut(direction, swipeVelocity, translationY, translationX, handleUpdatePreference);
      } else if (!isHorizontal && Math.abs(translationY) > SWIPE_THRESHOLD) {
        const direction = translationY > 0 ? "down" : "up";
        animateSwipeOut(direction, swipeVelocity, translationY, translationX, handleUpdatePreference);
      } else {
        animateSpringBack();
      }
      setTimeout(() => {
        setIsDragging(false);
        totalMovement.current = 0;
      }, 50);
    }

    if (state === State.BEGAN && Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    if (state === State.CANCELLED || state === State.FAILED) {
      setIsDragging(false);
      totalMovement.current = 0;
    }
  };

  const handleCardPress = () => {
    if (!isDragging && totalMovement.current < DRAG_THRESHOLD) {
      setOpen(!open);
    }
  };

  const cardDimensions = shouldRotateCard ? { width: 300, height: 450 } : { width: 450, height: 300 };

  const cardAnimatedStyle = useMemo(
    () => ({
      opacity: fadeAnim,
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { scale },
        {
          rotateZ: rotationAngle.interpolate({
            inputRange: [-0.1, 0, 0.1],
            outputRange: ["-10deg", "0deg", "10deg"],
          }),
        },
      ],
    }),
    [fadeAnim, pan, scale, rotationAngle]
  );

  return (
    <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleStateChange}>
      <Animated.View
        style={[
          cardDimensions,
          {
            borderWidth: 1,
            borderColor: "#FFFFFF",
            borderRadius: 12,
            marginVertical: 25,
            marginHorizontal: 30,
            backgroundColor: "purple",
          },
          cardAnimatedStyle,
        ]}
      >
        <TouchableOpacity onPress={handleCardPress} style={{ width: "100%", height: "100%" }}>
          <View style={{ padding: 12, flex: 1 }}>
            {open ? (
              <Text
                style={[
                  styles.title,
                  {
                    textAlign: "center",
                    marginVertical: "auto",
                  },
                ]}
              >
                {card.question_en}
              </Text>
            ) : (
              <Text>Open card ...</Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default GameCard;
