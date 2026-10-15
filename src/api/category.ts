import { logger } from "@/src/helpers/logger";
import { Category } from "@/src/types/entities";
import { getApiClient } from "./apiClient";
import { toApiError } from "./apiError";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    logger.error("Categories request error:", error);
    throw toApiError(error, "Categories request failed");
  }
};
