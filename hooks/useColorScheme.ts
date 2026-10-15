import { useColorScheme as useRNColorScheme } from "react-native";

export type AppColorScheme = "light" | "dark" | null;

/**
 * react-native's useColorScheme can also return "unspecified";
 * normalizing to light/dark/null keeps the value usable as a Colors key.
 */
export function useColorScheme(): AppColorScheme {
  const scheme = useRNColorScheme();
  if (scheme === "light" || scheme === "dark") {
    return scheme;
  }
  return null;
}
