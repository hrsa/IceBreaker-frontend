import { useCommonStyles } from "@/constants/Styles";
import { TouchableOpacity, View, Text, ViewStyle } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLanguageStore } from "@/src/stores/languageStore";

type CopyableFieldProps = {
  textContent: string;
  style?: ViewStyle;
};

export function CopyableField({ textContent, style }: CopyableFieldProps) {
  const styles = useCommonStyles();
  const t = useLanguageStore(state => state.t);
  const language = useLanguageStore(state => state.language);
  const [copiedText, setCopiedText] = useState(false);

  const copyTextContent = async () => {
    await Clipboard.setStringAsync(textContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <View style={[styles.inputContainer, style]}>
      <TouchableOpacity style={styles.background} onPress={copyTextContent}>
        <View style={[styles.input, styles.centerContent]}>
          <Text
            style={{
              ...styles.text,
              paddingRight: 35,
            }}
          >
            {copiedText ? t("common:copy_success") : textContent}
          </Text>
          <Ionicons name={"copy"} size={24} color={styles.text.color} style={{ position: "absolute", right: 10 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
