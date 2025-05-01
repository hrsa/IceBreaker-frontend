import { useCommonStyles } from '@/constants/Styles';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Hook for Profiles screen styles
 */

export const useProfileStyles = () => {
  const commonStyles = useCommonStyles();
  const shadowColor = useThemeColor({}, 'shadow');

  return StyleSheet.create({
    ...commonStyles,
    profilesContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginVertical: 20,
    },
    profileBlob: {
      ...commonStyles.profileBlob,
      width: 120,
      height: 120,
      borderRadius: 60,
      margin: 12,
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 3, color: shadowColor, spreadDistance: 0 }],
      elevation: 2,
      borderWidth: 1,
      overflow: 'hidden',
    },
    profileBlobContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0,0,0,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    profileInitial: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    profileName: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 8,
      textTransform: 'uppercase',
    },
    emptyText: {
      ...commonStyles.text,
      textAlign: 'center',
      opacity: 0.7,
      padding: 20,
    },
    addButton: {
      justifyContent: 'center',
      alignSelf: 'center',
      width: 'auto',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 25,
      marginBottom: 20,
      boxShadow: [{ offsetX: 0, offsetY: 2, blurRadius: 3, color: shadowColor, spreadDistance: 0, inset: false }],
      elevation: 5,
    },
    addButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
      marginLeft: 8,
    },
    trashZone: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    trashZoneBlur: {
      width: '100%',
      height: '80%',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    input: {
      ...commonStyles.input,
      width: '100%',
      padding: 10,
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.5)',
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    createButton: {
      // backgroundColor set dynamically
    },
    createButtonText: {
      color: 'white',
      fontWeight: '600',
    },
  });
};
