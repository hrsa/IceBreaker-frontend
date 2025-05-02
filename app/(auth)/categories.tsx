import { useCategoryStore } from "@/src/stores/categoryStore";
import React, { useEffect, useState } from "react";
import { Image, Text, FlatList, TouchableOpacity, View } from "react-native";
import { useCommonStyles } from "@/constants/Styles";
import { Category } from "@/src/types/entities";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useGameStore } from "@/src/stores/gameStore";
import { useRootNavigationState, useRouter } from "expo-router";
import { useCardImages } from "@/hooks/useCardImages";

const { checkboxImage, getCategoryImage } = useCardImages();

export default function CategoriesScreen() {
  const styles = useCommonStyles();
  const categoryStore = useCategoryStore();
  const { categories, getCategories } = categoryStore;
  const gameStore = useGameStore();
  const { setCategories, profile, getRandomCards } = gameStore;
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    getCategories();
    setSelectedCategories([]);
  }, []);

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (!profile) {
      router.replace("/profiles");
    }
  }, [profile, rootNavigationState?.key]);

  const handleStartGame = async () => {
    setCategories(selectedCategories);
    await getRandomCards(3);
    router.push("/game");
  };

  const toggleCategorySelection = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const categorySelected = (category: Category) => {
    return selectedCategories.includes(category);
  };

  const renderItem = ({ item }: { item: Category }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleCategorySelection(item)}
        style={{
          borderWidth: categorySelected(item) ? 0 : 1,
          borderColor: categorySelected(item) ? "rgba(0, 0, 0, 0)" : "#FFFFFF",

          width: 350,
          height: 450,
          borderRadius: 12,
          marginVertical: 25,
          marginHorizontal: 30,
          flexDirection: "column",
          backgroundColor: categorySelected(item) ? "red" : "purple",
          position: "relative",
        }}
      >
        {categorySelected(item) && (
          <BlurView
            intensity={40}
            tint="light"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 1,
              borderRadius: 12,

              padding: -12,
            }}
          >
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(0, 102, 0, 0.8)",
                backgroundColor: "rgba(0, 102, 0, 0.8)",
              }}
            >
              <Image
                source={checkboxImage}
                style={{
                  width: 100,
                  height: 100,
                  margin: "auto",
                  resizeMode: "contain",
                }}
              />
            </View>
          </BlurView>
        )}
        <View style={{ padding: 12, position: "absolute", width: "100%", height: "100%" }}>
          <View style={{ aspectRatio: "16/9" }}>
            <Image
              source={getCategoryImage(item.name_en)}
              style={{
                width: "80%",
                height: "100%",
                maxHeight: 200,
                resizeMode: "contain",
                margin: "auto",
              }}
            />
          </View>
          <View style={{ marginTop: 24, marginBottom: 24 }}>
            <Text style={[styles.title, { textAlign: "center" }]}>
              {item.name_en} ({item.name_ru})
            </Text>
            {item.description_en && <Text style={styles.text}>{item.description_en}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { alignItems: "center" }]}>
      <View style={{ maxHeight: 2000, maxWidth: "80%", overflowX: "scroll", marginVertical: 25 }}>
        <Text style={styles.title}>Categories</Text>
        {categories && categories.length > 0 && (
          <FlatList contentContainerStyle={{ marginVertical: 15 }} horizontal={true} data={categories} renderItem={renderItem}></FlatList>
        )}
      </View>
      {selectedCategories && selectedCategories.length > 0 && (
        <View>
          <TouchableOpacity style={[styles.button]} onPress={() => handleStartGame()} disabled={selectedCategories.length === 0}>
            <Ionicons name="play" size={24} color="white" style={{ marginRight: 15 }} />
            <Text style={styles.buttonText}>Start the game</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
