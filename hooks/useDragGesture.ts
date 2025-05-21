import { useState } from "react";
import { Dimensions, Platform } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

// Constants
const DRAG_THRESHOLD = 10;
const LONG_PRESS_DURATION = 500;
const { height } = Dimensions.get("window");

interface UseDragGestureProps {
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDelete?: (index: number) => void;
  trashZoneHeight: number;
}

export const useDragGesture = ({ onDragStart, onDragEnd, onDelete, trashZoneHeight }: UseDragGestureProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showTrashZone, setShowTrashZone] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const trashZoneOpacity = useSharedValue(0);
  const totalMovement = useSharedValue(0);
  const isDraggable = useSharedValue(false);

  const toggleTrashZone = (show: boolean) => {
    setShowTrashZone(show);
    trashZoneOpacity.value = withTiming(show ? 1 : 0, { duration: 300 });
  };

  const handleDragStart = (index: number) => {
    triggerHaptic("impact", { style: Haptics.ImpactFeedbackStyle.Medium });
    setDraggingIndex(index);
    toggleTrashZone(true);
    if (onDragStart) onDragStart();
  };

  const createGesture = (index: number) => {
    const longPressGesture = Gesture.LongPress()
      .minDuration(LONG_PRESS_DURATION)
      .onStart(() => {
        "worklet";
        isDraggable.value = true;
        runOnJS(handleDragStart)(index);
      });

    const panGesture = Gesture.Pan()
      .manualActivation(true)
      .onTouchesMove((_, state) => {
        "worklet";
        if (isDraggable.get()) {
          state.activate();
        } else {
          state.fail();
        }
      })
      .onChange(event => {
        "worklet";
        translateX.value = event.translationX;
        translateY.value = event.translationY;

        totalMovement.value = Math.sqrt(event.translationX * event.translationX + event.translationY * event.translationY);
        runOnJS(setIsDragging)(true);
      })
      .onEnd(event => {
        "worklet";
        const isInTrashZone = event.absoluteY > height - trashZoneHeight + 100;
        if (isInTrashZone && draggingIndex !== null && onDelete) {
          runOnJS(onDelete)(draggingIndex);
          runOnJS(triggerHaptic)("impact", { style: Haptics.ImpactFeedbackStyle.Heavy });
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }

        runOnJS(resetGestureState)();
      })
      .onFinalize(() => {
        "worklet";
        runOnJS(resetGestureState)();
      });

    return Gesture.Race(Gesture.Simultaneous(longPressGesture, panGesture), Gesture.Tap());
  };

  const resetGestureState = () => {
    isDraggable.value = false;
    setTimeout(() => {
      setIsDragging(false);
      totalMovement.value = 0;
      setDraggingIndex(null);
      toggleTrashZone(false);
    }, 50);

    if (onDragEnd) onDragEnd();
  };

  const canItemBeClicked = () => {
    return !isDragging && totalMovement.value < DRAG_THRESHOLD;
  };

  const getGestureHandlerProps = (index: number) => {
    return {
      gesture: createGesture(index),
    };
  };

  const trashZoneAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: trashZoneOpacity.value,
      transform: [
        {
          translateY: (1 - trashZoneOpacity.value) * trashZoneHeight,
        },
      ],
    };
  });

  return {
    isDragging,
    draggingIndex,
    showTrashZone,
    translateX,
    translateY,
    trashZoneOpacity,
    trashZoneAnimatedStyle,
    getGestureHandlerProps,
    canItemBeClicked,
  };
};

export const triggerHaptic = (
  type: "impact" | "notification" | "selection",
  options?: { style?: Haptics.ImpactFeedbackStyle; type?: Haptics.NotificationFeedbackType }
) => {
  if (Platform.OS === "web") {
    return;
  }

  try {
    if (type === "impact" && options?.style) {
      Haptics.impactAsync(options.style);
    } else if (type === "notification" && options?.type) {
      Haptics.notificationAsync(options.type);
    } else if (type === "selection") {
      Haptics.selectionAsync();
    }
  } catch (error) {
    console.log("Haptic feedback not available", error);
  }
};
