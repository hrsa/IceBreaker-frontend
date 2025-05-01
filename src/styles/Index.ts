import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from 'react-native';

/**
 * Hook for Index screen styles
 */
export const useIndexStyles = () => {
    const commonStyles = useCommonStyles();

    return StyleSheet.create({
        ...commonStyles,
        userInfo: {
            marginBottom: 30,
            alignItems: 'center',
        },
        userText: {
            ...commonStyles.text,
            marginBottom: 5,
        },
    });
}
