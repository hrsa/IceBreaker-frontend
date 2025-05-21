import { useCategoryStore } from "@/src/stores/categoryStore";
import React, { useEffect, useState } from "react";
import { Text, FlatList, View, Dimensions } from "react-native";
import { useCommonStyles } from "@/constants/Styles";
import { Category } from "@/src/types/entities";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "@/src/stores/gameStore";
import { useFocusEffect, useRouter } from "expo-router";
import Button from "@/components/Button";
import { useStepStore } from "@/src/stores/stepStore";
import { useLanguageStore } from "@/src/stores/languageStore";
import CategoryCard from "@/components/CategoryCard";

export default function CategoriesScreen() {
  const styles = useCommonStyles();
  const { width } = Dimensions.get("window");
  const isLargeScreen = width > 600;
  const step = useStepStore(state => state.step);
  const language = useLanguageStore(state => state.language);
  const t = useLanguageStore(state => state.t);
  const setStep = useStepStore(state => state.setStep);
  const categories = useCategoryStore(state => state.categories);
  const getCategories = useCategoryStore(state => state.getCategories);
  const gameStore = useGameStore();
  const profile = useGameStore(state => state.profile);
  const { setCategories, getRandomCards } = gameStore;
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setStep("categories");
    getCategories();
    setSelectedCategories([]);
    setIsLoading(false);
  }, [step]);

  useFocusEffect(() => {
    setStep("categories");
  });

  useEffect(() => {
    if (!profile) {
      router.replace("/profiles");
    }
  }, [profile]);

  const handleStartGame = async () => {
    if (!isLoading) {
      setIsLoading(true);
      setCategories(selectedCategories);
      await getRandomCards(3);
      router.push("/game");
    }
  };

  const toggleCategorySelection = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderItem = ({ item }: { item: Category }) => (
    <CategoryCard category={item} isSelected={selectedCategories.includes(item)} toggleCategorySelection={toggleCategorySelection} />
  );

  return (
    <SafeAreaView style={[styles.container, styles.centerContent]}>
      <Text style={styles.title}>{t("category:title")}</Text>
      {categories && categories.length > 0 && (
        <FlatList
          data={categories}
          horizontal={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={isLargeScreen ? 3 : 1}
          contentContainerStyle={isLargeScreen ? { alignItems: "center" } : {}}
        />
      )}
      {selectedCategories && selectedCategories.length > 0 && (
        <View style={{ marginVertical: 25 }}>
          <Button
            onPress={() => handleStartGame()}
            disabled={selectedCategories.length === 0}
            text={t("common:start_game")}
            icon="play"
          ></Button>
        </View>
      )}
    </SafeAreaView>
  );
}
