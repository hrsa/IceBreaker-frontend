import React, { useEffect, useRef, useState } from "react";
import { Text, View, Switch, Animated } from "react-native";
import { useCommonStyles } from "@/constants/Styles";
import { Card, PreferenceAction } from "@/src/types/entities";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/src/stores/gameStore";
import { useRootNavigationState, useRouter } from "expo-router";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import GameCard from "@/components/GameCard";
import { getStatusFromAction } from "@/src/helpers/card-status-action";
import { Ionicons } from "@expo/vector-icons";
import Modal from "@/components/Modal";

export default function GameScreen() {
  const styles = useCommonStyles();
  const gameStore = useGameStore();
  const { getRandomCards, cards, hasViewedAllCards, categories, profile, getFirstCard, updateCardPreference } = gameStore;
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [lastCard, setLastCard] = useState<Card | null>(null);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [includeLoved, setIncludeLoved] = useState<boolean>(true);
  const [showNoCardsModal, setShowNoCardsModal] = useState<boolean>(false);
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsPointerEvents = isDragging || !cardFlipped ? "none" : "auto";

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (!profile) router.push("/profiles");
    if (profile && !categories) router.push("/categories");
    const firstCard = getFirstCard();
    setCurrentCard(firstCard);

    if (!firstCard || hasViewedAllCards) {
      setShowNoCardsModal(true);
    }
  }, [rootNavigationState?.key]);

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
    Animated.timing(buttonsOpacity, {
      toValue: isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCardDragged = (dragging: boolean) => {
    setIsDragging(dragging);
    if (cardFlipped) {
      Animated.timing(buttonsOpacity, {
        toValue: dragging ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
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
    console.log("Updated card:", card, action);
    setCurrentCard(getFirstCard());
  };

  const moreCards = async () => {
    await getRandomCards(3, includeArchived);
    setCurrentCard(getFirstCard());
  };

  return (
    <SafeAreaView style={[styles.container, { alignItems: "center", flex: 1 }]}>
      <View style={{}}>
        {gameStore.isLoading && <Loading />}
        {gameStore.error && <Text style={styles.errorText}>{gameStore.error}</Text>}
        <Text style={styles.subtitle}>wagabuga</Text>
        {currentCard ? (
          <>
            <GameCard
              card={currentCard}
              updatePreference={handleCardPreference}
              onFlipped={handleCardFlipped}
              onDragged={handleCardDragged}
            />
            <Animated.View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 25,
                opacity: buttonsOpacity,
                minHeight: 60,
                gap: 30,
              }}
              pointerEvents={buttonsPointerEvents}
            >
              {lastCard && lastCard.id !== currentCard.id && (
                <Button
                  text=""
                  buttonStyle={{ backgroundColor: "#2739bc", borderRadius: 999, padding: 20 }}
                  iconSize={45}
                  icon={"arrow-undo"}
                  onPress={() => setCurrentCard(lastCard)}
                />
              )}
              {currentCard?.cardPreference?.status !== "loved" ? (
                <Button
                  text=""
                  buttonStyle={{ backgroundColor: "#F06292", borderRadius: 999, padding: 20 }}
                  iconSize={45}
                  icon={"heart"}
                  onPress={() => handleCardPreference(currentCard, "love")}
                />
              ) : (
                <Button
                  text=""
                  buttonStyle={{ backgroundColor: "#F06292", borderRadius: 999, padding: 20 }}
                  iconSize={45}
                  icon={"heart-dislike"}
                  onPress={() => handleCardPreference(currentCard, "reactivate")}
                />
              )}
              <Button
                text=""
                buttonStyle={{ backgroundColor: "#D32F2F", borderRadius: 999, padding: 20 }}
                iconSize={45}
                icon={"ban"}
                onPress={() => handleCardPreference(currentCard, "ban")}
              />
            </Animated.View>
          </>
        ) : (
          <Text style={styles.text}>No cards left!</Text>
        )}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginTop: 35,
            marginHorizontal: "auto",
          }}
        >
          <Switch
            value={includeArchived}
            onValueChange={() => setIncludeArchived(!includeArchived)}
            trackColor={{ false: styles.text.color, true: "green" }}
            style={{ margin: "auto", alignSelf: "center", marginRight: 10 }}
          />
          <Ionicons name={"archive"} color={includeArchived ? "green" : styles.text.color} size={42} />

          <Switch
            value={includeLoved}
            onValueChange={() => setIncludeLoved(!includeLoved)}
            trackColor={{ false: styles.text.color, true: "#F06292" }}
            style={{ margin: "auto", alignSelf: "center", marginRight: 10, marginLeft: 40 }}
          />
          <Ionicons name={"heart"} color={includeLoved ? "#F06292" : styles.text.color} size={42} />
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
        <Text style={[styles.text, { textAlign: "center", marginBottom: 10 }]}>You've gone through all available cards!</Text>
        <Text style={[styles.text, { textAlign: "center" }]}>
          Try changing your filters to include archived or favourite cards - or come back later for more.
        </Text>
      </Modal>
    </SafeAreaView>
  );
}
