import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { BlurView } from "expo-blur";
import AdaptiveText from "@/components/AdaptiveText";
import { Category } from "@/src/types/entities";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useCardImages } from "@/hooks/useCardImages";
import { useCategoryStyles } from "@/src/styles/Categories";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  toggleCategorySelection: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, toggleCategorySelection }) => {
  const { checkboxImage, getCategoryImage } = useCardImages();
  const styles = useCategoryStyles();
  const name = useLanguageStore(state => state.getLocalizedCardField(category, "name"));

  return (
    <TouchableOpacity onPress={() => toggleCategorySelection(category)} style={styles.categoryContainer}>
      {isSelected && (
        <BlurView intensity={40} tint="light" style={styles.categoryBlurView}>
          <Image
            source={checkboxImage}
            style={{
              width: 50,
              height: 50,
              alignSelf: "center",
              marginTop: 80,
            }}
          />
        </BlurView>
      )}
      <View style={styles.categoryCard}>
        <Image source={getCategoryImage(category.id)} style={styles.categoryImage} />

        <AdaptiveText text={name} fontSize={32} styles={styles.categoryText} />
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
