import { Stack, useRouter, useSegments, SplashScreen } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Loading from "@/components/Loading";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { user, getMe, isLoading: isAuthLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();
        const currentUser = useAuthStore.getState().user;

        if (!currentUser) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      } finally {
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
    <Stack>
      <Stack.Screen name="profiles" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="categories" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen name="game" options={{ headerShown: false, animation: "slide_from_right" }} />
    </Stack>
  );
}
