import { logger } from "@/src/helpers/logger";
import { Profile } from "@/src/types/entities";
import { getApiClient } from "./apiClient";
import { toApiError } from "./apiError";

interface ProfileRequest {
  name: string;
}

export const getProfiles = async (): Promise<Profile[]> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<Profile[]>("/profiles");
    return response.data;
  } catch (error) {
    logger.error("Profiles request error:", error);
    throw toApiError(error, "Profile request failed");
  }
};

export const createProfile = async (data: ProfileRequest): Promise<Profile> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<Profile>("/profiles", data);
    return response.data;
  } catch (error) {
    logger.error("Profile creation error:", error);
    throw toApiError(error, "Profile creation failed");
  }
};

export const updateProfile = async (profileId: string, data: ProfileRequest): Promise<Profile> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.patch<Profile>(`/profiles/${profileId}`, data);
    return response.data;
  } catch (error) {
    logger.error("Profile update error:", error);
    throw toApiError(error, "Profile update failed");
  }
};

export const deleteProfile = async (profileId: string): Promise<boolean> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.delete<boolean>(`/profiles/${profileId}`);
    return response.status === 204;
  } catch (error) {
    logger.error("Profile delete error:", error);
    throw toApiError(error, "Profile delete failed");
  }
};
