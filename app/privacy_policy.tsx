import React from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useToSStyles } from "@/src/styles/ToS";
import Button from "@/components/Button";
import { ToSContent, TosSection, ToSSubsection } from "@/app/tos";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const t = useLanguageStore(state => state.t);
  const tObj = useLanguageStore(state => state.tObj);
  const language = useLanguageStore(state => state.language);
  const PP_EFFECTIVE_DATE = new Date("2025-05-26");
  const privacyPolicyData = tObj("privacyPolicy:sections");
  const styles = useToSStyles();

  const renderContent = (content: ToSContent) => {
    if (Array.isArray(content)) {
      return (
        <View style={styles.bulletListContainer}>
          {content.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    } else {
      return <Text style={styles.paragraph}>{content}</Text>;
    }
  };

  const renderSubsection = (title: string, data: ToSSubsection, key: string) => {
    return (
      <View key={key} style={styles.subsectionContainer}>
        <Text style={styles.subsectionTitle}>{title}</Text>
        <View>
          {data.content && renderContent(data.content)}

          {data.subsections &&
            Object.entries(data.subsections).map(([subKey, subsection]) => (
              <View key={subKey} style={styles.nestedSubsectionContainer}>
                <Text style={styles.nestedSubsectionTitle}>{subsection.title}</Text>
                {subsection.content && renderContent(subsection.content)}
              </View>
            ))}
        </View>
      </View>
    );
  };

  const renderSection = (key: string, section: TosSection, index: number) => {
    return (
      <View key={key} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionNumber}>{index + 1}.</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <View style={styles.contentContainer}>
          {section.content && renderContent(section.content)}
          {section.subsections &&
            Object.entries(section.subsections).map(([subKey, subsection]) => renderSubsection(subsection.title, subsection, subKey))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("privacyPolicy:title")}</Text>
            <Text style={styles.subtitle}>
              {t("privacyPolicy:effectiveDate", {
                date: PP_EFFECTIVE_DATE.toLocaleDateString(language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              })}
            </Text>
          </View>
          {Object.entries(privacyPolicyData).map(([key, section], index) => renderSection(key, section, index))}

          <Button text={""} icon={"home"} onPress={() => router.push("/")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
