import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useAuthStore } from "@/src/stores/authStore";
import { useAlert } from "@/hooks/useAlert";
import { useRegisterStyles } from "@/src/styles/Register";

export default function PasswordChangeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const t = useLanguageStore(state => state.t);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { alert } = useAlert();

  const resetPassword = useAuthStore(state => state.resetPassword);

  const placeholderColor = useThemeColor({}, "placeholder");

  useEffect(() => {
    if (params.token) {
      setToken(params.token as string);
    } else {
      setError(t("password_change:errors:missing_token"));
    }
  }, [params]);

  const handlePasswordChange = async () => {
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError(t("password_change:errors:fill_all_fields"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("password_change:errors:password_mismatch"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("password_change:errors:password_too_short"));
      return;
    }

    if (!token) {
      setError(t("password_change:errors:missing_token"));
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(token, newPassword);

      alert(t("common:success"), t("password_change:success:message"), [
        {
          text: t("login:login"),
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error) {
      console.error("Password change error:", error);
      setError(t("password_change:errors:change_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  const styles = useRegisterStyles();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scrollView, { maxWidth: 500, minWidth: 450, marginHorizontal: "auto" }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("password_change:title")}</Text>
              <Text style={styles.subtitle}>{t("password_change:subtitle")}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("password_change:new_password")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("password_change:new_password_placeholder")}
                placeholderTextColor={placeholderColor}
                value={newPassword}
                autoCapitalize="none"
                onChangeText={setNewPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("password_change:confirm_password")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("password_change:confirm_password_placeholder")}
                placeholderTextColor={placeholderColor}
                value={confirmPassword}
                autoCapitalize="none"
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={[styles.buttonContainer, { width: "auto", marginHorizontal: "auto", paddingHorizontal: 25 }]}>
              <TouchableOpacity style={styles.button} onPress={handlePasswordChange} disabled={isSubmitting || !token}>
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>{t("password_change:change_button")}</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>{t("password_change:back_to_login")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
