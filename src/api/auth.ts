import { logger } from "@/src/helpers/logger";
import { User } from "@/src/types/entities";
import { isAxiosError } from "axios";
import { deleteToken, getApiClient, storeToken } from "./apiClient";
import { toApiError } from "./apiError";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

interface AuthResponse {
  accessToken: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    await storeToken(response.data.accessToken);
    return response.data;
  } catch (error) {
    logger.error("Login error:", error);
    throw toApiError(error, "Login failed");
  }
};

export const updateMe = async (userId: string, data: UpdateUserRequest): Promise<User> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.patch<User>(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    logger.error("UpdateMe error:", error);
    throw toApiError(error, "My profile update failed");
  }
};

export const me = async (): Promise<User> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  } catch (error) {
    logger.error("GetMe error:", error);
    if (isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Only an auth rejection invalidates the stored token.
      // Network errors and timeouts must not log the user out.
      await deleteToken();
      throw toApiError(error, "My profile failed");
    }
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<User> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.post<User>("/auth/register", data);
    return response.data;
  } catch (error) {
    logger.error("Registration error:", error);
    throw toApiError(error, "Registration failed");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await deleteToken();
  } catch (error) {
    logger.error("Logout error:", error);
    throw toApiError(error, "Logout failed");
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const apiClient = await getApiClient();
    await apiClient.post("/auth/password/forgot", { email });
  } catch (error) {
    logger.error("Password reset request error:", error);
    throw toApiError(error, "Password reset request failed");
  }
};

export const resetPassword = async (data: { token: string; password: string }): Promise<void> => {
  try {
    const apiClient = await getApiClient();
    await apiClient.post("/auth/password/reset", data);
  } catch (error) {
    logger.error("Password reset error:", error);
    throw toApiError(error, "Password reset failed");
  }
};

export const deleteAccount = async (userId: string): Promise<void> => {
  try {
    const apiClient = await getApiClient();
    await apiClient.delete(`/users/${userId}`);
    await deleteToken();
  } catch (error) {
    logger.error("Delete account error:", error);
    throw toApiError(error, "Account deletion failed");
  }
};
