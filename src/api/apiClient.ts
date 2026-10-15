import { logger } from "@/src/helpers/logger";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import config from "@/src/config/config";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Registers the app-level reaction to a 401 from the API.
 * Keeps navigation concerns out of the API layer.
 */
export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

export async function createApiClient(): Promise<AxiosInstance> {
  const apiClient: AxiosInstance = axios.create({
    baseURL: config.api.url,
    timeout: config.api.timeout,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const accessToken = await getToken();
      if (accessToken && config.headers) {
        config.headers.setAuthorization(`Bearer ${accessToken}`);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      // A 401 on any endpoint (except login itself, where it just means
      // wrong credentials) invalidates the stored session.
      if (error.response?.status === 401 && error.config?.url !== "/auth/login") {
        await deleteToken();
        unauthorizedHandler?.();
      }
      return Promise.reject(error);
    }
  );

  if (config.api.debugRequests) {
    apiClient.interceptors.request.use(
      async request => {
        let dataToLog = request.data;

        if (request.data instanceof FormData) {
          dataToLog = {};

          request.data.forEach((value, key) => {
            dataToLog[key] = value;
          });
        }
        logger.log("[Axios Request Debug]", {
          method: request.method,
          baseUrl: request.baseURL ? request.baseURL : "no base url",
          url: request.url ? request.url : "no url",
          headers: request.headers,
          data: request.data,
          form_data: dataToLog ? dataToLog : "no form data",
          platform: Platform.OS,
        });

        return request;
      },
      error => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
      response => {
        logger.log("[Axios Response Debug]", {
          status: response.status,
          url: response.config.url,
          headers: response.headers,
          data: response.data,
        });
        return response;
      },
      error => {
        logger.log("[Axios Response Error Debug]", {
          error: error.message,
          status: error.response?.status,
          url: error.response?.config?.url,
          headers: error.response?.headers,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  return apiClient;
}

let apiClientInstance: AxiosInstance | null = null;

export async function getApiClient(): Promise<AxiosInstance> {
  if (!apiClientInstance) {
    apiClientInstance = await createApiClient();
  }
  return apiClientInstance;
}

export const storeToken = async (token: string) => {
  if (Platform.OS === "web") {
    try {
      document.cookie = `bearerToken=${token}; Secure; SameSite=Strict; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=${window.location.hostname}`;
    } catch (error) {
      logger.error("Error storing token:", error);
    }
  } else {
    await SecureStore.setItemAsync("accessToken", token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    const match = document.cookie.match(new RegExp("(^| )" + "bearerToken" + "=([^;]+)"));
    return match ? match[2] : null;
  } else {
    return await SecureStore.getItemAsync("accessToken");
  }
};

export const deleteToken = async () => {
  if (Platform.OS === "web") {
    document.cookie = `bearerToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/; Secure; SameSite=Strict`;
  } else {
    await SecureStore.deleteItemAsync("accessToken");
  }
};
