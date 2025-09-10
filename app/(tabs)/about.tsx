import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Shield, Zap, Users, Clock, MessageCircle, Camera } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useTheme } from "@/contexts/ThemeContext";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";

export default function AboutScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkColors : LightColors;

  const styles = createStyles(Colors);

  const openEmail = () => Linking.openURL('mailto:support@xrayai.com');
  const openWebsite = () => Linking.openURL('http://localhost:8081');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 32, height: 32, resizeMode: 'contain' }}
            />
          </View>
          <Text style={styles.appName}>MediView AI</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Our App</Text>
          <Text style={styles.description}>
            MediViewAI is a cutting-edge mobile application that leverages artificial intelligence to analyze medical reports and provide detailed insights. Our advanced AI algorithms help healthcare models interpret results with greater clarity and accuracy.
          </Text>
        </View>
        {/* Key Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>

            <View style={styles.featureItem}>
              <Zap size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI-Powered Analysis</Text>
                <Text style={styles.featureDescription}>
                  Advanced AI algorithms analyze your medical reports instantly and provide clear insights in both professional and layman-friendly formats.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Shield size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Secure & Private</Text>
                <Text style={styles.featureDescription}>
                  Your medical data is encrypted, stored securely, and handled with the highest privacy standards.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Users size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>User-Friendly & Professional</Text>
                <Text style={styles.featureDescription}>
                  Designed for both healthcare professionals and patients, making medical insights easy to understand and use.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Camera size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Upload or Capture Reports</Text>
                <Text style={styles.featureDescription}>
                  Upload reports from your gallery or capture them directly with your camera for instant analysis.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MessageCircle size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI Chat Assistance</Text>
                <Text style={styles.featureDescription}>
                  Get general medical guidance, answer questions, or receive diet recommendations through the AI chatbot.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Clock size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>History & Logs</Text>
                <Text style={styles.featureDescription}>
                  Access all previous reports and analyses anytime through the history tab for easy reference.
                </Text>
              </View>
            </View>

          </View>
        </View>


        {/* Disclaimer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Notice</Text>
          <Text style={styles.disclaimer}>
            This application is designed to assist in medical analysis but should not replace
            professional medical advice, diagnosis, or treatment. Always consult with qualified
            healthcare professionals for medical decisions.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactButtons}>
            <Button
              title="Email Support"
              onPress={openEmail}
              variant="outline"
              style={styles.contactButton}
            />
            <Button
              title="Visit Website"
              onPress={openWebsite}
              variant="outline"
              style={styles.contactButton}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerIcon}>
            <Heart size={16} color={Colors.error} />
          </View>
          <Text style={styles.footerText}>
            Made with care for better healthcare
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Themed stylesheet function
const createStyles = (Colors: typeof LightColors | typeof DarkColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.primary },
    content: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 32 },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    appName: { fontSize: 28, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 4 },
    version: { fontSize: 16, color: Colors.text.secondary },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.text.primary, marginBottom: 12 },
    description: { fontSize: 16, color: Colors.text.secondary, lineHeight: 24 },
    disclaimer: {
      fontSize: 14,
      color: Colors.text.secondary,
      lineHeight: 20,
      fontStyle: 'italic',
      backgroundColor: Colors.background.secondary,
      padding: 16,
      borderRadius: 12,
    },
    featuresSection: { marginBottom: 24 },
    featuresList: { rowGap: 16 },
    featureItem: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 12 },
    featureContent: { flex: 1 },
    featureTitle: { fontSize: 16, fontWeight: '600', color: Colors.text.primary, marginBottom: 4 },
    featureDescription: { fontSize: 14, color: Colors.text.secondary, lineHeight: 18 },
    contactSection: { marginBottom: 32 },
    contactButtons: { rowGap: 12 },
    contactButton: { width: '100%' },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: 8,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    footerIcon: { opacity: 0.8 },
    footerText: { fontSize: 14, color: Colors.text.secondary },
  });
