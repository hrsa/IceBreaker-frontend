interface Entity {
  [key: string]: string | number | boolean | Date | object | null | undefined;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActivated: boolean;
  isAdmin: boolean;
  createdAt: Date;
  credits: number;
  telegramId?: string;
  secretPhrase?: string;
}

export interface Profile {
  id: string;
  name: string;
  userId: string;
}

export interface CardPreference {
  id: string;
  profileId: string;
  cardId: string;
  status: CardStatus;
  lastInteractionAt: Date;
}

export type CardStatus = "active" | "archived" | "loved" | "banned";
export type PreferenceAction = "archive" | "reactivate" | "ban" | "love";

export interface Card extends Entity {
  id: string;
  question_en: string;
  question_ru: string;
  question_fr: string;
  question_it: string;
  categoryId: string;
  category: Category;
  cardPreference?: CardPreference;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category extends Entity {
  id: string;
  name_en: string;
  name_ru: string;
  name_fr: string;
  name_it: string;
  description_en: string;
  description_ru: string;
  description_fr: string;
  description_it: string;
  createdAt: Date;
}

export interface Suggestion {
  id: string;
  categoryId: string;
  question: string;
  userId: string;
}
