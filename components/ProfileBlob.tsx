import React from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { Profile } from "@/src/types/entities";
import { useProfileStyles } from "@/src/styles/Profiles";

interface ProfileBlobProps {
  profile: Profile;
  index: number;
  draggingIndex: number | null;
  panValue: Animated.ValueXY;
  handlePanGestureEvent: (event: PanGestureHandlerGestureEvent) => void;
  onHandlerStateChange: (event: PanGestureHandlerGestureEvent, index: number) => void;
  handleProfilePress: (profile: Profile) => void;
  canItemBeClicked: () => boolean;
}

const ProfileBlob: React.FC<ProfileBlobProps> = ({
  profile,
  index,
  draggingIndex,
  panValue,
  handlePanGestureEvent,
  onHandlerStateChange,
  handleProfilePress,
  canItemBeClicked,
}) => {
  const styles = useProfileStyles();
  const isBeingDragged = draggingIndex === index;

  const onProfilePress = () => {
    if (canItemBeClicked()) {
      handleProfilePress(profile);
    }
  };

  return (
    <PanGestureHandler
      key={profile.id}
      onGestureEvent={handlePanGestureEvent}
      onHandlerStateChange={event => onHandlerStateChange(event, index)}
    >
      <Animated.View
        style={[
          styles.profileBlob,
          {
            transform: isBeingDragged ? [{ scale: 1.1 }, { translateX: panValue.x }, { translateY: panValue.y }] : [],
            shadowOpacity: isBeingDragged ? 0.3 : 0.1,
            zIndex: isBeingDragged ? 10 : 1,
          },
        ]}
      >
        <TouchableOpacity style={styles.profileBlobContent} onPress={onProfilePress} activeOpacity={0.7}>
          <Text style={[styles.profileName, { color: styles.text.color }]}>{profile.name}</Text>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default ProfileBlob;
