import { useCategoryStore } from "@/src/stores/categoryStore";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  View,
  useWindowDimensions,
  ScrollView,
  SwitchComponent,
  Switch,
} from "react-native";
import { useCommonStyles } from "@/constants/Styles";
import { Card, Category, PreferenceAction } from "@/src/types/entities";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useGameStore } from "@/src/stores/gameStore";
import { useRootNavigationState, useRouter } from "expo-router";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import GameCard from "@/components/GameCard";

const categoryImages: Record<string, any> = {
  work: require("../../assets/images/work.png"),
  family: require("../../assets/images/family.png"),
};

const checkboxImage = require("../../assets/images/checkbox.png");

export default function GameScreen() {
  const styles = useCommonStyles();
  const gameStore = useGameStore();
  const { setCategories, getRandomCards, cards, categories, profile, getFirstCard, updateCardPreference, removeCard } = gameStore;
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (!profile) router.push("/profiles");
    if (profile && !categories) router.push("/categories");
    setCurrentCard(getFirstCard());
  }, [rootNavigationState?.key]);

  useEffect(() => {
    const getCards = async () => await getRandomCards(3, includeArchived);

    if (!cards) return;
    let currentLength = cards.length;
    if (currentLength < 3) {
      getCards();
    }
    if (cards.length <= currentLength) return;
  }, [cards]);

  const handleCardPreference = async (card: Card | null, action: PreferenceAction) => {
    if (!card) return;
    await updateCardPreference(card, action);
    console.log("Updated card:", card, action);
    setCurrentCard(getFirstCard());
  };

  const moreCards = async () => {
    await getRandomCards(3, includeArchived);
    setCurrentCard(getFirstCard());
  };

  return (
    <SafeAreaView style={[styles.container, { alignItems: "center", flex: 1 }]}>
      <View style={{ flex: 1 }}>
        {gameStore.isLoading && <Loading />}
        {gameStore.error && <Text style={styles.errorText}>{gameStore.error}</Text>}
        {currentCard ? (
          <>
            <GameCard card={currentCard} updatePreference={handleCardPreference} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 25 }}>
              <Button text="Ban" onPress={() => handleCardPreference(currentCard, "ban")}></Button>
              <Button text="Love" onPress={() => handleCardPreference(currentCard, "love")}></Button>
              <Button text="Archive" onPress={() => handleCardPreference(currentCard, "archive")}></Button>
              <Button text="Activate" onPress={() => handleCardPreference(currentCard, "reactivate")}></Button>
            </View>
          </>
        ) : (
          <Text style={styles.text}>No cards left!</Text>
        )}
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center", margin: "auto" }}>
          <Switch
            value={includeArchived}
            onValueChange={() => setIncludeArchived(!includeArchived)}
            trackColor={{ false: "red", true: "green" }}
          />
          <Text style={styles.text}>Switch!</Text>
          <Button text="More" onPress={() => moreCards()}></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
