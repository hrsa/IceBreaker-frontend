import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";
import LanguageSelector from "@/components/LanguageSelector";
import { Redirect, useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
import { useEffect, useState } from "react";
import { useIndexStyles } from "@/src/styles/Index";
import { useStepStore } from "@/src/stores/stepStore";
import { useLanguageStore } from "@/src/stores/languageStore";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

export default function HomeScreen() {
  const router = useRouter();
  const styles = useIndexStyles();
  const setStep = useStepStore(state => state.setStep);
  const t = useLanguageStore(state => state.t);
  const getMe = useAuthStore(state => state.getMe);
  const logout = useAuthStore(state => state.logout);
  const isLoading = useAuthStore(state => state.isLoading);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const logo = require("@/assets/images/icemelter-icon-1024.png");

  useEffect(() => {
    setStep("home");
    let cancelled = false;

    const checkAuth = async () => {
      try {
        await getMe();
      } catch (error) {
        console.error("Failed to get user:", error);
      } finally {
        if (!cancelled) {
          // A surviving access token means the session is still valid
          // (an auth rejection deletes the token in `me()`).
          setHasSession(Boolean(useAuthStore.getState().accessToken));
          setIsAuthReady(true);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthReady) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar style="auto" />
        <Loading size="large" />
      </SafeAreaView>
    );
  }

  if (!hasSession) {
    return <Redirect href={"/login"} />;
  }

  return (
    <SafeAreaView style={[styles.container, styles.centerContent]}>
      <StatusBar style="auto" />
      <View style={{ maxHeight: 850 }}>
        <Text style={styles.title}>🧊Ice Melter🧊</Text>
        <Image source={logo} style={styles.logo} />
        <LanguageSelector />

        <View style={styles.buttonContainer}>
          <Button
            text={t("index:start")}
            buttonStyle={styles.startButton}
            icon={"play"}
            onPress={() => router.push("/profiles")}
            disabled={isLoading}
          />

          <Button
            text={t("index:my_profile")}
            buttonStyle={[styles.button]}
            icon={"settings"}
            onPress={() => router.push("/my_profile")}
            disabled={isLoading}
          />

          <Button text={t("index:logout")} buttonStyle={styles.logoutButton} icon={"exit"} onPress={handleLogout} disabled={isLoading} />
        </View>
      </View>
    </SafeAreaView>
  );
}
