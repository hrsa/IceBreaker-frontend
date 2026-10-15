import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

import type { AppColorScheme } from "./useColorScheme";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): AppColorScheme {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme(); // Call hook unconditionally
  const normalized: AppColorScheme = colorScheme === "dark" ? "dark" : colorScheme === "light" ? "light" : null;
  const [initialColorScheme] = useState<AppColorScheme>(normalized || "light"); // Store initial value

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? normalized : initialColorScheme;
}
