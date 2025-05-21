import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/src/stores/authStore";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useAlert } from "@/hooks/useAlert";
import { useRegisterStyles } from "@/src/styles/Register";

export default function RegisterScreen() {
  const router = useRouter();
  const t = useLanguageStore(state => state.t);
  const language = useLanguageStore(state => state.language);
  const { alert } = useAlert();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeholderColor = useThemeColor({}, "placeholder");

  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert(t("common:error"), t("register:errors:fill_all_fields"));
      return;
    }

    if (password !== confirmPassword) {
      alert(t("common:error"), t("register:errors:password_mismatch"));
      return;
    }

    if (password.length < 6) {
      alert(t("common:error"), t("register:errors:password_too_short"));
      return;
    }

    try {
      setIsSubmitting(true);
      await register(email, password, name);
      router.replace("/");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    clearError();
    router.push("/login");
  };

  const styles = useRegisterStyles();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{t("register:title")}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("register:name")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("register:name_placeholder")}
                placeholderTextColor={placeholderColor}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
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
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("register:confirm_password")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("register:confirm_password_placeholder")}
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
              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>{t("login:register")}</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t("register:already_have_account")}</Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>{t("login:login")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
