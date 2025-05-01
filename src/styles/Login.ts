import { useCommonStyles } from "@/constants/Styles";
import { StyleSheet } from 'react-native';
import { useThemeColor } from "@/hooks/useThemeColor";

export const useLoginStyles = () => {
    const commonStyles = useCommonStyles();
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    return StyleSheet.create({
        ...commonStyles,
        scrollView: commonStyles.scrollViewContent,
        header: {
            ...commonStyles.header,
            marginBottom: 40,
        },
        registerContainer: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        registerText: {
            color: textColor,
            fontSize: 14,
        },
        registerLink: {
            color: primaryColor,
            fontSize: 14,
            fontWeight: 'bold',
            marginLeft: 5,
        },
    });
}
