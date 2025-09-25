import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Shield, Zap, Users, Clock, MessageCircle, Camera, Mail, Globe, ArrowUpRight } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useTheme } from "@/contexts/ThemeContext";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkColors : LightColors;

  const styles = createStyles(Colors);

  const openEmail = () => Linking.openURL('mailto:support@xrayai.com');
  const openWebsite = () => Linking.openURL('http://localhost:8081');

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your medical reports instantly and provide clear insights in both professional and layman-friendly formats."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical data is encrypted, stored securely, and handled with the highest privacy standards."
    },
    {
      icon: Users,
      title: "User-Friendly & Professional",
      description: "Designed for both healthcare professionals and patients, making medical insights easy to understand and use."
    },
    {
      icon: Camera,
      title: "Upload or Capture Reports",
      description: "Upload reports from your gallery or capture them directly with your camera for instant analysis."
    },
    {
      icon: MessageCircle,
      title: "AI Chat Assistance",
      description: "Get general medical guidance, answer questions, or receive diet recommendations through the AI chatbot."
    },
    {
      icon: Clock,
      title: "History & Logs",
      description: "Access all previous reports and analyses anytime through the history tab for easy reference."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <View style={styles.logoInner}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logoImage}
                />
              </View>
            </View>
            <View style={styles.logoGlow} />
          </View>
          
          <Text style={styles.appName}>MediView AI</Text>
          <Text style={styles.tagline}>Intelligent Medical Analysis</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.1.0</Text>
          </View>
        </View>

        {/* About Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>About Our App</Text>
            <View style={styles.titleUnderline} />
          </View>
          <Text style={styles.description}>
            MediViewAI is a cutting-edge mobile application that leverages artificial intelligence to analyze medical reports and provide detailed insights. Our advanced AI algorithms help healthcare professionals interpret results with greater clarity and accuracy.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <feature.icon size={24} color={Colors.primary} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer Card */}
        <View style={[styles.card, styles.disclaimerCard]}>
          <View style={styles.disclaimerHeader}>
            <Shield size={20} color={Colors.warning || Colors.primary} />
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This application is designed to assist in medical analysis but should not replace
            professional medical advice, diagnosis, or treatment. Always consult with qualified
            healthcare professionals for medical decisions.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.contactSubtitle}>
            Have questions or need support? We're here to help.
          </Text>
          
          <View style={styles.contactGrid}>
            <View style={styles.contactCard}>
              <View style={styles.contactIconContainer}>
                <Mail size={24} color={Colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Button
                title="Contact Us"
                onPress={openEmail}
                variant="primary"
                style={styles.contactButton}
              />
            </View>
            
            <View style={styles.contactCard}>
              <View style={styles.contactIconContainer}>
                <Globe size={24} color={Colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Visit Website</Text>
              <Button
                title="Learn More"
                onPress={openWebsite}
                variant="outline"
                style={styles.contactButton}
              />
            </View>
          </View>
        </View>

        {/* Enhanced Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.heartContainer}>
              <Heart size={18} color={Colors.error} fill={Colors.error} />
            </View>
            <Text style={styles.footerText}>
              Made with care for better healthcare
            </Text>
          </View>
          <Text style={styles.copyrightText}>
            © 2024 MediView AI. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Enhanced stylesheet with modern design
const createStyles = (Colors: typeof LightColors | typeof DarkColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background.primary,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    
    // Hero Section
    heroSection: {
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 40,
      paddingHorizontal: 20,
    },
    logoContainer: {
      position: 'relative',
      marginBottom: 24,
    },
    logoBackground: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    logoInner: {
      width: 85,
      height: 85,
      borderRadius: 42.5,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImage: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    logoGlow: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors.primary,
      opacity: 0.1,
      top: -10,
      left: -10,
    },
    appName: {
      fontSize: 32,
      fontWeight: 'bold',
      color: Colors.text.primary,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    tagline: {
      fontSize: 16,
      color: Colors.text.secondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    versionBadge: {
      backgroundColor: Colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.primary + '40',
    },
    versionText: {
      fontSize: 12,
      color: Colors.primary,
      fontWeight: '600',
    },

    // Cards
    card: {
      backgroundColor: Colors.background.secondary,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: Colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: Colors.border + '40',
    },
    cardHeader: {
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.text.primary,
      marginBottom: 8,
    },
    titleUnderline: {
      width: 40,
      height: 3,
      backgroundColor: Colors.primary,
      borderRadius: 2,
    },
    description: {
      fontSize: 16,
      color: Colors.text.secondary,
      lineHeight: 24,
    },

    // Features Section
    featuresSection: {
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.text.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 16,
    },
    featureCard: {
      width: (width - 60) / 2,
      backgroundColor: Colors.background.secondary,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: Colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: Colors.border + '30',
    },
    featureIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: Colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.text.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    featureDescription: {
      fontSize: 12,
      color: Colors.text.secondary,
      textAlign: 'center',
      lineHeight: 16,
    },

    // Disclaimer
    disclaimerCard: {
      backgroundColor: (Colors.warning || Colors.primary) + '10',
      borderColor: (Colors.warning || Colors.primary) + '30',
    },
    disclaimerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    disclaimerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.text.primary,
      marginLeft: 8,
    },
    disclaimerText: {
      fontSize: 14,
      color: Colors.text.secondary,
      lineHeight: 20,
      fontStyle: 'italic',
    },

    // Contact Section
    contactSection: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    contactSubtitle: {
      fontSize: 16,
      color: Colors.text.secondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    contactGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    contactCard: {
      flex: 1,
      backgroundColor: Colors.background.secondary,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border + '40',
    },
    contactIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    contactLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.text.primary,
      marginBottom: 16,
      textAlign: 'center',
    },
    contactButton: {
      width: '100%',
      paddingVertical: 12,
    },

    // Footer
    footer: {
      marginTop: 20,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: Colors.border + '30',
      alignItems: 'center',
    },
    footerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    heartContainer: {
      marginRight: 8,
    },
    footerText: {
      fontSize: 14,
      color: Colors.text.secondary,
      fontWeight: '500',
    },
    copyrightText: {
      fontSize: 12,
      color: Colors.text.secondary,
      opacity: 0.7,
    },
  });