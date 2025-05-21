export const useProfileImages = () => {
  type ProfileImageKeys = keyof typeof profileImages;

  const profileImages = {
    blue: require("../assets/images/profiles/blue.png"),
    brown: require("../assets/images/profiles/brown.png"),
    green: require("../assets/images/profiles/green.png"),
    orange: require("../assets/images/profiles/orange.png"),
    paleGreen: require("../assets/images/profiles/palegreen.png"),
    pink: require("../assets/images/profiles/pink.png"),
    red: require("../assets/images/profiles/red.png"),
    violet: require("../assets/images/profiles/violet.png"),
    yellow: require("../assets/images/profiles/yellow.png"),
  };

  function getProfileImage(str: string) {
    const keys = Object.keys(profileImages) as ProfileImageKeys[];

    if (keys.length === 0) {
      throw new Error("Object must have at least one key");
    }
    const hash = simpleHash(str);
    const index = hash % keys.length;

    return profileImages[keys[index]];
  }

  function simpleHash(str: string): number {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  return { getProfileImage };
};
