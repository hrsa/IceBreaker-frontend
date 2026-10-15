/// <reference types="jest" />
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@/src/types/entities";

jest.mock("@/src/api/auth", () => ({
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  me: jest.fn(),
  resetPassword: jest.fn(),
  requestPasswordReset: jest.fn(),
  updateMe: jest.fn(),
  deleteAccount: jest.fn(),
}));

jest.mock("@/src/api/apiClient", () => ({
  getToken: jest.fn(),
  storeToken: jest.fn(),
  deleteToken: jest.fn(),
  getApiClient: jest.fn(),
  createApiClient: jest.fn(),
  setUnauthorizedHandler: jest.fn(),
}));

import { me } from "@/src/api/auth";
import { useAuthStore } from "../authStore";

const authError = (status: number) => {
  const response = { status, data: { message: "Unauthorized" } } as AxiosResponse;
  return new AxiosError("Request failed", AxiosError.ERR_BAD_REQUEST, undefined, undefined, response);
};

const testUser = { id: "user-1", name: "Tester", email: "tester@example.com" } as unknown as User;

describe("authStore.getMe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, accessToken: "stored-token", isLoading: false, error: null });
  });

  it("restores the user and keeps the token when me() succeeds", async () => {
    (me as jest.Mock).mockResolvedValue(testUser);

    await useAuthStore.getState().getMe();

    expect(useAuthStore.getState().user).toEqual(testUser);
    expect(useAuthStore.getState().accessToken).toBe("stored-token");
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it("clears the session when me() fails with 401", async () => {
    (me as jest.Mock).mockRejectedValue(authError(401));

    await useAuthStore.getState().getMe();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("keeps the session when me() fails with a network error", async () => {
    (me as jest.Mock).mockRejectedValue(new AxiosError("Network Error"));

    await useAuthStore.getState().getMe();

    expect(useAuthStore.getState().accessToken).toBe("stored-token");
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("keeps the session when me() fails with a server error", async () => {
    (me as jest.Mock).mockRejectedValue(authError(500));

    await useAuthStore.getState().getMe();

    expect(useAuthStore.getState().accessToken).toBe("stored-token");
  });
});
