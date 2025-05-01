import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, TextInput, Alert, Animated, Dimensions, Platform } from "react-native";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores/authStore";
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

export default function ProfilesScreen() {
  const styles = useProfileStyles();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const setProfile = useGameStore(state => state.setProfile);
  const profileStore = useProfileStore();
  const { profiles, getProfiles, createProfile, deleteProfile, isLoading } = profileStore;
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { draggingIndex, showTrashZone, panValue, trashZoneOpacity, handlePanGestureEvent, handleStateChange, canItemBeClicked } =
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
    if (!rootNavigationState?.key) return;
    const loadProfiles = async () => await getProfiles();
    loadProfiles();
  }, []);

  useEffect(() => {
    if (profiles) {
      const validProfiles = Array.isArray(profiles) ? profiles.filter((profile): profile is Profile => profile !== null) : [];
      setLocalProfiles(validProfiles);
    }
  }, [profiles]);

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) {
      Alert.alert("Error", "Profile name cannot be empty");
      return;
    }

    try {
      await createProfile(newProfileName);
      setNewProfileName("");
      setModalVisible(false);
      triggerHaptic("notification", { type: Haptics.NotificationFeedbackType.Success });
    } catch (error) {
      console.error("Failed to create profile:", error);
      Alert.alert("Error", "Failed to create profile");
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      await deleteProfile(profileId);
      triggerHaptic("notification", { type: Haptics.NotificationFeedbackType.Success });
    } catch (error) {
      console.error("Failed to delete profile:", error);
      Alert.alert("Error", "Failed to delete profile");
    }
  };

  const handleProfilePress = (profile: Profile) => {
    setProfile(profile);
    router.push(`/categories`);
  };

  const renderProfileBlob = (profile: Profile, index: number) => {
    return (
      <ProfileBlob
        key={profile.id}
        profile={profile}
        index={index}
        draggingIndex={draggingIndex}
        panValue={panValue}
        handlePanGestureEvent={handlePanGestureEvent}
        onHandlerStateChange={handleStateChange}
        handleProfilePress={handleProfilePress}
        canItemBeClicked={canItemBeClicked}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Profiles</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Select or create a profile to start playing</Text>

        <View style={styles.profilesContainer}>
          {localProfiles && localProfiles.length > 0 ? (
            localProfiles.map((profile, index) => renderProfileBlob(profile, index))
          ) : (
            <Text style={styles.emptyText}>No profiles yet. Create your first profile!</Text>
          )}
        </View>

        <View style={styles.centeredContainer}>
          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => setModalVisible(true)} disabled={isLoading}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={[styles.buttonText, { marginLeft: 15 }]}>Create New Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trash zone that appears when dragging */}
      <Animated.View
        style={[
          styles.trashZone,
          {
            opacity: trashZoneOpacity,
            transform: [
              {
                translateY: trashZoneOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [styles.trashZone.height, 0],
                }),
              },
            ],
          },
        ]}
      >
        <BlurView intensity={90} tint="dark" style={styles.trashZoneBlur}>
          <Ionicons name="trash" size={40} color="#FF3B30" />
          <Text style={styles.trashZoneText}>Release to delete</Text>
        </BlurView>
      </Animated.View>

      {/* Modal for creating a new profile */}
      <Modal
        isVisible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setNewProfileName("");
        }}
        title="Create New Profile"
        closeOnBackdropPress={true}
        buttons={
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.button]}
              onPress={handleAddProfile}
              disabled={isLoading || !newProfileName.trim()}
            >
              <Text style={styles.buttonText}>{isLoading ? "Creating..." : "Create"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setNewProfileName("");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <TextInput
          style={styles.input}
          placeholder="Profile Name"
          placeholderTextColor={styles.text.color}
          value={newProfileName}
          onChangeText={setNewProfileName}
          autoFocus={true}
        />
      </Modal>
    </SafeAreaView>
  );
}
