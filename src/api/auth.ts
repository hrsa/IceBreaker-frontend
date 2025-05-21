import { User } from "@/src/types/entities";
import { isAxiosError } from "axios";
import { deleteToken, getApiClient, storeToken } from "./apiClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
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
    console.error("Login error:", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw error;
  }
};

export const me = async (): Promise<User> => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  } catch (error) {
    console.error("GetMe error:", error);
    await deleteToken();
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "My profile failed");
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
    console.error("Registration error:", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await deleteToken();
  } catch (error) {
    console.error("Logout error:", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Logout failed");
    }
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const apiClient = await getApiClient();
    await apiClient.post("/auth/password/forgot", { email });
  } catch (error) {
    console.error("Password reset request error:", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Password reset request failed");
    }
  }
};

export const resetPassword = async (data: { token: string; password: string }): Promise<void> => {
  try {
    const apiClient = await getApiClient();
    await apiClient.post("/auth/password/reset", data);
  } catch (error) {
    console.error("Password reset error:", error);
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Password reset failed");
    }
  }
};
