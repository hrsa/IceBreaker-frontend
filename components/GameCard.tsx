import { Animated, Dimensions, Platform, Text, TouchableOpacity, Image, View } from "react-native";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Card, PreferenceAction } from "@/src/types/entities";
import { useCommonStyles } from "@/constants/Styles";
import * as Haptics from "expo-haptics";
import { State, PanGestureHandlerGestureEvent, PanGestureHandler } from "react-native-gesture-handler";
import useCardAnimations from "@/hooks/useCardAnimations";
import { useCardImages } from "@/hooks/useCardImages";
import { Ionicons } from "@expo/vector-icons";

interface GameCardProps {
  card: Card;
  updatePreference: (card: Card, action: PreferenceAction) => void;
  onFlipped?: (flipped: boolean) => void;
  onDragged?: (dragged: boolean) => void;
}

const SWIPE_THRESHOLD = 400;
const ROTATION_MAGNITUDE = 0.2;
const DRAG_THRESHOLD = 10;
const CARD_WIDTH = 450;
const CARD_HEIGHT = 300;
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isNarrowScreen = screenWidth < 600;
const isMobile = Platform.OS === "ios" || Platform.OS === "android";
const shouldRotateCard = isMobile && isNarrowScreen;

const GameCard: FC<GameCardProps> = ({ card, updatePreference, onFlipped, onDragged }) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { getCategoryImage } = useCardImages();
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const totalMovement = useRef(0);
  const styles = useCommonStyles();
  const { fadeAnim, pan, rotationAngle, scale, runEntranceAnimation, animateSwipeOut, animateSpringBack } = useCardAnimations();

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
    setFlipped(true);
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
      setFlipped(!flipped);
    }
  };

  const cardDimensions = shouldRotateCard
    ? { width: CARD_HEIGHT, height: CARD_WIDTH }
    : {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      };

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
          <View style={{ flex: 1 }}>
            {flipped ? (
              <View style={{ margin: "auto", position: "relative", flex: 1 }}>
                <Image
                  style={{
                    top: 25,
                    left: 0,
                    height: 60,
                    maxWidth: cardDimensions.width,
                    resizeMode: "center",
                    position: "absolute",
                    opacity: 0.25,
                  }}
                  source={getCategoryImage(card.category!.name_en)}
                />
                {card.cardPreference?.status === "loved" && (
                  <Ionicons
                    name={"heart"}
                    size={56}
                    color={"white"}
                    style={{
                      top: 5,
                      right: 10,
                      opacity: 0.5,
                      position: "absolute",
                    }}
                  />
                )}
                {card.cardPreference?.status === "archived" && (
                  <Ionicons
                    name={"archive"}
                    size={56}
                    color={"white"}
                    style={{
                      top: 5,
                      right: 10,
                      opacity: 0.5,
                      position: "absolute",
                    }}
                  />
                )}
                <Text
                  style={[
                    styles.subtitle,
                    {
                      padding: 12,
                      textAlign: "center",
                      marginVertical: "auto",
                      width: cardDimensions.width,
                    },
                  ]}
                >
                  {card.question_en}
                </Text>
              </View>
            ) : (
              <View style={{ margin: "auto" }}>
                <Image
                  style={{
                    height: cardDimensions.height * 0.5,
                    maxWidth: cardDimensions.width,
                    resizeMode: "center",
                  }}
                  source={getCategoryImage(card.category!.name_en)}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default GameCard;
