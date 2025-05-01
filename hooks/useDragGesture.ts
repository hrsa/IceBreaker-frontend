import { useRef, useState } from "react";
import { Animated, Dimensions, Platform } from "react-native";
import { PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

// Constants
const DRAG_THRESHOLD = 10;
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

  const panValue = useRef(new Animated.ValueXY()).current;
  const trashZoneOpacity = useRef(new Animated.Value(0)).current;

  const totalMovement = useRef(0);

  const toggleTrashZone = (show: boolean) => {
    setShowTrashZone(show);
    Animated.timing(trashZoneOpacity, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePanGestureEvent = Animated.event([{ nativeEvent: { translationX: panValue.x, translationY: panValue.y } }], {
    useNativeDriver: false,
    listener: (event: PanGestureHandlerGestureEvent) => {
      const { translationX, translationY } = event.nativeEvent;

      // Calculate total movement distance
      const movement = Math.sqrt(translationX * translationX + translationY * translationY);
      totalMovement.current = movement;

      // If moved more than threshold, consider it dragging
      if (movement > DRAG_THRESHOLD && !isDragging) {
        setIsDragging(true);
      }
    },
  });

  const handleStateChange = (event: PanGestureHandlerGestureEvent, index: number) => {
    const { state, absoluteY } = event.nativeEvent;

    if (state === State.BEGAN) {
      setDraggingIndex(index);
      toggleTrashZone(true);
      if (onDragStart) onDragStart();
      triggerHaptic("impact", { style: Haptics.ImpactFeedbackStyle.Light });
    } else if (state === State.END) {
      const isInTrashZone = showTrashZone && absoluteY > height - trashZoneHeight - 100;

      if (isInTrashZone && draggingIndex !== null) {
        if (onDelete) onDelete(draggingIndex);
        triggerHaptic("impact", { style: Haptics.ImpactFeedbackStyle.Heavy });
      }

      resetGestureState();
    } else if (state === State.FAILED || state === State.CANCELLED) {
      resetGestureState();
    }
  };

  const resetGestureState = () => {
    setTimeout(() => {
      setIsDragging(false);
      totalMovement.current = 0;
    }, 50);

    setDraggingIndex(null);
    toggleTrashZone(false);
    panValue.setValue({ x: 0, y: 0 });
    if (onDragEnd) onDragEnd();
  };

  const canItemBeClicked = () => {
    return !isDragging && totalMovement.current < DRAG_THRESHOLD;
  };

  return {
    isDragging,
    draggingIndex,
    showTrashZone,
    panValue,
    trashZoneOpacity,
    handlePanGestureEvent,
    handleStateChange,
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
