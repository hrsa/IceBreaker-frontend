import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/src/stores/authStore";
import { useLoginStyles } from "@/src/styles/Login";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useAlert } from "@/hooks/useAlert";

export default function LoginScreen() {
  const router = useRouter();
  const t = useLanguageStore(state => state.t);
  const language = useLanguageStore(state => state.language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useLoginStyles();

  const placeholderColor = useThemeColor({}, "placeholder");

  const login = useAuthStore(state => state.login);
  const getMe = useAuthStore(state => state.getMe);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);
  const { alert } = useAlert();

  useEffect(() => {
    const getMyProfile = async () =>
      await getMe().then(() => {
        if (useAuthStore.getState().user) {
          router.replace("/");
        }
      });
    getMyProfile();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert(t("common:error"), t("login:fill_all_fields"));
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToRegister = () => {
    clearError();
    router.push("/register");
  };

  const navigateToForgotPassword = () => {
    clearError();
    router.push("/forgot_password");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              {/*<Text style={styles.title}>{t("common:welcome")}</Text>*/}
              <Text style={styles.title}>🧊IceMelter🧊</Text>
              <Text style={styles.subtitle}>{t("login:subtitle")}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("login:email")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("login:email_placeholder")}
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("login:password")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("login:password_placeholder")}
                placeholderTextColor={placeholderColor}
                value={password}
                autoCapitalize="none"
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
              <TouchableOpacity onPress={navigateToForgotPassword}>
                <Text style={styles.forgotPasswordLink}>{t("password_reset:title")}</Text>
              </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>{t("login:login")}</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{t("login:no_account")}</Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>{t("login:register")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
