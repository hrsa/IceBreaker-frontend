import React, { useEffect, useState } from "react";
import { Text, View, Switch, Image, TouchableOpacity, Dimensions } from "react-native";
import { Card, PreferenceAction } from "@/src/types/entities";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/src/stores/gameStore";
import { useFocusEffect, useRouter } from "expo-router";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import GameCard from "@/components/GameCard";
import { getStatusFromAction } from "@/src/helpers/card-status-action";
import { Ionicons } from "@expo/vector-icons";
import Modal from "@/components/Modal";
import config from "@/src/config/config";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useLanguageImages } from "@/hooks/useLanguageImages";
import { useStepStore } from "@/src/stores/stepStore";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useGameStyles } from "@/src/styles/Game";

export default function GameScreen() {
  const language = useLanguageStore(state => state.language);
  const t = useLanguageStore(state => state.t);
  const switchLanguage = useLanguageStore(state => state.switchLanguage);
  const styles = useGameStyles();
  const setStep = useStepStore(state => state.setStep);
  const gameStore = useGameStore();
  const cards = useGameStore(state => state.cards);
  const hasViewedAllCards = useGameStore(state => state.hasViewedAllCards);
  const categories = useGameStore(state => state.categories);
  const profile = useGameStore(state => state.profile);
  const { width: screenWidth } = Dimensions.get("window");
  const isNarrowScreen = screenWidth < 600;
  const shouldRotateCard = config.isMobile || isNarrowScreen;
  const { getRandomCards, getFirstCard, updateCardPreference, resetGame } = gameStore;
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [lastCard, setLastCard] = useState<Card | null>(null);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [includeLoved, setIncludeLoved] = useState<boolean>(true);
  const [showNoCardsModal, setShowNoCardsModal] = useState<boolean>(false);
  const { getLanguageImage } = useLanguageImages();
  const router = useRouter();
  const buttonsOpacity = useSharedValue(0);
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonsOpacity.value,
    };
  });

  const buttonsPointerEvents = isDragging || !cardFlipped ? "none" : "auto";

  useEffect(() => {
    setStep("game");
    if (!profile) router.push("/profiles");
    if (profile && !categories) router.push("/categories");
    resetGame().then(() => {
      const firstCard = getFirstCard();
      setCurrentCard(firstCard);

      if (!firstCard || hasViewedAllCards) {
        setShowNoCardsModal(true);
      }
    });
  }, [profile, categories]);

  useFocusEffect(() => {
    setStep("game");
  });

  useEffect(() => {
    const getCards = async () => await getRandomCards(3, includeArchived, includeLoved);

    if (!cards) return;
    let currentLength = cards.length;
    if (currentLength < 3) {
      getCards();
    }

    if (cards.length <= currentLength) return;
  }, [cards, includeArchived, includeLoved]);

  const handleCardFlipped = (isFlipped: boolean) => {
    setCardFlipped(isFlipped);
    buttonsOpacity.value = withTiming(isFlipped ? 1 : 0, { duration: 300 });
  };

  const handleCardDragged = (dragging: boolean) => {
    setIsDragging(dragging);
    if (cardFlipped) {
      buttonsOpacity.value = withTiming(dragging ? 0 : 1, { duration: 150 });
    }
  };

  const handleCardPreference = async (card: Card | null, action: PreferenceAction) => {
    if (!card) return;
    await updateCardPreference(card, action);
    if (card.cardPreference) {
      card.cardPreference.status = getStatusFromAction(action);
    } else {
      card.cardPreference = {
        cardId: card.id,
        status: getStatusFromAction(action),
        profileId: profile!.id,
        lastInteractionAt: new Date(),
        id: "temporaryid",
      };
    }
    setLastCard(card);
    setCurrentCard(getFirstCard());
  };

  const moreCards = async () => {
    await getRandomCards(3, includeArchived);
    setCurrentCard(getFirstCard());
  };

  return (
    <SafeAreaView style={[styles.container, styles.centerContent]}>
      <View style={[styles.container, styles.centerContent]}>
        {gameStore.isLoading && !currentCard && <Loading />}
        {gameStore.error && <Text style={styles.errorText}>{gameStore.error}</Text>}
        {currentCard ? (
          <>
            <GameCard
              key={currentCard.id}
              card={currentCard}
              updatePreference={handleCardPreference}
              onFlipped={handleCardFlipped}
              onDragged={handleCardDragged}
            />
            <Animated.View style={styles.gameButtonsContainer}>
              {lastCard && lastCard.id !== currentCard.id && (
                <Animated.View style={[buttonsAnimatedStyle, { pointerEvents: buttonsPointerEvents }]}>
                  <Button
                    text=""
                    buttonStyle={styles.undoButton}
                    iconSize={45}
                    icon={"arrow-undo"}
                    onPress={() => setCurrentCard(lastCard)}
                  />
                </Animated.View>
              )}
              <View style={{}}>
                <TouchableOpacity onPress={switchLanguage}>
                  <Image source={getLanguageImage(language)} style={styles.languageButton}></Image>
                </TouchableOpacity>
              </View>
              {currentCard?.cardPreference?.status !== "loved" ? (
                <Animated.View style={[buttonsAnimatedStyle, { pointerEvents: buttonsPointerEvents }]}>
                  <Button
                    text=""
                    buttonStyle={styles.loveButton}
                    iconSize={45}
                    icon={"heart"}
                    onPress={() => handleCardPreference(currentCard, "love")}
                  />
                </Animated.View>
              ) : (
                <Animated.View style={[buttonsAnimatedStyle, { pointerEvents: buttonsPointerEvents }]}>
                  <Button
                    text=""
                    buttonStyle={styles.loveButton}
                    iconSize={45}
                    icon={"heart-dislike"}
                    onPress={() => handleCardPreference(currentCard, "reactivate")}
                  />
                </Animated.View>
              )}
            </Animated.View>
          </>
        ) : (
          <Text style={styles.text}>No cards left!</Text>
        )}
        <View style={styles.gameSwitchesContainer}>
          <View style={styles.switchContainer}>
            <Switch
              value={includeArchived}
              onValueChange={() => setIncludeArchived(!includeArchived)}
              trackColor={{ false: styles.text.color, true: "green" }}
              style={styles.switch}
            />
            <Ionicons name={"archive"} color={includeArchived ? "green" : styles.text.color} size={42} />
          </View>

          <View
            style={{
              ...styles.switchContainer,
              marginLeft: shouldRotateCard ? 0 : 40,
            }}
          >
            <Switch
              value={includeLoved}
              onValueChange={() => setIncludeLoved(!includeLoved)}
              trackColor={{ false: styles.text.color, true: "#F06292" }}
              style={styles.switch}
            />
            <Ionicons name={"heart"} color={includeLoved ? "#F06292" : styles.text.color} size={42} />
          </View>
        </View>
      </View>
      <Modal
        isVisible={showNoCardsModal}
        onDismiss={() => setShowNoCardsModal(false)}
        title={"No more new cards left!"}
        buttons={
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
              text="Try Different Filters"
              onPress={() => {
                setIncludeArchived(!includeArchived);
                moreCards();
              }}
              buttonStyle={{ marginRight: 10, backgroundColor: "#4CAF50" }}
            />
            <Button text="Close" onPress={() => setShowNoCardsModal(false)} buttonStyle={{ backgroundColor: "#F06292" }} />
          </View>
        }
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Ionicons name="alert-circle-outline" size={50} color="#F06292" />
        </View>
        <Text style={[styles.modalText, { textAlign: "center", marginBottom: 10 }]}>{t("game:no_more_cards")}</Text>
        <Text style={[styles.modalText, { textAlign: "center" }]}>{t("game:change_filters")}</Text>
      </Modal>
    </SafeAreaView>
  );
}
