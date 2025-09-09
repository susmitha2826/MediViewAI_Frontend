import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.dob || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
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

      Alert.alert('Success', 'Registration successful! Please check your email for OTP.', [
        { text: 'OK', onPress: () => 
            // router.replace(`/(auth)/verify-otp?email=${formData.email}`)
          router.replace(`/(auth)/login?email=${formData.email}`) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.appName}>MediViewAI</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to analyze your X-rays with AI</Text>
          </View>

          <View style={styles.formBox}>
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter your full name"
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Date of Birth"
              value={formData.dob}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dob: text }))}
              placeholder="DD-MM-YYYY"
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              placeholder="Enter your password"
              isPassword
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
              placeholder="Confirm your password"
              isPassword
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.loginButton}
            />

            <Button
              title="Already have an account? Sign In"
              onPress={() => router.replace('/(auth)/login')}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  formBox: {
    width: '85%',
    maxWidth: 380,
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
});
