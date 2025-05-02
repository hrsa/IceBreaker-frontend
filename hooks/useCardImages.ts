export const useCardImages = () => {
  const categoryImages: Record<string, any> = {
    work: require("../assets/images/work.png"),
    family: require("../assets/images/family.png"),
  };

  const getCategoryImage = (category: string) => {
    return categoryImages[category.toLowerCase()] || require("../assets/images/family.png");
  };

  const checkboxImage = require("../assets/images/checkbox.png");

  return { categoryImages, checkboxImage, getCategoryImage };
};
