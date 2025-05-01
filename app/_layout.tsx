import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Head from "expo-router/head";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Head>
        <title>IceBreaker</title>
        <meta
          name="description"
          content="IceBreaker provides cards with deep questions to help people connect and build stronger relationships."
        />
        <meta name="keywords" content="IceBreaker, deep questions, conversation starter, relationships, connection, social app" />
        <meta property="og:title" content="IceBreaker - Deep Questions for Connection" />
        <meta
          property="og:description"
          content="IceBreaker helps people bond through thought-provoking questions designed to spark meaningful conversations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://icebreaker.app" />
      </Head>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="login" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="register" options={{ headerShown: false, animation: "slide_from_right" }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
