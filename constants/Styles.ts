import { StyleSheet } from 'react-native';
import { Colors, ColorScheme } from './Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Common styles used across the app
 * This helps reduce duplication and makes the code more maintainable
 *
 * @param theme The current theme colors (light or dark)
 */

/**
 * Creates common styles with the provided theme
 */
export const createCommonStyles = (theme: ColorScheme) => {
  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      alignItems: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    centeredContainer: {
      width: 'auto',
      alignItems: 'center',
    },

    // Text styles
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 20,
      color: theme.text,
      opacity: 0.9,
      textAlign: 'center',
    },
    text: {
      fontSize: 16,
      color: theme.text,
    },
    errorText: {
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
    },

    // Input styles
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.text,
    },
    input: {
      backgroundColor: theme.inputBackground,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },

    // Button styles
    buttonContainer: {
      marginTop: 10,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: 'bold',
    },

    // Modal styles

    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.9)',
    },
    modalContent: {
      width: 'auto',
      paddingVertical: 30,
      paddingHorizontal: 30,
      borderRadius: 20,
      alignItems: 'center',
      overflow: 'hidden',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 48,
    },
    modalButtons: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      width: 'auto',
      gap: 40,
    },
    modalButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      textTransform: 'uppercase',
    },

    // Card styles
    card: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },

    profileBlob: {
      backgroundColor: theme.profileBackgroundColor,
      borderColor: theme.profileBackgroundColor,
    },
    trashZoneText: {
      color: theme.text,
      marginTop: 8,
      fontSize: 24,
      fontWeight: '600',
    },
  });
};

/**
 * Hook to get common styles with the current color scheme
 * This should be used inside React components
 */
export const useCommonStyles = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  return createCommonStyles(theme);
};
