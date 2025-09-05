import ChatScreen from '../../utils/chat';
import { X, MessageCircle, Camera, Upload, FileImage, AlertTriangle, Zap, Volume2, Languages, StopCircle, FileText } from 'lucide-react-native';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Markdown from 'react-native-markdown-display';
import { useSpeech } from '@/utils/ttsService';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from '@/styles/homeStyles';

import { useTheme } from "@/contexts/ThemeContext";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";
export default function HomeScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkColors : LightColors;

  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { isSpeaking, isLoading1, toggleSpeak } = useSpeech();
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  const subtitles = [
    "Your health buddy 🤝",
    "Here to explain in simple words ✨",
    "Always by your side 💙",
    "Guiding you through your reports 📋",
  ];
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        setIndex((prev) => (prev + 1) % subtitles.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery access to upload X-rays');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access to take X-ray photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const base64 = selectedImage.split(',')[1];
      const response = await apiService.analyzeXray(base64);
      if (response?.data) setResult(response.data);
      else if (response?.msg) setResult(response.msg);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setLanguage('en');
    setIsAnalyzing(false);
  };

  const translateResult = async (targetLang: string) => {
    if (!result) return;
    setIsTranslating(true);
    try {
      const response: any = await apiService.translateText(result, targetLang);
      setResult(response?.data);
      setLanguage(targetLang);
    } catch (error) {
      console.error("Translation error:", error);
      Alert.alert("Error", "Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors.text.primary }]}>MediView AI</Text>
          <Animated.Text style={[styles.subtitle, { opacity: fadeAnim, color: Colors.text.secondary }]}>
            {subtitles[index]}
          </Animated.Text>
        </View>

        {/* Disclaimer */}
        <View style={[styles.disclaimerCard, { backgroundColor: Colors.background.secondary }]}>
          <AlertTriangle color={Colors.warning} size={20} />
          <Text style={[styles.disclaimerText, { color: Colors.text.primary }]}>
            This tool provides educational insights only and is not a substitute for professional medical diagnosis.
          </Text>
        </View>

        {/* Upload Section */}
        <View style={[styles.uploadSection, { backgroundColor: Colors.background.secondary }]}>
          <Text style={[styles.sectionTitle, { color: Colors.text.primary }]}>Upload X-ray Image</Text>

          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity style={styles.changeImageButton} onPress={clearImage}>
                <Text style={[styles.changeImageText, { color: Colors.primary }]}>Clear Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: Colors.background.tertiary }]} onPress={takePhoto}>
                <Camera color={Colors.primary} size={32} />
                <Text style={[styles.uploadButtonText, { color: Colors.text.primary }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.uploadButton, { backgroundColor: Colors.background.tertiary }]} onPress={pickImageFromGallery}>
                <FileImage color={Colors.primary} size={32} />
                <Text style={[styles.uploadButtonText, { color: Colors.text.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.supportedFormats}>
            <FileText color={Colors.text.light} size={16} />
            <Text style={[styles.supportedText, { color: Colors.text.light }]}>
              Supports X-rays, MRIs, CT scans, lab reports, and other medical documents
            </Text>
          </View>
        </View>

        {/* Analyze Button */}
        {selectedImage && (
          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: Colors.primary }, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color={Colors.text.white} size="small" />
            ) : (
              <Upload color={Colors.text.white} size={20} />
            )}
            <Text style={[styles.analyzeButtonText, { color: Colors.text.white }]}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze X-ray'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Result Section */}
        {result && (
          <View style={[styles.resultContainer, { backgroundColor: Colors.background.secondary }]}>
            <View style={styles.resultHeader}>
              <Zap size={20} color={Colors.accent} />
              <Text style={[styles.resultTitle, { color: Colors.text.primary }]}>Analysis Result</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto", gap: 8 }}>
                <TouchableOpacity onPress={() => toggleSpeak(result, language)} disabled={isLoading1 || isTranslating}>
                  {isLoading1 ? (
                    <ActivityIndicator size="small" color={Colors.text.light} />
                  ) : isSpeaking ? (
                    <StopCircle size={20} color={Colors.danger} />
                  ) : (
                    <Volume2 size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>

                <View style={styles.iconButton}>
                  {isTranslating ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Languages size={20} color={Colors.primary} />
                  )}
                </View>

                <Picker
                  selectedValue={language}
                  style={[styles.languagePicker, { width: 120, color: Colors.text.primary, backgroundColor: Colors.background.tertiary }]}
                  onValueChange={(value: any) => translateResult(value)}
                  enabled={!isTranslating && !isLoading1 && !isSpeaking}
                >
                  <Picker.Item label="English" value="en" />
                  <Picker.Item label="Hindi" value="hi" />
                  <Picker.Item label="Telugu" value="te" />
                  <Picker.Item label="Tamil" value="ta" />
                  <Picker.Item label="Kannada" value="kn" />
                  <Picker.Item label="Malayalam" value="ml" />
                  <Picker.Item label="Gujarati" value="gu" />
                  <Picker.Item label="Marathi" value="mr" />
                  <Picker.Item label="Bengali" value="bn" />
                  <Picker.Item label="Spanish" value="es" />
                  <Picker.Item label="French" value="fr" />
                  <Picker.Item label="German" value="de" />
                  <Picker.Item label="Portuguese" value="pt" />
                  <Picker.Item label="Russian" value="ru" />
                  <Picker.Item label="Chinese" value="zh" />
                  <Picker.Item label="Japanese" value="ja" />
                  <Picker.Item label="Korean" value="ko" />
                  <Picker.Item label="Arabic" value="ar" />
                  <Picker.Item label="Turkish" value="tr" />
                  <Picker.Item label="Dutch" value="nl" />
                  <Picker.Item label="Swedish" value="sv" />
                </Picker>
              </View>
            </View>

            <Markdown style={{ body: { color: Colors.text.primary, fontSize: 16 } }}>
              {result}
            </Markdown>
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, { color: Colors.text.primary }]}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Camera size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>AI-Powered Analysis</Text>
                <Text style={[styles.featureDescription, { color: Colors.text.light }]}>
                  Advanced machine learning algorithms analyze your X-rays
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <FileImage size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>Detailed Reports</Text>
                <Text style={[styles.featureDescription, { color: Colors.text.light }]}>
                  Get comprehensive analysis with observations and recommendations
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Upload size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>Easy Upload</Text>
                <Text style={[styles.featureDescription, { color: Colors.text.light }]}>
                  Upload from gallery or take photos directly with your camera
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chat */}
      {chatVisible && (
        <View style={[styles.chatWindow, { backgroundColor: Colors.background.secondary }]}>
          <View style={[styles.chatHeader, { backgroundColor: Colors.background.primary }]}>
            <Text style={[styles.chatTitle, { color: Colors.text.primary }]}>AI Assistant</Text>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <X size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Make sure ChatScreen accepts Colors prop or uses theme context */}
          <ChatScreen />
        </View>
      )}

      {!chatVisible && (
        <TouchableOpacity style={[styles.chatButton, { backgroundColor: Colors.primary }]} onPress={() => setChatVisible(true)}>
          <MessageCircle size={28} color={Colors.text.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
