import { Dimensions, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useSharedValue, withTiming, withSpring, useAnimatedStyle, Easing, interpolate, runOnJS } from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type SwipeDirection = "left" | "right" | "up" | "down";

const ENTRANCE_ANIMATION_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const SPRING_BACK_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
  overshootClamping: false,
  restSpeedThreshold: 0.5,
  restDisplacementThreshold: 0.5,
};

const SWIPE_OUT_CONFIG = {
  damping: 12,
  stiffness: 150,
  mass: 1,
  overshootClamping: true,
  restSpeedThreshold: 100,
  restDisplacementThreshold: 100,
};

const triggerHapticFeedback = () => {
  if (Platform.OS === "web") return;

  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.log("Haptic feedback not available", error);
  }
};

export default function useCardAnimations() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotationAngle = useSharedValue(0);
  const fadeAnim = useSharedValue(1);
  const moveAnim = useSharedValue(0);

  const runEntranceAnimation = () => {
    fadeAnim.value = 0;
    moveAnim.value = 100;

    fadeAnim.value = withTiming(1, ENTRANCE_ANIMATION_CONFIG);
    moveAnim.value = withSpring(0, SPRING_BACK_CONFIG);
  };

  const animateSwipeOut = (direction: SwipeDirection, velocity: { x: number; y: number }, translationY: number, translationX: number) => {
    "worklet";
    let targetX = 0;
    let targetY = 0;

    switch (direction) {
      case "left":
        targetX = -SCREEN_WIDTH;
        targetY = translationY * 0.5;
        break;
      case "right":
        targetX = SCREEN_WIDTH;
        targetY = translationY * 0.5;
        break;
      case "up":
        targetX = translationX * 0.5;
        targetY = -SCREEN_HEIGHT;
        break;
      case "down":
        targetX = translationX * 0.5;
        targetY = SCREEN_HEIGHT;
        break;
    }

    runOnJS(triggerHapticFeedback)();

    translateX.value = withSpring(
      targetX,
      {
        ...SWIPE_OUT_CONFIG,
        velocity: velocity.x,
      },
      () => {
        translateX.value = 0;
        translateY.value = 0;
        rotationAngle.value = 0;
      }
    );
  };

  const animateSpringBack = () => {
    "worklet";
    translateX.value = withSpring(0, SPRING_BACK_CONFIG);
    translateY.value = withSpring(0, SPRING_BACK_CONFIG);
    rotationAngle.value = withSpring(0, SPRING_BACK_CONFIG);
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(Math.abs(translateX.value) + Math.abs(translateY.value), [0, 300], [1, 0.95], { extrapolateRight: "clamp" });

    return {
      opacity: fadeAnim.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotationAngle.value * 10}deg` },
        { scale },
      ],
    };
  });

  return {
    translateX,
    translateY,
    rotationAngle,
    cardAnimatedStyle,
    runEntranceAnimation,
    animateSwipeOut,
    animateSpringBack,
  };
}
