import React, { useEffect, useState } from "react";
import { Text, View, Platform, ScrollView, TextInput, KeyboardAvoidingView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useAuthStore } from "@/src/stores/authStore";
import Modal from "@/components/Modal";
import { CopyableField } from "@/components/CopyableField";
import { UpdateUserRequest } from "@/src/api/auth";
import { useAlert } from "@/hooks/useAlert";
import { useMyProfileStyles } from "@/src/styles/MyProfile";
import { useRouter } from "expo-router";

export default function MyProfileScreen() {
  const { alert } = useAlert();
  const router = useRouter();
  const language = useLanguageStore(state => state.language);
  const t = useLanguageStore(state => state.t);
  const user = useAuthStore(state => state.user);
  const deleteAccount = useAuthStore(state => state.deleteAccount);
  const styles = useMyProfileStyles();
  const [telegramModalVisible, setTelegramModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const updateMe = useAuthStore(state => state.updateMe);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  const handleUpdateData = async () => {
    let data: UpdateUserRequest = {};
    if (name && name.trim()) {
      data.name = name;
    }
    if (email && email.trim()) {
      data.email = email;
    }
    if (password && password.length > 6) {
      data.password = password;
    }
    if (password && password.length < 6) {
      alert(t("common:error"), t("password_change:errors:password_too_short"));
      return;
    }
    if (Object.keys(data).length === 0) {
      setName(user!.name);
      setEmail(user!.email);
      setPassword("");
      return;
    }
    await updateMe(data);
    alert(t("common:success"), t("my_profile:profile_updated"));
    setName(user!.name);
    setEmail(user!.email);
    setPassword("");
  };

  const handleDeleteEmailInput = (text: string) => {
    setDeleteEmail(text);
    setModalError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== user!.email) {
      setModalError(t("my_profile:errors:wrong_email"));
      return;
    }
    await deleteAccount();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={[styles.container, styles.centerContent]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={[styles.header, { marginBottom: 15 }]}>
              <Text style={styles.title}>{t("my_profile:title")}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("register:name")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("register:name_placeholder")}
                placeholderTextColor={styles.placeholder.color}
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
                placeholderTextColor={styles.placeholder.color}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("password_change:new_password")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("password_change:new_password_placeholder")}
                placeholderTextColor={styles.placeholder.color}
                value={password}
                autoCapitalize="none"
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            {user && user.secretPhrase && (
              <View style={{ marginTop: 5, marginBottom: 25 }}>
                <Text style={styles.suggestionLink} onPress={() => setTelegramModalVisible(true)}>
                  {t("my_profile:connect_tg")}
                </Text>
                <Modal
                  isVisible={telegramModalVisible}
                  onDismiss={() => {
                    setTelegramModalVisible(false);
                  }}
                  title={t("my_profile:modal:title")}
                  closeOnBackdropPress={true}
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{t("my_profile:modal:did_you_know")}</Text>
                    <Text style={styles.modalText}>{t("my_profile:modal:click_the_field")}</Text>
                    <CopyableField style={{ marginTop: 25 }} textContent={user!.secretPhrase!} />
                    <Text style={styles.botLink} onPress={() => Linking.openURL("https://t.me/IceMelterBot")}>
                      {t("my_profile:modal:bot_link")}
                    </Text>
                  </View>
                </Modal>

                <Modal
                  isVisible={deleteModalVisible}
                  onDismiss={() => {
                    setDeleteModalVisible(false);
                  }}
                  title={t("my_profile:delete_modal:title")}
                  closeOnBackdropPress={true}
                  buttons={
                    <Button
                      buttonStyle={{ backgroundColor: modalError ? "grey" : "darkred" }}
                      text={t("my_profile:delete_modal:confirm")}
                      onPress={handleDeleteAccount}
                    />
                  }
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>{t("my_profile:delete_modal:message")}</Text>
                    <Text style={styles.modalText}>{t("my_profile:delete_modal:hint")}</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleDeleteEmailInput}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                      />
                      {modalError && <Text style={[styles.modalText, styles.errorText]}>{modalError}</Text>}
                    </View>
                  </View>
                </Modal>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button text={t("my_profile:update_button")} onPress={handleUpdateData} />
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.deleteAccountLink} onPress={() => setDeleteModalVisible(true)}>
                {t("my_profile:delete_modal:title")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
