import { logger } from "@/src/helpers/logger";
import { Card, CardPreference, PreferenceAction } from "@/src/types/entities";
import { isAxiosError } from "axios";
import { getApiClient } from "./apiClient";
import { toApiError } from "./apiError";

export interface RandomCardRequest {
  profileId: string;
  categoryIds: string[];
  limit?: number;
  includeArchived?: boolean;
  includeLoved?: boolean;
}

export interface RandomCardResponse {
  cards: Card[];
  hasViewedAllCards: boolean;
}

export const getRandomCards = async (data: RandomCardRequest): Promise<RandomCardResponse> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<RandomCardResponse>("/cards/random", data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { cards: [], hasViewedAllCards: true };
    }
    throw toApiError(error, "Random card request failed");
  }
};

export const updateCardPreference = async (cardId: string, profileId: string, action: PreferenceAction): Promise<CardPreference> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<CardPreference>(`/card-preferences/${cardId}/profile/${profileId}/${action}`);
    return response.data;
  } catch (error) {
    logger.error("Card preference update error:", error);
    throw toApiError(error, "Card preference update failed");
  }
};
