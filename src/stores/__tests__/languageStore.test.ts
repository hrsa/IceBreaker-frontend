/// <reference types="jest" />
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import type { useLanguageStore } from "../languageStore";

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

const loadStore = async (): Promise<typeof useLanguageStore> => {
  const storeModule = require("@/src/stores/languageStore");
  // Persist rehydration is async; give it a few microtask/macrotask turns.
  await flushPromises();
  await flushPromises();
  await flushPromises();
  return storeModule.useLanguageStore;
};

describe("languageStore persistence", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("migrates a legacy bare language code on rehydration", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    await AsyncStorage.setItem("userLanguage", "ru");

    const useLanguageStore = await loadStore();

    expect(useLanguageStore.getState().language).toBe("ru");
  });

  it("falls back to the device language when nothing is stored", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    await AsyncStorage.removeItem("userLanguage");

    const useLanguageStore = await loadStore();

    expect(["en", "ru", "fr", "it"]).toContain(useLanguageStore.getState().language);
  });

  it("ignores an unsupported stored language", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    await AsyncStorage.setItem("userLanguage", "de");

    const useLanguageStore = await loadStore();

    expect(useLanguageStore.getState().language).not.toBe("de");
    expect(["en", "ru", "fr", "it"]).toContain(useLanguageStore.getState().language);
  });
});
