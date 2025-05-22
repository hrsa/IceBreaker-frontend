import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
import { useLoginStyles } from "@/src/styles/Login";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useAlert } from "@/hooks/useAlert";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const t = useLanguageStore(state => state.t);
  const language = useLanguageStore(state => state.language);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useLoginStyles();

  const getMe = useAuthStore(state => state.getMe);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const requestPasswordReset = useAuthStore(state => state.requestPasswordReset);
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

  const handleForgotPassword = async () => {
    if (!email) {
      alert(t("common:error"), t("password_reset:alerts:fill_email"));
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      alert(t("common:success"), t("password_reset:alerts:check_email"), [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={[styles.content, { maxWidth: 800, marginHorizontal: "auto" }]}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("password_reset:title")}</Text>
              <Text style={styles.subtitle}>{t("password_reset:subtitle")}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("login:email")}</Text>
              <TextInput
                style={[styles.input, { marginHorizontal: "auto", width: 250, marginBottom: 25 }]}
                placeholder={t("login:email_placeholder")}
                placeholderTextColor={styles.placeholder.color}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>{t("password_reset:button")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
