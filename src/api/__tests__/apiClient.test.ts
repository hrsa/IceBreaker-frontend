/// <reference types="jest" />
import * as SecureStore from "expo-secure-store";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import { deleteToken, getToken, storeToken } from "../apiClient";

describe("apiClient token storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stores the access token in SecureStore on native", async () => {
    await storeToken("token-123");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("accessToken", "token-123");
  });

  it("reads the access token from SecureStore on native", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("token-456");
    await expect(getToken()).resolves.toBe("token-456");
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith("accessToken");
  });

  it("deletes the access token from SecureStore on native", async () => {
    await deleteToken();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("accessToken");
  });
});
