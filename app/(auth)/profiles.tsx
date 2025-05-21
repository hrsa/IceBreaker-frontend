import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, TextInput, FlatList, Dimensions } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useProfileStore } from "@/src/stores/profileStore";
import { Ionicons } from "@expo/vector-icons";
import { Profile } from "@/src/types/entities";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { useProfileStyles } from "@/src/styles/Profiles";
import ProfileBlob from "@/components/ProfileBlob";
import Modal from "@/components/Modal";
import { useGameStore } from "@/src/stores/gameStore";
import { triggerHaptic, useDragGesture } from "@/hooks/useDragGesture";
import { useStepStore } from "@/src/stores/stepStore";
import { useLanguageStore } from "@/src/stores/languageStore";
import Button from "@/components/Button";
import { useAlert } from "@/hooks/useAlert";
import Animated from "react-native-reanimated";

export default function ProfilesScreen() {
  const styles = useProfileStyles();
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isLargeScreen = width > 600;
  const step = useStepStore(state => state.step);
  const setStep = useStepStore(state => state.setStep);
  const language = useLanguageStore(state => state.language);
  const t = useLanguageStore(state => state.t);
  const { alert } = useAlert();

  const setProfile = useGameStore(state => state.setProfile);
  const profiles = useProfileStore(state => state.profiles);
  const isLoading = useProfileStore(state => state.isLoading);
  const profileStore = useProfileStore();
  const { getProfiles, createProfile, deleteProfile } = profileStore;
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { draggingIndex, showTrashZone, translateX, translateY, trashZoneAnimatedStyle, getGestureHandlerProps, canItemBeClicked } =
    useDragGesture({
      trashZoneHeight: styles.trashZone.height,
      onDelete: index => {
        const profileToDelete = localProfiles[index];
        if (profileToDelete) {
          handleDeleteProfile(profileToDelete.id);
        }
      },
    });

  useEffect(() => {
    setStep("profiles");
    const loadProfiles = async () => await getProfiles();
    loadProfiles();
  }, [step]);

  useFocusEffect(() => {
    setStep("profiles");
  });

  useEffect(() => {
    if (profiles) {
      const validProfiles = Array.isArray(profiles) ? profiles.filter((profile): profile is Profile => profile !== null) : [];
      setLocalProfiles(validProfiles);
    }
  }, [profiles]);

  const handleNewProfileNameChange = (text: string) => {
    setNewProfileName(text);
    setModalError(null);
  };

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) {
      setModalError(t("profile:errors:empty_name"));
      return;
    }

    try {
      await createProfile(newProfileName);
      setNewProfileName("");
      setModalVisible(false);
      triggerHaptic("notification", { type: Haptics.NotificationFeedbackType.Success });
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert(t("common:error"), t("profile:errors:creation_failed"));
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      await deleteProfile(profileId);
      triggerHaptic("notification", { type: Haptics.NotificationFeedbackType.Success });
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert(t("common:error"), t("profile:errors:delete_failed"));
    }
  };

  const handleProfilePress = (profile: Profile) => {
    setProfile(profile);
    router.push(`/categories`);
  };

  const renderProfileBlob = ({ item, index }: { item: Profile; index: number }) => {
    return (
      <ProfileBlob
        key={item.id}
        profile={item}
        index={index}
        draggingIndex={draggingIndex}
        translateX={translateX}
        translateY={translateY}
        getGestureHandlerProps={getGestureHandlerProps}
        handleProfilePress={handleProfilePress}
        canItemBeClicked={canItemBeClicked}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>{t("profile:title")}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.flexFullWidth}>
          <Text style={styles.subtitle}>{t("profile:select")}</Text>

          <FlatList
            data={localProfiles}
            renderItem={renderProfileBlob}
            keyExtractor={item => item.id}
            numColumns={isLargeScreen ? 3 : 1}
            contentContainerStyle={styles.profilesContainer}
            style={styles.flexFullWidth}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={() => <Text style={styles.emptyText}>{t("profile:no_profile")}</Text>}
          />
        </View>

        {!showTrashZone && (
          <View style={styles.createButonContainer}>
            <Button
              text={t("profile:create")}
              icon={"add"}
              buttonStyle={styles.createButton}
              onPress={() => setModalVisible(true)}
              disabled={isLoading}
            />
          </View>
        )}
      </View>

      <Animated.View style={[styles.trashZone, trashZoneAnimatedStyle]}>
        <BlurView intensity={90} tint="dark" style={styles.trashZoneBlur}>
          <Ionicons name="trash" size={40} color="#FF3B30" />
          <Text style={styles.trashZoneText}>{t("profile:delete")}</Text>
        </BlurView>
      </Animated.View>

      {/* Modal for creating a new profile */}
      <Modal
        isVisible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setNewProfileName("");
        }}
        title={t("profile:modal:title")}
        closeOnBackdropPress={true}
        buttons={
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.button]} onPress={handleAddProfile} disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? t("profile:modal:creating") : t("profile:modal:create")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setNewProfileName("");
              }}
            >
              <Text style={styles.buttonText}>{t("profile:modal:cancel")}</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <TextInput
          style={styles.input}
          placeholder={t("profile:modal:placeholder")}
          placeholderTextColor={styles.text.color}
          value={newProfileName}
          onChangeText={handleNewProfileNameChange}
          autoFocus={true}
        />
        {modalError && <Text style={styles.errorText}>{modalError}</Text>}
      </Modal>
    </SafeAreaView>
  );
}
