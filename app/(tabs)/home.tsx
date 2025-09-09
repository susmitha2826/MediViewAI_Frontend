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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isSpeaking, isLoading1, toggleSpeak } = useSpeech();
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [doctorResult, setDoctorResult] = useState<string | null>(null);
  const [laymanResult, setLaymanResult] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

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
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const base64Array = result.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
      setSelectedImages(prev => [...prev, ...base64Array]);
      clearResults();
    }
  };

  const resetAnalysis = () => {
    try {
      // Stop ongoing speech
      Speech.stop();
    } catch (err) {
      console.warn("Error stopping speech:", err);
    }

    // Reset all analysis-related state
    setSelectedImages([]);
    setDoctorResult(null);
    setLaymanResult(null);
    setLanguage("en");
    setResult(null);
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
      setSelectedImages(prev => [...prev, `data:image/jpeg;base64,${result.assets[0].base64}`]);
      clearResults();
    }
  };

  const analyzeImages = async () => {
    if (selectedImages.length === 0) return;

    setIsAnalyzing(true);
    try {
      const base64Array = selectedImages.map(img => img.split(',')[1]);
      const response = await apiService.analyzeXray(base64Array);

      if (response?.data) {
        const fullResult = response.data;

        // Split doctor vs layman explanations
        const doctorMatch = fullResult.match(/Doctor-Level Explanation:(.*)Layman-Friendly Explanation:/s);
        const laymanMatch = fullResult.match(/Layman-Friendly Explanation:(.*)/s);

        setDoctorResult(doctorMatch ? doctorMatch[1].trim() : '');
        setLaymanResult(laymanMatch ? laymanMatch[1].trim() : '');
      } else if (response?.msg) {
        setDoctorResult('');
        setLaymanResult('');
        setResult(response.msg)
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', 'Failed to analyze the images. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setDoctorResult(null);
    setLaymanResult(null);
    setLanguage('en');
    setResult(null);
  };

  const translateLayman = async (targetLang: string) => {
    const textToTranslate = laymanResult || result;
    if (!textToTranslate) return; // nothing to translate

    setIsTranslating(true);
    try {
      const response: any = await apiService.translateText(textToTranslate, targetLang);
      if (laymanResult) {
        setLaymanResult(response?.data);
      } else {
        setResult(response?.data);
      }
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
          <Text style={[styles.sectionTitle, { color: Colors.text.primary }]}>Upload X-ray Images</Text>

          {selectedImages.length > 0 ? (
            <ScrollView horizontal style={styles.imagePreviewContainer}>
              {selectedImages.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      if (!isAnalyzing) setSelectedImages(prev => prev.filter((_, i) => i !== index));
                      else Alert.alert("Analysis in progress", "You cannot remove images while analysis is running.");
                    }}
                  >
                    <Text style={{
                      color: Colors.danger,
                      fontWeight: 'bold',
                      fontSize: 16,
                      textShadowColor: '#000',
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 1,
                    }}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={[styles.addMoreButton, { backgroundColor: Colors.background.tertiary }]} onPress={pickImageFromGallery}>
                <FileImage color={Colors.primary} size={32} />
                <Text style={[styles.uploadButtonText, { color: Colors.text.primary }]}>Add More</Text>
              </TouchableOpacity>
            </ScrollView>
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
        </View>
        {/* New Analysis Button */}
        {selectedImages.length > 0 && (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity style={styles.changeImageButton} onPress={resetAnalysis}>
              <Text style={styles.changeImageText}>New Analysis</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Analyze Button */}
        {selectedImages.length > 0 && (
          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: Colors.primary }, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeImages}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color={Colors.text.white} size="small" />
            ) : (
              <Upload color={Colors.text.white} size={20} />
            )}
            <Text style={[styles.analyzeButtonText, { color: Colors.text.white }]}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze X-rays'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Result Section */}
        {(doctorResult || laymanResult || result) && (
          <View style={[styles.resultContainer, { backgroundColor: Colors.background.secondary }]}>
            <View style={styles.resultHeader}>
              <Zap size={20} color={Colors.accent} />
              <Text style={[styles.resultTitle, { color: Colors.text.primary }]}>Analysis Result</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto", gap: 8 }}>
                <TouchableOpacity onPress={() => {
                  const textToSpeak = laymanResult || result;
                  if (textToSpeak) {
                    toggleSpeak(textToSpeak, language);
                  }
                }}
                  disabled={isLoading1 || isTranslating}>
                  {isLoading1 ? <ActivityIndicator size="small" color={Colors.text.light} /> : isSpeaking ? <StopCircle size={20} color={Colors.danger} /> : <Volume2 size={20} color={Colors.primary} />}
                </TouchableOpacity>

                <View style={styles.iconButton}>
                  {isTranslating ? <ActivityIndicator size="small" color={Colors.primary} /> : <Languages size={20} color={Colors.primary} />}
                </View>

                <Picker
                  selectedValue={language}
                  style={[styles.languagePicker, { width: 120, color: Colors.text.primary, backgroundColor: Colors.background.tertiary }]}
                  onValueChange={(value: any) => translateLayman(value)}
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
              {doctorResult || laymanResult ? (
                [
                  doctorResult ? `Doctor-Level Explanation:\n${doctorResult}\n\n` : "",
                  laymanResult ? `Layman-Friendly Explanation:\n${laymanResult}` : ""
                ].join("")
              ) : (
                result ||
                "⚠️ We couldn’t analyze this document as a valid medical report.  \n👉 Please check if the file is a clear X-ray, MRI, CT scan, ultrasound, or medical report before uploading.  If the issue continues, try again later — the server may be busy."
              )}
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
