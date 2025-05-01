import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
import { useEffect, useState } from "react";
import { useIndexStyles } from "@/src/styles/Index";

export default function HomeScreen() {
  const router = useRouter();
  const styles = useIndexStyles();

  const user = useAuthStore(state => state.user);
  const getMe = useAuthStore(state => state.getMe);
  const [redirect, setRedirect] = useState<boolean>(false);
  const logout = useAuthStore(state => state.logout);
  const isLoading = useAuthStore(state => state.isLoading);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getMe();
        const currentUser = useAuthStore.getState().user;

        if (!currentUser) {
          setRedirect(true);
        }
      } catch (error) {
        console.error("Failed to get user:", error);
        setRedirect(true);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (redirect && !user) {
    return <Redirect href={"/login"} />;
  }

  if (!redirect && user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.content}>
          <Text style={styles.title}>Ice Breaker! ☃️</Text>

          <View style={styles.userInfo}>
            <Text style={styles.userText}>Welcome, {user.name}!</Text>
            <Text style={styles.userText}>Email: {user.email}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={isLoading}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
