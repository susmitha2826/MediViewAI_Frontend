import ChatScreen from '../../utils/chat';
import { X, MessageCircle } from 'lucide-react-native';
import { Modal } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, FileImage, AlertTriangle, Zap, Volume2, Languages, StopCircle, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Colors from '@/constants/colors';
import Markdown from 'react-native-markdown-display';
import { styles } from "../../styles/homeStyles"
import { useSpeech } from '@/utils/ttsService';

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { isSpeaking, isLoading1, toggleSpeak } = useSpeech();
  const [language, setLanguage] = useState('en'); // default English
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
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % subtitles.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
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
  }

  const translateResult = async (targetLang: string) => {
    if (!result) return;
    setIsTranslating(true);
    try {
      const response: any = await apiService.translateText(result, targetLang);
      // console.log(response, "responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse")
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MediView AI</Text>
          <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
            {subtitles[index]}
          </Animated.Text>
        </View>


        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <AlertTriangle color="#f59e0b" size={20} />
          <Text style={styles.disclaimerText}>
            This tool provides educational insights only and is not a substitute for professional medical diagnosis.
          </Text>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload X-ray Image</Text>

          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={clearImage}
              >
                <Text style={styles.changeImageText}>Clear Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Camera color={Colors.primary} size={32} />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImageFromGallery}>
                <FileImage color={Colors.primary} size={32} />
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.supportedFormats}>
            <FileText color="#8E8E93" size={16} />
            <Text style={styles.supportedText}>
              Supports X-rays, MRIs, CT scans, lab reports, and other medical documents
            </Text>
          </View>

        </View>

        {/* Analyze Button */}
        {selectedImage && (
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Upload color="#ffffff" size={20} />
            )}
            <Text style={styles.analyzeButtonText}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze X-ray'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Result Section */}
        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Zap size={20} color={Colors.accent} />
              <Text style={styles.resultTitle}>Analysis Result</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto", gap: 8 }}>
                {/* 🔊 Speak */}
                <TouchableOpacity
                  onPress={() => toggleSpeak(result, language)}
                  disabled={isLoading1 || isTranslating}
                >
                  {isLoading1 ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : isSpeaking ? (
                    <StopCircle size={20} color="red" />
                  ) : (
                    <Volume2 size={20} color="blue" />
                  )}
                </TouchableOpacity>



                <View style={styles.iconButton}>
                  {isTranslating ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Languages size={20} color={Colors.primary} />
                  )}
                </View>


                {/* Language Picker (moved inline with icons) */}
                <Picker
                  selectedValue={language}
                  style={[styles.languagePicker, { width: 120 }]}
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

            <Markdown style={{ body: { color: '#000', fontSize: 16 } }}>
              {result}
            </Markdown>
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Camera size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI-Powered Analysis</Text>
                <Text style={styles.featureDescription}>
                  Advanced machine learning algorithms analyze your X-rays
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <FileImage size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Detailed Reports</Text>
                <Text style={styles.featureDescription}>
                  Get comprehensive analysis with observations and recommendations
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Upload size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Easy Upload</Text>
                <Text style={styles.featureDescription}>
                  Upload from gallery or take photos directly with your camera
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chat Window */}
      {chatVisible && (
        <View style={styles.chatWindow}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>AI Assistant</Text>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <X size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <ChatScreen />
        </View>
      )}

      {/* Floating Chat Button */}
      {!chatVisible && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setChatVisible(true)}
        >
          <MessageCircle size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}


