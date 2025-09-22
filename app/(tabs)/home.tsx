import ChatScreen from '../../utils/chat';
import { X, MessageCircle, Camera as CameraIcon, Upload, FileImage, AlertTriangle, Zap, Volume2, Languages, StopCircle, FileText, Bot, Copy, Sparkles } from 'lucide-react-native';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Markdown from 'react-native-markdown-display';
import { useSpeech } from '@/utils/ttsService';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styles } from '@/styles/homeStyles';
import { useTheme } from "@/contexts/ThemeContext";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import LanguagePicker from '@/utils/languagePicker';

export default function HomeScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkColors : LightColors;
  const { user } = useAuth();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isLoading1, toggleSpeak } = useSpeech();
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(false);
  const [isLaymanSpeaking, setIsLaymanSpeaking] = useState(false);
  const [doctorLanguage, setDoctorLanguage] = useState('en');
  const [laymanLanguage, setLaymanLanguage] = useState('en');
  const [isTranslatingDoctor, setIsTranslatingDoctor] = useState(false);
  const [isTranslatingLayman, setIsTranslatingLayman] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [doctorResult, setDoctorResult] = useState<string | null>(null);
  const [laymanResult, setLaymanResult] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [cameraPhotos, setCameraPhotos] = useState<string[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const MAX_PHOTOS = 5;

  const subtitles = [
    "Learn how medical images are analyzed 🩺",
    "Explore AI-powered insights in healthcare ✨",
    "Understand reports without medical jargon 🔬",
    "A guide to bridging knowledge gaps in medicine 🤝",
    "Educational insights from scans and images 📊",
    "Discover patterns in medical data for learning 💡",
    "Helping you understand, not diagnose ⚡",
    "Turning complex reports into clear explanations 📖"
  ];
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [selectedModel, setSelectedModel] = useState('rork');

  // Animated subtitle rotation
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setIndex((prev) => (prev + 1) % subtitles.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  // Monitor speech completion
  useEffect(() => {
    const checkSpeech = async () => {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (!isSpeaking) {
        setIsDoctorSpeaking(false);
        setIsLaymanSpeaking(false);
      }
    };
    const interval = setInterval(checkSpeech, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleDoctorSpeak = useCallback(async (text: string, language: string) => {
    try {
      if (isDoctorSpeaking) {
        await Speech.stop();
        setIsDoctorSpeaking(false);
      } else if (!isLaymanSpeaking) {
        await Speech.stop();
        setIsDoctorSpeaking(true);
        await toggleSpeak(text, language);
      }
    } catch (error) {
      console.error('Doctor speech error:', error);
      setIsDoctorSpeaking(false);
      Alert.alert('Error', 'Failed to toggle speech for Doctor explanation.');
    }
  }, [isDoctorSpeaking, isLaymanSpeaking, toggleSpeak]);

  const toggleLaymanSpeak = useCallback(async (text: string, language: string) => {
    try {
      if (isLaymanSpeaking) {
        await Speech.stop();
        setIsLaymanSpeaking(false);
      } else if (!isDoctorSpeaking) {
        await Speech.stop();
        setIsLaymanSpeaking(true);
        await toggleSpeak(text, language);
      }
    } catch (error) {
      console.error('Layman speech error:', error);
      setIsLaymanSpeaking(false);
      Alert.alert('Error', 'Failed to toggle speech for Layman explanation.');
    }
  }, [isLaymanSpeaking, isDoctorSpeaking, toggleSpeak]);

  const pickImageFromGallery = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant gallery access to upload medical images');
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
      setSelectedImages(prev => [...prev, ...base64Array.filter(img => !prev.includes(img))]);
      clearResults();
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    try {
      Speech.stop();
      setIsDoctorSpeaking(false);
      setIsLaymanSpeaking(false);
    } catch (err) {
      console.warn("Error stopping speech:", err);
    }
    setSelectedImages([]);
    setDoctorResult(null);
    setLaymanResult(null);
    setDoctorLanguage("en");
    setLaymanLanguage("en");
    setIsAnalyzing(false);
    setResult(null);
    // setCameraModalVisible(false);
    setIsTranslatingDoctor(false);
    setIsTranslatingLayman(false);
  }, []);

  const takePhoto = useCallback(async () => {
    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed to capture medical images');
        return;
      }
    } else if (permission.status !== 'granted') {
      Alert.alert('Permission Required', 'Please enable camera access in your device settings');
      return;
    }
    setCameraPhotos([]);
    setCameraModalVisible(true);
  }, [permission, requestPermission]);

  const capturePhoto = useCallback(async () => {
    if (cameraPhotos.length >= MAX_PHOTOS) {
      Alert.alert('Limit Reached', `Maximum ${MAX_PHOTOS} photos allowed per session.`);
      return;
    }
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        if (photo.base64) {
          setCameraPhotos(prev => [...prev, `data:image/jpeg;base64,${photo.base64}`]);
        }
      } catch (error) {
        console.error('Capture error:', error);
        Alert.alert('Capture Failed', 'Unable to capture photo. Please try again.');
      }
    }
  }, [cameraPhotos]);

  const clearResults = useCallback(() => {
    setDoctorResult(null);
    setLaymanResult(null);
    setDoctorLanguage('en');
    setLaymanLanguage('en');
    setResult(null);
    setIsDoctorSpeaking(false);
    setIsLaymanSpeaking(false);
  }, []);

  const finishCapture = useCallback(() => {
    if (cameraPhotos.length > 0) {
      setSelectedImages(prev => {
        const newImages = cameraPhotos.filter(img => !prev.includes(img));
        return [...prev, ...newImages];
      });
      clearResults();
    }
    setCameraModalVisible(false);
    setCameraPhotos([]);
  }, [cameraPhotos, clearResults]);

  const cancelCapture = useCallback(() => {
    if (cameraPhotos.length > 0) {
      Alert.alert(
        'Discard Photos?',
        'You have captured photos. Are you sure you want to cancel?',
        [
          { text: 'Keep Photos', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setCameraModalVisible(false);
              setCameraPhotos([]);
            },
          },
        ]
      );
    } else {
      setCameraModalVisible(false);
      setCameraPhotos([]);
    }
  }, [cameraPhotos]);

  const analyzeImages = useCallback(async () => {
    if (selectedImages.length === 0) return;
    setIsAnalyzing(true);
    setResult(null);
    setDoctorResult(null);
    setLaymanResult(null);
    try {
      const base64Array = selectedImages.map(img => img.split(',')[1]);
      const response = await apiService.analyzeXray(base64Array, selectedModel);
      if (response?.data) {
        const fullResult = response.data;
        const doctorMatch = fullResult.match(
          /Doctor-Level Explanation[:*]?\s*([\s\S]*?)(?=Layman-Friendly Explanation[:*]?)/i
        );
        const laymanMatch = fullResult.match(
          /Layman-Friendly Explanation[:*]?\s*([\s\S]*?)(This is a computer-generated response and not a replacement for professional medical advice\.?)/i
        );

        let doctorLevel = doctorMatch ? doctorMatch[1].trim() : null;
        let laymanFriendly = laymanMatch
          ? laymanMatch[1].trim() + "\n\n" + laymanMatch[2].trim()
          : null;

        setDoctorResult(doctorLevel);
        setLaymanResult(laymanFriendly);
      } else if (response?.msg) {
        setDoctorResult(null);
        setLaymanResult(null);
        setResult(response.msg);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Analysis Failed', 'Unable to analyze images. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedImages, selectedModel]);

  const translateDoctor = useCallback(async (targetLang: string) => {
    if (!doctorResult) return;
    setIsTranslatingDoctor(true);
    try {
      const response: any = await apiService.translateText(doctorResult, targetLang);
      setDoctorResult(response?.data);
      setDoctorLanguage(targetLang);
    } catch (error) {
      console.error("Translation error:", error);
      Alert.alert("Translation Failed", "Unable to translate text. Please try again.");
    } finally {
      setIsTranslatingDoctor(false);
    }
  }, [doctorResult]);

  const translateLayman = useCallback(async (targetLang: string) => {
    const textToTranslate = laymanResult || result;
    if (!textToTranslate) return;
    setIsTranslatingLayman(true);
    try {
      const response: any = await apiService.translateText(textToTranslate, targetLang);
      if (laymanResult) {
        setLaymanResult(response?.data);
      } else {
        setResult(response?.data);
      }
      setLaymanLanguage(targetLang);
    } catch (error) {
      console.error("Translation error:", error);
      Alert.alert("Translation Failed", "Unable to translate text. Please try again.");
    } finally {
      setIsTranslatingLayman(false);
    }
  }, [laymanResult, result]);

  function markdownToHTML(text: string) {
    if (!text) return '';
    return text
      .replace(/^###\s*(.*)$/gm, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\n/g, '');
  }

  const copyExplanations = useCallback(async () => {
    let textToCopy = '';
    if (doctorResult) {
      textToCopy += `Doctor-Level Explanation:\n${markdownToHTML(doctorResult)}\n\n`;
      console.log(textToCopy, "textToCopytextToCopytextToCopytextToCopytextToCopy")
    }
    if (laymanResult) {
      textToCopy += `Layman-Friendly Explanation:\n${markdownToHTML(laymanResult)}`;
    }
    if (textToCopy) {
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert('Copied!', 'Analysis results copied to clipboard');
    } else {
      Alert.alert('Nothing to Copy', 'No analysis results available to copy.');
    }
  }, [doctorResult, laymanResult]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.logoContainer}>
            {/* <View style={styles.logoIcon}>
              <Sparkles color={Colors.primary} size={28} />
            </View> */}
            <View style={styles.titleContainer}>
              <Text style={[styles.appTitle, { color: Colors.text.primary }]}>
                MediView AI
              </Text>
              <Animated.Text
                style={[
                  styles.animatedSubtitle,
                  { opacity: fadeAnim, color: Colors.text.secondary },
                ]}
              >
                {subtitles[index]}
              </Animated.Text>
            </View>
          </View>
        </View>

        {/* Enhanced Disclaimer */}
        <View style={[styles.modernDisclaimer, {
          backgroundColor: darkMode ? 'rgba(255, 193, 7, 0.1)' : '#fff8e1',
          borderColor: Colors.warning
        }]}>
          <View style={styles.disclaimerHeader}>
            <AlertTriangle color={Colors.warning} size={22} />
            <Text style={[styles.disclaimerTitle, { color: Colors.text.primary }]}>Important Notice</Text>
          </View>
          <Text style={[styles.disclaimerContent, { color: Colors.text.secondary }]}>
            This AI analysis tool provides educational insights only. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions.
          </Text>
        </View>

        {/* Enhanced Upload Section */}
        <View style={[styles.modernCard, { backgroundColor: Colors.background.secondary }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: Colors.text.primary }]}>Upload Medical Images</Text>
            <Text style={[styles.cardSubtitle, { color: Colors.text.secondary }]}>
              X-rays, MRI, CT scans, or ultrasound images
            </Text>
          </View>

          {selectedImages.length > 0 ? (
            <View style={styles.imageSection}>
              <ScrollView horizontal style={styles.imageCarousel} showsHorizontalScrollIndicator={false}>
                {selectedImages.map((img, index) => (
                  <View key={index} style={styles.modernImageWrapper}>
                    <Image source={{ uri: img }} style={styles.modernPreviewImage} />
                    <TouchableOpacity
                      style={styles.modernRemoveButton}
                      onPress={() => {
                        if (!isAnalyzing) {
                          setSelectedImages(prev => prev.filter((_, i) => i !== index));
                        } else {
                          Alert.alert("Analysis in Progress", "Cannot remove images during analysis.");
                        }
                      }}
                      accessibilityLabel="Remove image"
                    >
                      <X color="#fff" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addMoreCard}
                  onPress={pickImageFromGallery}
                  accessibilityLabel="Add more images"
                >
                  <FileImage color={Colors.primary} size={28} />
                  <Text style={[styles.addMoreText, { color: Colors.primary }]}>Add More</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.uploadOptionsGrid}>
              <TouchableOpacity
                style={[styles.modernUploadButton, { borderColor: Colors.primary }]}
                onPress={takePhoto}
                accessibilityLabel="Take photo with camera"
              >
                <View style={[styles.uploadIconContainer, { backgroundColor: Colors.primary }]}>
                  <CameraIcon color="#fff" size={24} />
                </View>
                <Text style={[styles.uploadOptionTitle, { color: Colors.text.primary }]}>Camera</Text>
                <Text style={[styles.uploadOptionSubtitle, { color: Colors.text.secondary }]}>
                  Take photo directly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modernUploadButton, { borderColor: Colors.primary }]}
                onPress={pickImageFromGallery}
                accessibilityLabel="Choose from gallery"
              >
                <View style={[styles.uploadIconContainer, { backgroundColor: Colors.primary }]}>
                  <FileImage color="#fff" size={24} />
                </View>
                <Text style={[styles.uploadOptionTitle, { color: Colors.text.primary }]}>Gallery</Text>
                <Text style={[styles.uploadOptionSubtitle, { color: Colors.text.secondary }]}>
                  Choose from device
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Enhanced Camera Modal */}
        <Modal visible={cameraModalVisible} animationType="slide">
          <SafeAreaView style={[styles.cameraContainer, { backgroundColor: Colors.background.primary }]}>
            <View style={styles.cameraHeader}>
              <Text style={[styles.cameraTitle, { color: Colors.text.primary }]}>Capture Medical Image</Text>
              <TouchableOpacity onPress={cancelCapture}>
                <X color={Colors.text.primary} size={24} />
              </TouchableOpacity>
            </View>

            <CameraView
              style={styles.modernCamera}
              ref={cameraRef}
              facing="back"
              ratio="4:3"
            />

            {cameraPhotos.length > 0 && (
              <ScrollView horizontal style={styles.cameraPreviewBar} showsHorizontalScrollIndicator={false}>
                {cameraPhotos.map((img, index) => (
                  <View key={index} style={styles.cameraPreviewItem}>
                    <Image source={{ uri: img }} style={styles.cameraPreviewThumb} />
                    <TouchableOpacity
                      style={styles.previewRemoveButton}
                      onPress={() => setCameraPhotos(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X color="#fff" size={14} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.modernCameraControls}>
              <TouchableOpacity
                style={[styles.modernCameraButton, styles.secondaryButton, { backgroundColor: Colors.background.secondary }]}
                onPress={cancelCapture}
              >
                <Text style={[styles.cameraButtonText, { color: Colors.text.primary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modernCameraButton, styles.primaryButton, { backgroundColor: Colors.primary }]}
                onPress={capturePhoto}
                disabled={cameraPhotos.length >= MAX_PHOTOS}
              >
                <CameraIcon color="#fff" size={20} />
                <Text style={[styles.cameraButtonText, { color: '#fff' }]}>Capture</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modernCameraButton,
                  cameraPhotos.length === 0 ? styles.disabledButton : styles.successButton,
                  { backgroundColor: cameraPhotos.length === 0 ? Colors.text.light : Colors.success }
                ]}
                onPress={finishCapture}
                disabled={cameraPhotos.length === 0}
              >
                <Text style={[styles.cameraButtonText, { color: '#fff' }]}>
                  Done ({cameraPhotos.length})
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Model Selection */}
        {selectedImages.length > 0 && (
          <View style={[styles.modernCard, { backgroundColor: Colors.background.secondary }]}>
            <Text style={[styles.cardTitle, { color: Colors.text.primary }]}>Analysis Model</Text>
            <Text style={[styles.cardSubtitle, { color: Colors.text.secondary, marginBottom: 16 }]}>
              Choose the AI model for analysis
            </Text>
            <View style={[styles.modernPickerContainer, { backgroundColor: Colors.background.tertiary }]}>
              <Picker
                selectedValue={selectedModel}
                style={[
                  styles.modernPicker,
                  {
                    color: Colors.text.primary,
                    backgroundColor: Colors.background.tertiary
                  }
                ]}
                dropdownIconColor={Colors.text.primary}
                onValueChange={(itemValue) => setSelectedModel(itemValue)}
                accessibilityLabel="Select analysis model"
              >
                <Picker.Item
                  label="Rork"
                  value="rork"
                  color={Colors.text.primary}
                />
                <Picker.Item
                  label="GPT-4.1V"
                  value="openai"
                  color={Colors.text.primary}
                />
                <Picker.Item
                  label="CheXNet"
                  value="chexnet"
                  color={Colors.text.primary}
                />
                <Picker.Item
                  label="CXR Analysis"
                  value="cxr"
                  color={Colors.text.primary}
                />
              </Picker>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {selectedImages.length > 0 && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.secondaryActionButton, { backgroundColor: Colors.background.secondary, borderColor: Colors.primary }]}
              onPress={resetAnalysis}
              accessibilityLabel="Start new analysis"
            >
              <Text style={[styles.secondaryActionText, { color: Colors.primary }]}>New Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryActionButton,
                { backgroundColor: Colors.primary },
                isAnalyzing && { backgroundColor: Colors.text.light }
              ]}
              onPress={analyzeImages}
              disabled={isAnalyzing}
              accessibilityLabel="Analyze uploaded images"
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Sparkles color="#fff" size={20} />
              )}
              <Text style={[styles.primaryActionText, { color: '#fff' }]}>
                {isAnalyzing ? 'Analyzing Images...' : 'Analyze Images'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Enhanced Results Section */}
        {(doctorResult !== null || laymanResult !== null || result !== null) && (
          <View style={[styles.resultsContainer, { backgroundColor: Colors.background.secondary }]}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsHeaderLeft}>
                <View style={[styles.resultsIcon, { backgroundColor: Colors.primary }]}>
                  <Sparkles color="#fff" size={20} />
                </View>
                <Text style={[styles.resultsTitle, { color: Colors.text.primary }]}>Analysis Results</Text>
              </View>

              {(doctorResult !== null || laymanResult !== null) && (
                <TouchableOpacity
                  onPress={copyExplanations}
                  style={styles.copyButton}
                  accessibilityLabel="Copy results"
                >
                  <Copy size={18} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {doctorResult !== null || laymanResult !== null ? (
              <View style={styles.explanationsContainer}>
                {/* Doctor Explanation */}
                {doctorResult !== null && (
                  <View style={[styles.explanationCard, { backgroundColor: Colors.background.tertiary }]}>
                    <View style={styles.explanationHeader}>
                      <View style={styles.explanationTitleRow}>
                        <View style={[styles.explanationIcon, { backgroundColor: '#e3f2fd' }]}>
                          <FileText color="#1976d2" size={16} />
                        </View>
                        <Text style={[styles.explanationTitle, { color: Colors.text.primary }]}>
                          Doctor-Level Explanation
                        </Text>
                      </View>

                      <View style={styles.explanationControls}>
                        <TouchableOpacity
                          onPress={() => doctorResult && toggleDoctorSpeak(doctorResult, doctorLanguage)}
                          disabled={isLoading1 || isTranslatingDoctor || isLaymanSpeaking}
                          style={styles.controlButton}
                        >
                          {isLoading1 && isDoctorSpeaking ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                          ) : isDoctorSpeaking ? (
                            <StopCircle size={18} color={Colors.danger} />
                          ) : (
                            <Volume2 size={18} color={Colors.primary} />
                          )}
                        </TouchableOpacity>

                        <View style={styles.languageControls}>
                          {isTranslatingDoctor ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                          ) : (
                            <Languages size={18} color={Colors.primary} />
                          )}
                          <LanguagePicker
                            selectedValue={doctorLanguage}
                            onChange={(value) => translateDoctor(value)}
                            enabled={!isTranslatingDoctor && !isLoading1 && !isDoctorSpeaking}
                            loading={isTranslatingDoctor}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.explanationContent}>
                      <Markdown style={{
                        body: {
                          color: Colors.text.primary,
                          fontSize: 15,
                          lineHeight: 22
                        }
                      }}>
                        {doctorResult}
                      </Markdown>
                    </View>
                  </View>
                )}

                {/* Layman Explanation */}
                {laymanResult !== null && (
                  <View style={[styles.explanationCard, { backgroundColor: Colors.background.tertiary }]}>
                    <View style={styles.explanationHeader}>
                      <View style={styles.explanationTitleRow}>
                        <View style={[styles.explanationIcon, { backgroundColor: '#e8f5e8' }]}>
                          <MessageCircle color="#4caf50" size={16} />
                        </View>
                        <Text style={[styles.explanationTitle, { color: Colors.text.primary }]}>
                          Layman-Friendly Explanation
                        </Text>
                      </View>

                      <View style={styles.explanationControls}>
                        <TouchableOpacity
                          onPress={() => laymanResult && toggleLaymanSpeak(laymanResult, laymanLanguage)}
                          disabled={isLoading1 || isTranslatingLayman || isDoctorSpeaking}
                          style={styles.controlButton}
                        >
                          {isLoading1 && isLaymanSpeaking ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                          ) : isLaymanSpeaking ? (
                            <StopCircle size={18} color={Colors.danger} />
                          ) : (
                            <Volume2 size={18} color={Colors.primary} />
                          )}
                        </TouchableOpacity>

                        <View style={styles.languageControls}>
                          {isTranslatingLayman ? (
                            <ActivityIndicator size="small" color={Colors.primary} />
                          ) : (
                            <Languages size={18} color={Colors.primary} />
                          )}
                          <LanguagePicker
                            selectedValue={laymanLanguage}
                            onChange={(value) => translateLayman(value)}
                            enabled={!isTranslatingLayman && !isLoading1 && !isLaymanSpeaking}
                            loading={isTranslatingLayman}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.explanationContent}>
                      <Markdown style={{
                        body: {
                          color: Colors.text.primary,
                          fontSize: 15,
                          lineHeight: 22
                        }
                      }}>
                        {laymanResult}
                      </Markdown>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              /* Error/General Result */
              <View style={[styles.explanationCard, { backgroundColor: Colors.background.tertiary }]}>
                <View style={styles.explanationHeader}>
                  <View style={styles.explanationTitleRow}>
                    <View style={[styles.explanationIcon, { backgroundColor: '#fff3e0' }]}>
                      <AlertTriangle color="#f57c00" size={16} />
                    </View>
                    <Text style={[styles.explanationTitle, { color: Colors.text.primary }]}>
                      Analysis Result
                    </Text>
                  </View>

                  <View style={styles.explanationControls}>
                    <TouchableOpacity
                      onPress={() => result && toggleLaymanSpeak(result, laymanLanguage)}
                      disabled={isLoading1 || isTranslatingLayman}
                      style={styles.controlButton}
                    >
                      {isLoading1 && isLaymanSpeaking ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                      ) : isLaymanSpeaking ? (
                        <StopCircle size={18} color={Colors.danger} />
                      ) : (
                        <Volume2 size={18} color={Colors.primary} />
                      )}
                    </TouchableOpacity>

                    <View style={styles.languageControls}>
                      {isTranslatingLayman ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                      ) : (
                        <Languages size={18} color={Colors.primary} />
                      )}
                      <LanguagePicker
                        selectedValue={laymanLanguage}
                        onChange={(value) => translateLayman(value)}
                        enabled={!isTranslatingLayman && !isLoading1}
                        loading={isTranslatingLayman}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.explanationContent}>
                  <Markdown style={{
                    body: {
                      color: Colors.text.primary,
                      fontSize: 15,
                      lineHeight: 22
                    }
                  }}>
                    {result || "⚠️ Unable to analyze this document as a valid medical report. Please ensure the file is a clear X-ray, MRI, CT scan, ultrasound, or medical report. If issues persist, the server may be temporarily busy."}
                  </Markdown>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Enhanced Features Section */}
        <View style={[styles.modernCard, { backgroundColor: Colors.background.secondary }]}>
          <Text style={[styles.cardTitle, { color: Colors.text.primary }]}>Key Features</Text>
          <View style={styles.featureGrid}>
            {[
              {
                icon: <Sparkles color={Colors.primary} size={22} />,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning algorithms provide detailed medical insights"
              },
              {
                icon: <FileText color={Colors.primary} size={22} />,
                title: "Dual-Level Reports",
                description: "Get both professional and easy-to-understand explanations"
              },
              {
                icon: <Languages color={Colors.primary} size={22} />,
                title: "Multi-Language Support",
                description: "Translate results into your preferred language"
              },
              {
                icon: <Volume2 color={Colors.primary} size={22} />,
                title: "Text-to-Speech",
                description: "Listen to your results with built-in voice narration"
              }
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={[styles.featureIconContainer, { backgroundColor: `${Colors.primary}20` }]}>
                  {feature.icon}
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>{feature.title}</Text>
                  <Text style={[styles.featureDescription, { color: Colors.text.secondary }]}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Enhanced Floating Chat */}
      {chatVisible && (
        <View style={[styles.modernChatWindow, { backgroundColor: Colors.background.secondary }]}>
          <View style={[styles.modernChatHeader, { backgroundColor: Colors.background.primary }]}>
            <View style={styles.chatHeaderLeft}>
              <View style={[styles.chatAvatar, { backgroundColor: Colors.primary }]}>
                <Bot size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.chatHeaderTitle, { color: Colors.text.primary }]}>AI Health Assistant</Text>
                <Text style={[styles.chatHeaderSubtitle, { color: Colors.text.secondary }]}>Ask me about health topics</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setChatVisible(false)}
              style={styles.chatCloseButton}
            >
              <X size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ChatScreen />
        </View>
      )}

      {/* Enhanced Chat Button */}
      {!chatVisible && (
        <TouchableOpacity
          style={[styles.modernChatButton, { backgroundColor: Colors.primary }]}
          onPress={() => setChatVisible(true)}
          accessibilityLabel="Open AI health assistant"
        >
          <MessageCircle size={26} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}