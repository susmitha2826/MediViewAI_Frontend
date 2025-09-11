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

// Device detection utilities
const isAndroidDevice = () => {
  if (Platform.OS === 'android') return true;
  if (isWeb) {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /android/i.test(userAgent);
  }
  return false;
};

const isIOSDevice = () => {
  if (Platform.OS === 'ios') return true;
  if (isWeb) {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  }
  return false;
};

const isMobileDevice = () => {
  return isAndroidDevice() || isIOSDevice() || width < 768;
};

// Improved responsive breakpoints
const getResponsiveValue = (mobile: any, tablet: any, desktop: any) => {
  if (width < 600) return mobile;
  if (width < 1024) return tablet;
  return desktop;
};

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      if (success?.status && success?.data) {
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
    const apkUrl = 'https://expo.dev/artifacts/eas/jctheojEYDDn8C6AAUXWP7.apk';

    if (isAndroidDevice()) {
      try {
        const supported = await Linking.canOpenURL(apkUrl);
        if (supported) {
          await Linking.openURL(apkUrl);
          showAlert(
            'Download Started',
            'Once the APK is downloaded, open it to install. You may need to enable "Install from Unknown Sources" in your device settings.'
          );
        } else {
          showAlert('Error', 'Unable to open download link. Please try again or download manually.');
        }
      } catch (error) {
        console.error('Failed to open download link:', error);
        showAlert('Error', 'Failed to start download. Please try again.');
      }
    } else if (isMobileDevice() && !isAndroidDevice()) {
      showAlert(
        'Wrong Device',
        'This APK is specifically for Android devices. You appear to be using an iOS device. Please use an Android device to download this app, or wait for the iOS version.'
      );
    } else {
      showAlert(
        'Mobile Device Required',
        'This download is optimized for mobile devices. Please visit this page on your Android device to download the app.'
      );
    }
  };

  const handleDownloadIOS = async () => {
    if (isIOSDevice()) {
      showAlert('Coming Soon for iOS', 'The iOS version is currently in development. We\'ll notify you when it\'s available on the App Store!');
    } else if (isMobileDevice()) {
      showAlert('Coming Soon', 'The iOS version is not available yet. This will be released on the Apple App Store soon!');
    } else {
      showAlert('Coming Soon', 'The iOS version is not available yet. Please visit this page on your iOS device when it\'s released!');
    }
  };

  const scrollToSection = (section: 'home' | 'features' | 'futurePlans') => {
    setActiveTab(section);
    setShowForm(false);
    setShowMobileMenu(false);

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
    setShowMobileMenu(false);
  };

  const features = [
    {
      title: 'AI-Powered Report Analysis',
      description: 'Upload medical reports or X-rays and get instant AI-driven Doctor-Level and Layman-Friendly explanations.',
      icon: '🩺',
    },
    {
      title: 'Multiple Image Upload',
      description: 'Upload multiple pages of reports or images at once. Future updates will support direct camera capture.',
      icon: '📄',
    },
    {
      title: 'Translation & Read Aloud',
      description: 'Translate explanations into your preferred language or use the Read Aloud feature for accessibility.',
      icon: '🌍',
    },
    {
      title: 'History Tab',
      description: 'Access all your past uploads and analyses anytime in the History Tab.',
      icon: '📚',
    },
    {
      title: 'AI Chatbot Assistance',
      description: 'Ask general medical questions, get advice, or receive diet plan suggestions with our AI chatbot.',
      icon: '🤖',
    },
    {
      title: 'Safe & Transparent',
      description: 'All analyses are computer-generated with a clear disclaimer that they are not a replacement for professional medical advice.',
      icon: '🛡️',
    },
  ];

  const futurePlans = [
    {
      title: 'Find Nearby Healthcare Facilities',
      description: 'Locate the nearest hospitals, clinics, and emergency rooms with real-time availability, ensuring you get care when you need it most.',
      icon: '🏥',
    },
    {
      title: 'Telehealth Integration',
      description: 'Connect with healthcare professionals directly through the app for virtual consultations and follow-ups, making healthcare more accessible.',
      icon: '💻',
    },
    {
      title: 'Personalized Health Insights',
      description: 'Receive tailored health recommendations based on your medical history and AI analysis, empowering you to take control of your wellness.',
      icon: '📊',
    },
  ];

  const styles = createResponsiveStyles();

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
            {!isMobileDevice() && (
              <>
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
              </>
            )}

            {isMobileDevice() && (
              <TouchableOpacity
                style={styles.mobileMenuButton}
                onPress={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Text style={styles.mobileMenuIcon}>{showMobileMenu ? '✕' : '☰'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Mobile Menu */}
        {isMobileDevice() && showMobileMenu && (
          <View style={styles.mobileMenu}>
            <TouchableOpacity
              style={styles.mobileMenuItem}
              onPress={() => scrollToSection('home')}
            >
              <Text style={styles.mobileMenuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileMenuItem}
              onPress={() => scrollToSection('features')}
            >
              <Text style={styles.mobileMenuText}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileMenuItem}
              onPress={() => scrollToSection('futurePlans')}
            >
              <Text style={styles.mobileMenuText}>Future Plans</Text>
            </TouchableOpacity>
            <View style={styles.mobileMenuButtons}>
              <TouchableOpacity style={styles.mobileLoginButton} onPress={() => handleShowForm(false)}>
                <Text style={styles.mobileLoginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileRegisterButton} onPress={() => handleShowForm(true)}>
                <Text style={styles.mobileRegisterButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
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
              <TouchableOpacity
                style={[styles.secondaryButton, { marginTop: 16 }]}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.secondaryButtonText}>Back to Home</Text>
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

              {width > 768 && (
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
              )}
            </View>

            {/* Features Section */}
            <View style={styles.featuresSection} ref={featuresRef}>
              <Text style={styles.sectionTitle}>Discover MediViewAI's Powerful Features</Text>
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
                MediViewAI is evolving to make healthcare more accessible and connected. Here's what's coming next.
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
                Experience smarter healthcare on your mobile device. {isAndroidDevice() ? 'Download now for Android!' : isIOSDevice() ? 'iOS version coming soon!' : 'Available for Android devices!'}
              </Text>
              <View style={styles.downloadButtons}>
                <TouchableOpacity
                  style={[
                    styles.downloadButton,
                    !isAndroidDevice() && isMobileDevice() && styles.downloadButtonDisabled
                  ]}
                  onPress={handleDownloadAndroid}
                >
                  <Text style={styles.downloadIcon}>🤖</Text>
                  <View style={styles.downloadTextContainer}>
                    <Text style={styles.downloadText}>
                      {isAndroidDevice() ? 'Download Now' : 'Download for'}
                    </Text>
                    <Text style={styles.downloadPlatform}>Android</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.downloadButton, styles.downloadButtonDisabled]}
                  onPress={handleDownloadIOS}
                >
                  <Text style={styles.downloadIcon}>🍎</Text>
                  <View style={styles.downloadTextContainer}>
                    <Text style={styles.downloadText}>Coming Soon</Text>
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

function createResponsiveStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background.primary,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100, // Space for footer
    },

    // Header Styles - Improved mobile spacing
    header: {
      backgroundColor: Colors.background.secondary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: Platform.OS === 'ios' ? 50 : 16,
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
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logoIcon: {
      width: 28,
      height: 28,
    },
    logo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primary,
    },

    // Navigation Styles
    navTabs: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    navTab: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: Colors.primary,
    },
    navTabText: {
      fontSize: 14,
      color: Colors.text.secondary,
      fontWeight: '500',
    },
    activeTabText: {
      color: Colors.primary,
      fontWeight: '600',
    },

    // Header Button Styles
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    loginButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    loginButtonText: {
      color: Colors.primary,
      fontWeight: '500',
      fontSize: 14,
    },
    registerButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: Colors.primary,
      borderRadius: 6,
    },
    registerButtonText: {
      color: Colors.text.primary,
      fontWeight: '500',
      fontSize: 14,
    },

    // Mobile Menu Styles
    mobileMenuButton: {
      padding: 8,
    },
    mobileMenuIcon: {
      fontSize: 20,
      color: Colors.primary,
    },
    mobileMenu: {
      backgroundColor: Colors.background.secondary,
      paddingTop: 12,
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    mobileMenuItem: {
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    mobileMenuText: {
      fontSize: 16,
      color: Colors.text.secondary,
      fontWeight: '500',
    },
    mobileMenuButtons: {
      flexDirection: 'column',
      gap: 8,
      marginTop: 12,
    },
    mobileLoginButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: Colors.primary,
      alignItems: 'center',
    },
    mobileLoginButtonText: {
      color: Colors.primary,
      fontWeight: '500',
    },
    mobileRegisterButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: Colors.primary,
      borderRadius: 6,
      alignItems: 'center',
    },
    mobileRegisterButtonText: {
      color: Colors.text.primary,
      fontWeight: '500',
    },

    // Hero Section Styles - Major improvements for mobile
    heroSection: {
      flexDirection: width > 768 ? 'row' : 'column',
      alignItems: 'center',
      padding: getResponsiveValue(16, 24, 32),
      paddingTop: getResponsiveValue(80, 100, 120),
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
      minHeight: getResponsiveValue(300, 400, 500),
    },
    heroContent: {
      flex: 1,
      paddingRight: width > 768 ? 32 : 0,
      alignItems: width > 768 ? 'flex-start' : 'center',
    },
    heroTitle: {
      fontSize: getResponsiveValue(24, 32, 40),
      fontWeight: 'bold',
      color: Colors.text.primary,
      lineHeight: getResponsiveValue(30, 40, 48),
      marginBottom: 12,
      textAlign: width > 768 ? 'left' : 'center',
    },
    heroSubtitle: {
      fontSize: getResponsiveValue(14, 16, 18),
      color: Colors.text.secondary,
      lineHeight: getResponsiveValue(20, 24, 26),
      marginBottom: 24,
      textAlign: width > 768 ? 'left' : 'center',
      maxWidth: 500,
    },
    heroButtons: {
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center',
      width: '100%',
    },

    // Button Styles - Better mobile sizing
    primaryButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      width: getResponsiveValue('100%', 250, 200),
      maxWidth: 300,
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
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.primary,
      alignItems: 'center',
      width: getResponsiveValue('100%', 250, 200),
      maxWidth: 300,
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
      marginTop: 32,
    },
    mockupPhone: {
      width: 200,
      height: 400,
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
      width: 60,
      height: 60,
      backgroundColor: Colors.primary,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    appIconText: {
      fontSize: 28,
    },
    appName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.text.primary,
      marginBottom: 8,
    },
    appTagline: {
      fontSize: 12,
      color: Colors.text.secondary,
      textAlign: 'center',
    },

    // Form Section Styles - Improved mobile layout
    formSection: {
      padding: getResponsiveValue(16, 24, 32),
      alignItems: 'center',
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
      paddingTop: getResponsiveValue(80, 100, 120),
      minHeight: height - 200,
    },
    formContainer: {
      width: '100%',
      maxWidth: 400,
      padding: 20,
      backgroundColor: Colors.background.secondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    input: {
      backgroundColor: Colors.background.primary,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      marginBottom: 12,
      fontSize: 16,
      color: Colors.text.primary,
    },

    // Section Styles - Better mobile spacing
    featuresSection: {
      padding: getResponsiveValue(16, 24, 32),
      backgroundColor: Colors.background.secondary,
    },
    futurePlansSection: {
      padding: getResponsiveValue(16, 24, 32),
      backgroundColor: Colors.background.primary,
    },
    sectionTitle: {
      fontSize: getResponsiveValue(24, 28, 32),
      fontWeight: 'bold',
      color: Colors.text.primary,
      textAlign: 'center',
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    sectionSubtitle: {
      fontSize: getResponsiveValue(14, 16, 17),
      color: Colors.text.secondary,
      textAlign: 'center',
      marginBottom: getResponsiveValue(24, 32, 40),
      maxWidth: 600,
      alignSelf: 'center',
      paddingHorizontal: 16,
      lineHeight: getResponsiveValue(20, 22, 24),
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: getResponsiveValue(12, 16, 20),
      maxWidth: 1200,
      alignSelf: 'center',
      paddingHorizontal: getResponsiveValue(0, 16, 0),
    },
    featureCard: {
      backgroundColor: Colors.background.primary,
      padding: getResponsiveValue(16, 18, 20),
      borderRadius: 12,
      width: getResponsiveValue(
        width - 32,
        width > 600 ? (width - 80) / 2 : width - 48,
        width > 900 ? 350 : (width - 80) / 2
      ),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    featureIcon: {
      fontSize: getResponsiveValue(32, 36, 40),
      marginBottom: 12,
    },
    featureTitle: {
      fontSize: getResponsiveValue(16, 17, 18),
      fontWeight: '600',
      color: Colors.text.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    featureDescription: {
      fontSize: getResponsiveValue(12, 13, 14),
      color: Colors.text.secondary,
      textAlign: 'center',
      lineHeight: getResponsiveValue(16, 18, 20),
    },

    // Download Section Styles - Fixed mobile layout
    downloadSection: {
      padding: getResponsiveValue(16, 24, 32),
      backgroundColor: Colors.background.primary,
    },
    downloadButtons: {
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 16,
      alignItems: 'center',
      marginTop: 24,
    },
    downloadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.background.secondary,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.primary,
      width: getResponsiveValue('100%', 280, 250),
      maxWidth: 320,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    downloadButtonDisabled: {
      opacity: 0.6,
      borderColor: Colors.text.secondary,
      shadowOpacity: 0.1,
    },
    downloadIcon: {
      fontSize: 28,
      marginRight: 12,
    },
    downloadTextContainer: {
      flex: 1,
    },
    downloadText: {
      fontSize: 11,
      color: Colors.text.secondary,
    },
    downloadPlatform: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.text.primary,
    },

    // CTA Section Styles
    ctaSection: {
      padding: getResponsiveValue(24, 32, 40),
      backgroundColor: Colors.background.secondary,
      alignItems: 'center',
    },
    ctaTitle: {
      fontSize: getResponsiveValue(24, 28, 32),
      fontWeight: 'bold',
      color: Colors.text.primary,
      marginBottom: 12,
      textAlign: 'center',
      paddingHorizontal: 16,
    },
    ctaSubtitle: {
      fontSize: getResponsiveValue(14, 16, 17),
      color: Colors.text.secondary,
      marginBottom: 24,
      textAlign: 'center',
      maxWidth: 500,
      paddingHorizontal: 16,
      lineHeight: getResponsiveValue(20, 22, 24),
    },
    ctaButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 8,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
      width: getResponsiveValue('100%', 280, 250),
      maxWidth: 320,
      alignItems: 'center',
    },
    ctaButtonText: {
      color: Colors.text.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    // Footer Styles - Better mobile layout
    footer: {
      backgroundColor: Colors.background.primary,
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      alignItems: 'center',
    },
    footerText: {
      color: Colors.text.secondary,
      fontSize: getResponsiveValue(11, 12, 13),
      marginBottom: 8,
      textAlign: 'center',
    },
    footerLinks: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      columnGap: 24, // horizontal space between items
      rowGap: 12,    // vertical space between rows
    },
    footerLink: {
      color: Colors.text.secondary,
      fontSize: getResponsiveValue(10, 11, 12),
      textAlign: 'center',
      minWidth: '45%', // 👈 forces roughly 2 per row
    },

  });
}