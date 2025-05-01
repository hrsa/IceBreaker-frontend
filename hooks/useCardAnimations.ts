import { Animated, Dimensions, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useRef } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type SwipeDirection = "left" | "right" | "up" | "down";

const SWIPE_OUT_CONFIG = {
  friction: 5,
  tension: 40,
  restSpeedThreshold: 100,
  restDisplacementThreshold: 100,
  useNativeDriver: true,
  overshootClamping: true,
};

const SPRING_BACK_CONFIG = {
  friction: 6,
  tension: 60,
  velocity: 3,
  useNativeDriver: true,
};

const ENTRANCE_ANIMATION_CONFIG = {
  duration: 300,
  useNativeDriver: true,
};

const triggerHapticFeedback = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(style);
  }
};

const useCardAnimations = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(100)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const rotationAngle = useRef(new Animated.Value(0)).current;

  const scale = Animated.add(
    pan.x.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    }),
    pan.y.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: [0.9, 0, 0.9],
      extrapolate: "clamp",
    })
  ).interpolate({
    inputRange: [0.9, 1, 1.9],
    outputRange: [0.95, 1, 0.95],
  });

  const runEntranceAnimation = () => {
    fadeAnim.setValue(0);
    moveAnim.setValue(100);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        ...ENTRANCE_ANIMATION_CONFIG,
      }),
      Animated.spring(moveAnim, {
        toValue: 0,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateSwipeOut = (
    direction: SwipeDirection,
    velocity: { x: number; y: number },
    translationY: number,
    translationX: number,
    onComplete?: (direction: SwipeDirection) => void
  ) => {
    let toValue = { x: 0, y: 0 };

    switch (direction) {
      case "left":
        toValue = { x: -SCREEN_WIDTH, y: translationY * 0.5 };
        break;
      case "right":
        toValue = { x: SCREEN_WIDTH, y: translationY * 0.5 };
        break;
      case "up":
        toValue = { x: translationX * 0.5, y: -SCREEN_HEIGHT };
        break;
      case "down":
        toValue = { x: translationX * 0.5, y: SCREEN_HEIGHT };
        break;
    }

    triggerHapticFeedback();

    Animated.spring(pan, {
      toValue,
      velocity,
      ...SWIPE_OUT_CONFIG,
    }).start(() => {
      if (onComplete) onComplete(direction);
      pan.setValue({ x: 0, y: 0 });
      rotationAngle.setValue(0);
    });
  };

  const animateSpringBack = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        ...SPRING_BACK_CONFIG,
      }),
      Animated.spring(rotationAngle, {
        toValue: 0,
        ...SPRING_BACK_CONFIG,
      }),
    ]).start();
  };

  return {
    fadeAnim,
    moveAnim,
    pan,
    rotationAngle,
    scale,
    runEntranceAnimation,
    animateSwipeOut,
    animateSpringBack,
  };
};

export default useCardAnimations;
