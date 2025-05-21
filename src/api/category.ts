import { Category } from "@/src/types/entities";
import { isAxiosError } from "axios";
import { getApiClient } from "./apiClient";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    console.error("Categories request error:", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Categories request failed");
    }
    throw error;
  }
};
