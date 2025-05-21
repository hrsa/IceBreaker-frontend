import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, Image } from "react-native";
import LanguageSelector from "@/components/LanguageSelector";
import { Redirect, useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
import { useEffect, useState } from "react";
import { useIndexStyles } from "@/src/styles/Index";
import { User } from "@/src/types/entities";
import { useStepStore } from "@/src/stores/stepStore";
import { useLanguageStore } from "@/src/stores/languageStore";
import Button from "@/components/Button";

export default function HomeScreen() {
  const router = useRouter();
  const styles = useIndexStyles();
  const step = useStepStore(state => state.step);
  const setStep = useStepStore(state => state.setStep);
  const language = useLanguageStore(state => state.language);
  const t = useLanguageStore(state => state.t);
  const authStore = useAuthStore();
  const user = useAuthStore(state => state.user);
  const { getMe, logout, isLoading } = authStore;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false);
  const logo = require("@/assets/images/icemelter-icon-1024.png");

  useEffect(() => {
    const checkAuth = async () => {
      setStep("home");
      setRedirect(false);
      if (!currentUser) {
        try {
          getMe().then(() => {
            console.log(user);
          });
          setCurrentUser(user);
          console.warn(user);
          if (!currentUser) {
            setRedirect(true);
          }
        } catch (error) {
          console.error("Failed to get user:", error);
          setRedirect(true);
        }
      }
    };

    checkAuth();
  }, [currentUser, step]);

  const handleLogout = async () => {
    try {
      setCurrentUser(null);
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (redirect && !currentUser) {
    return <Redirect href={"/login"} />;
  }

  if (!redirect && currentUser) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <StatusBar style="auto" />
        <View>
          <Text style={[styles.title, { margin: "auto" }]}>🧊Ice Melter🧊</Text>
          <Image source={logo} style={{ width: 350, height: 350, margin: "auto" }} />
          <LanguageSelector />

          <Button
            text={t("index:start")}
            buttonStyle={[styles.button, { marginHorizontal: "auto", paddingHorizontal: 25, marginVertical: 25 }]}
            onPress={() => router.push("/profiles")}
            disabled={isLoading}
          />
          <Button
            text={t("index:logout")}
            buttonStyle={[styles.button, { backgroundColor: "#AA0000", paddingHorizontal: 25, margin: "auto" }]}
            onPress={handleLogout}
            disabled={isLoading}
          />
        </View>
      </SafeAreaView>
    );
  }
}
