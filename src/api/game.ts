import { Card, CardPreference, PreferenceAction } from "@/src/types/entities";
import axios from "axios";
import { getApiClient } from "./apiClient";

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
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return { cards: [], hasViewedAllCards: true };
      }

      throw new Error(error.response.data.message || "Random card request failed");
    }
    throw error;
  }
};

export const updateCardPreference = async (cardId: string, profileId: string, action: PreferenceAction): Promise<CardPreference> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<CardPreference>(`/card-preferences/${cardId}/profile/${profileId}/${action}`);
    return response.data;
  } catch (error) {
    console.error("Random card request error:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Random card request failed");
    }
    throw error;
  }
};
