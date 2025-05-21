import { FC } from "react";
import { Image, TouchableOpacity } from "react-native";
import { GestureDetector, SimultaneousGesture } from "react-native-gesture-handler";
import { Profile } from "@/src/types/entities";
import { useProfileStyles } from "@/src/styles/Profiles";
import { useProfileImages } from "@/hooks/useProfileImages";
import AdaptiveText from "@/components/AdaptiveText";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface ProfileBlobProps {
  profile: Profile;
  index: number;
  draggingIndex: number | null;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  getGestureHandlerProps: (index: number) => { gesture: SimultaneousGesture };
  handleProfilePress: (profile: Profile) => void;
  canItemBeClicked: () => boolean;
}

const ProfileBlob: FC<ProfileBlobProps> = ({
  profile,
  index,
  draggingIndex,
  translateX,
  translateY,
  getGestureHandlerProps,
  handleProfilePress,
  canItemBeClicked,
}) => {
  const styles = useProfileStyles();
  const { getProfileImage } = useProfileImages();
  const isBeingDragged = draggingIndex === index;

  const onProfilePress = () => {
    if (canItemBeClicked()) {
      handleProfilePress(profile);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (!isBeingDragged) {
      return {
        transform: [{ scale: 1 }, { translateX: 0 }, { translateY: 0 }],
        shadowOpacity: 0.1,
        zIndex: 1,
      };
    }

    return {
      transform: [{ scale: 0.5 }, { translateX: translateX.value * 2 }, { translateY: translateY.value * 2 }],
      shadowOpacity: 0.3,
      zIndex: 10,
    };
  });

  return (
    <GestureDetector key={profile.id} {...getGestureHandlerProps(index)}>
      <Animated.View style={[styles.profileBlob, animatedStyle]}>
        <TouchableOpacity style={styles.profileBlobContent} onPress={onProfilePress} activeOpacity={0.7}>
          <AdaptiveText text={profile.name} fontSize={32} numerator={400} denominator={0.8} styles={styles.profileName} />
          <Image source={getProfileImage(profile.name)} style={styles.profileImage} />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default ProfileBlob;
