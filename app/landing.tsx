import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Custom alert handler for mobile and web
const showAlert = (
  title: string,
  message: string,
  onPress?: () => void
) => {
  if (isWeb) {
    window.alert(`${title}: ${message}`);
    if (onPress) {
      onPress();
    }
  } else {
    Alert.alert(title, message, onPress ? [{ text: 'OK', onPress }] : [{ text: 'OK' }]);
  }
};

export default function LandingPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('home');
  const scrollRef = useRef<ScrollView>(null);
  const homeRef = useRef<View>(null);
  const featuresRef = useRef<View>(null);
  const futurePlansRef = useRef<View>(null);

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.dob || !formData.password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        password: formData.password,
      });
      showAlert('Success', 'Registration successful! Please check your email for OTP.', () =>
        router.replace(`/(auth)/login?email=${formData.email}`)
      );
    } catch (error) {
      showAlert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const success = await login(formData);
      if (success) {
        router.replace('/(tabs)/home');
      } else {
        showAlert('Error', 'Login failed');
      }
    } catch (error) {
      showAlert('Error', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAndroid = async () => {
    if (Platform.OS === 'android') {
      const apkUrl = 'https://expo.dev/artifacts/eas/jctheojEYDDn8C6AAUXWP7.apk';
      try {
        await Linking.openURL(apkUrl);
        showAlert(
          'Download Started',
          'Once the APK is downloaded, open it to install. You may need to enable "Install from Unknown Sources" in your device settings.'
        );
      } catch (error) {
        console.error('Failed to open download link:', error);
        showAlert('Error', 'Failed to start download. Please try again.');
      }
    } else {
      showAlert('Error', 'This download is only available for Android devices.');
    }
  };

  const handleDownloadIOS = async () => {
    showAlert('Coming Soon', 'The iOS version is not available yet. Stay tuned for future updates!');
  };

  const scrollToSection = (section: 'home' | 'features' | 'futurePlans') => {
    setActiveTab(section);
    setShowForm(false);
    const ref = section === 'home' ? homeRef : section === 'features' ? featuresRef : futurePlansRef;

    if (!scrollRef.current || !ref.current) {
      console.error('ScrollView or section ref is not available');
      return;
    }

    setTimeout(() => {
      ref.current!.measureLayout(
        scrollRef.current!.getScrollableNode(),
        (x, y) => {
          scrollRef.current!.scrollTo({ y, animated: true });
        },
        () => {
          console.error('Failed to measure layout');
          showAlert('Error', 'Failed to scroll to section. Please try again.');
        }
      );
    }, 100);
  };

  const handleShowForm = (register: boolean) => {
    setShowForm(true);
    setIsRegister(register);
    setActiveTab(null);
  };

  const features = [
    {
      title: 'AI-Powered Report Analysis',
      description:
        'Upload medical reports or X-rays and get instant AI-driven Doctor-Level and Layman-Friendly explanations.',
      icon: '🩺',
    },
    {
      title: 'Multiple Image Upload',
      description:
        'Upload multiple pages of reports or images at once. Future updates will support direct camera capture.',
      icon: '📄',
    },
    {
      title: 'Translation & Read Aloud',
      description:
        'Translate explanations into your preferred language or use the Read Aloud feature for accessibility.',
      icon: '🌍',
    },
    {
      title: 'History Tab',
      description: 'Access all your past uploads and analyses anytime in the History Tab.',
      icon: '📚',
    },
    {
      title: 'AI Chatbot Assistance',
      description:
        'Ask general medical questions, get advice, or receive diet plan suggestions with our AI chatbot.',
      icon: '🤖',
    },
    {
      title: 'Safe & Transparent',
      description:
        'All analyses are computer-generated with a clear disclaimer that they are not a replacement for professional medical advice.',
      icon: '🛡️',
    },
  ];

  const futurePlans = [
    {
      title: 'Find Nearby Healthcare Facilities',
      description:
        'Locate the nearest hospitals, clinics, and emergency rooms with real-time availability, ensuring you get care when you need it most.',
      icon: '🏥',
    },
    {
      title: 'Telehealth Integration',
      description:
        'Connect with healthcare professionals directly through the app for virtual consultations and follow-ups, making healthcare more accessible.',
      icon: '💻',
    },
    {
      title: 'Personalized Health Insights',
      description:
        'Receive tailored health recommendations based on your medical history and AI analysis, empowering you to take control of your wellness.',
      icon: '📊',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logoIcon}
              resizeMode="contain"
              onError={() => console.error('Failed to load logo image')}
            />
            <Text style={styles.logo}>MediView AI</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.navTabs}>
              <TouchableOpacity
                style={[styles.navTab, activeTab === 'home' && styles.activeTab]}
                onPress={() => scrollToSection('home')}
              >
                <Text style={[styles.navTabText, activeTab === 'home' && styles.activeTabText]}>
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navTab, activeTab === 'features' && styles.activeTab]}
                onPress={() => scrollToSection('features')}
              >
                <Text style={[styles.navTabText, activeTab === 'features' && styles.activeTabText]}>
                  Features
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navTab, activeTab === 'futurePlans' && styles.activeTab]}
                onPress={() => scrollToSection('futurePlans')}
              >
                <Text style={[styles.navTabText, activeTab === 'futurePlans' && styles.activeTabText]}>
                  Future Plans
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.loginButton} onPress={() => handleShowForm(false)}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.registerButton} onPress={() => handleShowForm(true)}>
                <Text style={styles.registerButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        {/* Content */}
        {showForm ? (
          /* Login/Register Form */
          <View style={styles.formSection}>
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>{isRegister ? 'Register' : 'Login'}</Text>
              {isRegister && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor={Colors.text.secondary}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (YYYY-MM-DD)"
                    placeholderTextColor={Colors.text.secondary}
                    value={formData.dob}
                    onChangeText={(text) => setFormData({ ...formData, dob: text })}
                  />
                </>
              )}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.text.secondary}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.text.secondary}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
              {isRegister && (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={Colors.text.secondary}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry
                />
              )}
              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: 16 }]}
                onPress={isRegister ? handleRegister : handleLogin}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setIsRegister(!isRegister)}
              >
                <Text style={styles.secondaryButtonText}>
                  Switch to {isRegister ? 'Login' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Hero Section */}
            <View style={styles.heroSection} ref={homeRef}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Welcome to MediViewAI — The Future of Healthcare Apps</Text>
                <Text style={styles.heroSubtitle}>
                  Upload medical reports or X-rays, get instant AI-powered analysis, and understand your health with clear, accessible explanations.
                </Text>
                <View style={styles.heroButtons}>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => handleShowForm(true)}>
                    <Text style={styles.primaryButtonText}>Get Started Free</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => handleShowForm(false)}
                  >
                    <Text style={styles.secondaryButtonText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.phoneContainer}>
                <View style={styles.mockupPhone}>
                  <View style={styles.phoneNotch} />
                  <View style={styles.phoneContent}>
                    <View style={styles.appIcon}>
                      <Text style={styles.appIconText}>🩺</Text>
                    </View>
                    <Text style={styles.appName}>MediView AI</Text>
                    <Text style={styles.appTagline}>Your Health, Simplified</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Features Section */}
            <View style={styles.featuresSection} ref={featuresRef}>
              <Text style={styles.sectionTitle}>Discover MediViewAI’s Powerful Features</Text>
              <Text style={styles.sectionSubtitle}>
                From AI analysis to accessibility, explore what makes MediViewAI unique.
              </Text>
              <View style={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Future Plans Section */}
            <View style={styles.futurePlansSection} ref={futurePlansRef}>
              <Text style={styles.sectionTitle}>Our Vision for the Future</Text>
              <Text style={styles.sectionSubtitle}>
                MediViewAI is evolving to make healthcare more accessible and connected. Here’s what’s coming next.
              </Text>
              <View style={styles.featuresGrid}>
                {futurePlans.map((plan, index) => (
                  <View key={index} style={styles.featureCard}>
                    <Text style={styles.featureIcon}>{plan.icon}</Text>
                    <Text style={styles.featureTitle}>{plan.title}</Text>
                    <Text style={styles.featureDescription}>{plan.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Download Section */}
            <View style={styles.downloadSection}>
              <Text style={styles.sectionTitle}>Download MediViewAI</Text>
              <Text style={styles.sectionSubtitle}>
                Experience smarter healthcare on your Android device. iOS coming soon!
              </Text>
              <View style={styles.downloadButtons}>
                <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadAndroid}>
                  <Text style={styles.downloadIcon}>🤖</Text>
                  <View style={styles.downloadTextContainer}>
                    <Text style={styles.downloadText}>Download for</Text>
                    <Text style={styles.downloadPlatform}>Android</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadIOS}>
                  <Text style={styles.downloadIcon}>🍎</Text>
                  <View style={styles.downloadTextContainer}>
                    <Text style={styles.downloadText}>Download for</Text>
                    <Text style={styles.downloadPlatform}>iOS</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              <Text style={styles.ctaTitle}>Ready to Make Healthcare Smarter?</Text>
              <Text style={styles.ctaSubtitle}>
                Join thousands using MediViewAI to make medical reports understandable and accessible.
              </Text>
              <TouchableOpacity style={styles.ctaButton} onPress={() => handleShowForm(true)}>
                <Text style={styles.ctaButtonText}>Start Your Journey Today</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 MediView AI. All Rights Reserved.</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerLink}>Contact Us</Text>
          <Text style={styles.footerLink}>Support</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: isWeb ? 80 : 100,
  },
  // Header Styles
  header: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: isWeb ? 16 : 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: isWeb ? 1200 : width,
    alignSelf: 'center',
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: isWeb ? 40 : 32,
    height: isWeb ? 40 : 32,
  },
  logo: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  loginButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  registerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  registerButtonText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  // Navigation Tabs
  navTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  navTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  navTabText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  // Hero Section Styles
  heroSection: {
    flexDirection: isWeb && width > 768 ? 'row' : 'column',
    alignItems: 'center',
    padding: 40,
    maxWidth: isWeb ? 1200 : width,
    alignSelf: 'center',
    width: '100%',
    minHeight: isWeb ? 600 : 'auto',
    marginTop: isWeb ? 80 : 100,
  },
  heroContent: {
    flex: 1,
    paddingRight: isWeb && width > 768 ? 40 : 0,
    alignItems: isWeb && width > 768 ? 'flex-start' : 'center',
  },
  heroTitle: {
    fontSize: isWeb ? 48 : 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    lineHeight: isWeb ? 56 : 40,
    marginBottom: 16,
    textAlign: isWeb && width > 768 ? 'left' : 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    lineHeight: 28,
    marginBottom: 32,
    textAlign: isWeb && width > 768 ? 'left' : 'center',
    maxWidth: isWeb ? 500 : '100%',
  },
  heroButtons: {
    flexDirection: isWeb && width > 768 ? 'row' : 'column',
    gap: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: isWeb ? 200 : width * 0.8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    minWidth: isWeb ? 200 : width * 0.8,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  // Phone Mockup Styles
  phoneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isWeb && width > 768 ? 0 : 40,
  },
  mockupPhone: {
    width: isWeb ? 250 : 200,
    height: isWeb ? 500 : 400,
    backgroundColor: Colors.background.secondary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    position: 'relative',
  },
  phoneNotch: {
    position: 'absolute',
    top: 20,
    width: 60,
    height: 4,
    backgroundColor: Colors.text.secondary,
    borderRadius: 2,
  },
  phoneContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  appIcon: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 32,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  // Form Section Styles
  formSection: {
    padding: 40,
    alignItems: 'center',
    maxWidth: isWeb ? 1200 : width,
    alignSelf: 'center',
    width: '100%',
    marginTop: isWeb ? 80 : 100,
    minHeight: height - (isWeb ? 160 : 200),
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    backgroundColor: Colors.background.primary,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  // Features Section Styles
  featuresSection: {
    padding: 40,
    backgroundColor: Colors.background.secondary,
  },
  // Future Plans Section Styles
  futurePlansSection: {
    padding: 40,
    backgroundColor: Colors.background.primary,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 48,
    maxWidth: 600,
    alignSelf: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    maxWidth: isWeb ? 1200 : width,
    alignSelf: 'center',
  },
  featureCard: {
    backgroundColor: Colors.background.primary,
    padding: 24,
    borderRadius: 15,
    width: isWeb && width > 768 ? 350 : width - 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Download Section Styles
  downloadSection: {
    padding: 40,
    backgroundColor: Colors.background.primary,
  },
  downloadButtons: {
    flexDirection: isWeb && width > 768 ? 'row' : 'column',
    justifyContent: 'center',
    gap: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    minWidth: 200,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  downloadTextContainer: {
    flex: 1,
  },
  downloadText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  downloadPlatform: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  // CTA Section Styles
  ctaSection: {
    padding: 60,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 18,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 500,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  ctaButtonText: {
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 18,
  },
  // Footer Styles
  footer: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  footerLink: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
});