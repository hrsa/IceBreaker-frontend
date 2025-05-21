import { Stack, useRouter, useSegments, SplashScreen } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Loading from "@/components/Loading";
import { useFonts } from "expo-font";
import { AlertProvider } from "@/hooks/useAlert";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const getMe = useAuthStore(state => state.getMe);
  const user = useAuthStore(state => state.user);
  const isAuthLoading = useAuthStore(state => state.isLoading);
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    Merriweather: require("../../assets/fonts/merriweather.regular.ttf"),
    MerriweatherBold: require("../../assets/fonts/merriweather.bold.ttf"),
    MerriweatherLight: require("../../assets/fonts/merriweather.light.ttf"),
    MerriweatherUltraBold: require("../../assets/fonts/merriweather.ultrabold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          await getMe();
          if (!user) {
            router.replace("/login");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          router.replace("/login");
        } finally {
          setIsAuthReady(true);
          SplashScreen.hideAsync();
        }
      } else {
        setIsAuthReady(true);
        SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, []);

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading size="large" />
        <Text style={{ marginTop: 20 }}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <AlertProvider>
      <Stack>
        <Stack.Screen name="profiles" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="categories" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="game" options={{ headerShown: false, animation: "slide_from_right" }} />
      </Stack>
    </AlertProvider>
  );
}
