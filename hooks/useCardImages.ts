export const useCardImages = () => {
  const categoryImages: Record<string, any> = {
    "d689aac9-8f99-4cd8-aa3f-8d2f2b4bfc66": require("../assets/images/categories/authentic_communication.png"),
    "7e3044aa-72fe-49d1-811e-b6ea9c37fbc4": require("../assets/images/categories/deep_questions.png"),
    "b24a0336-211c-4303-a96a-206345488f1e": require("../assets/images/categories/family_questions.png"),
    generic: require("../assets/images/categories/generic.png"),
    "17b6fc36-0984-43e0-9736-bcadf7395da3": require("../assets/images/categories/questions_and_tasks.png"),
    "f90a29a5-8640-4edc-9192-c875819e2fe8": require("../assets/images/categories/questions_for_couples.png"),
    "e88cb352-24e1-4a42-9087-bf7de7deca6a": require("../assets/images/categories/questions_in_bed.png"),
    "e74427c0-c899-47a4-953b-540a1d083550": require("../assets/images/categories/questions_for_work.png"),
    "4fb9e72f-ddf4-4683-b43e-5826cfdcd764": require("../assets/images/categories/talking_to_yourself.png"),
    "965c0dc4-08b2-4a16-b141-ab4f0707bb95": require("../assets/images/categories/truth_or_dare_cosmo.png"),
    "e1dbfaca-e378-462b-a0e0-40ae6cf71e6e": require("../assets/images/categories/truth_or_dare_unhinged.png"),
  };

  const getCategoryImage = (categoryId: string) => {
    return categoryImages[categoryId] || categoryImages.generic;
  };

  const checkboxImage = require("../assets/images/checkbox.png");

  return { categoryImages, checkboxImage, getCategoryImage };
};
