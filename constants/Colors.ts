export interface ColorScheme {
    text: string;
    background: string;
    tint: string;
    icon: string;
    border: string;
    card: string;
    placeholder: string;
    inputBackground: string;
    shadow: string;
    tabIconDefault: string;
    tabIconSelected: string;
    primary: string;
    secondary: string;
    profileBackgroundColor: string;
}

export interface Colors {
    light: ColorScheme;
    dark: ColorScheme;
}

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors: Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        primary: '#0a7ea4',
        secondary: '#4ECDC4',
        border: '#E6E8EB',
        card: '#F9FAFB',
        placeholder: '#9BA1A6',
        inputBackground: '#F9FAFB',
        shadow: '#555555',
        profileBackgroundColor: '#6f5013',
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        primary: '#0a7ea4',
        secondary: '#4ECDC4',
        border: '#2E3235',
        card: '#1E2022',
        placeholder: '#687076',
        inputBackground: '#1E2022',
        shadow: '#999999',
        profileBackgroundColor: '#fba50b',
    },
};
