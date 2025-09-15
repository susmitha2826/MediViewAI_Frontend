import ChatScreen from '../../utils/chat';
import { X, MessageCircle, Camera as CameraIcon, Upload, FileImage, AlertTriangle, Zap, Volume2, Languages, StopCircle, FileText, Bot, Copy } from 'lucide-react-native';
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
  const MAX_PHOTOS = 5; // Limit for captured photos
  const subtitles = [
    "Your health buddy 🤝",
    "Here to explain in simple words ✨",
    "Always by your side 💙",
    "Guiding you through your reports 📋",
  ];
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [selectedModel, setSelectedModel] = useState('rork');

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        setIndex((prev) => (prev + 1) % subtitles.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      });
    }, 3000);
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

    const interval = setInterval(checkSpeech, 500); // Poll every 500ms
    return () => clearInterval(interval);
  }, []);

  const toggleDoctorSpeak = useCallback(async (text: string, language: string) => {
    try {
      if (isDoctorSpeaking) {
        await Speech.stop();
        setIsDoctorSpeaking(false);
      } else if (!isLaymanSpeaking) {
        await Speech.stop(); // Ensure any residual speech is stopped
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
        await Speech.stop(); // Ensure any residual speech is stopped
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
    setResult(null);
  }, []);

  const takePhoto = useCallback(async () => {
    if (!permission) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera access to take X-ray photos');
        return;
      }
    } else if (permission.status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access in your device settings');
      return;
    }
    setCameraPhotos([]);
    setCameraModalVisible(true);
  }, [permission, requestPermission]);

  const capturePhoto = useCallback(async () => {
    if (cameraPhotos.length >= MAX_PHOTOS) {
      Alert.alert('Limit Reached', `You can capture up to ${MAX_PHOTOS} photos at a time.`);
      return;
    }
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6,
          base64: true,
        });
        if (photo.base64) {
          setCameraPhotos(prev => [...prev, `data:image/jpeg;base64,${photo.base64}`]);
        }
      } catch (error) {
        console.error('Capture error:', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
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
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
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
    try {
      const base64Array = selectedImages.map(img => img.split(',')[1]);
      const response = await apiService.analyzeXray(base64Array, selectedModel);
      // console.log('Analysis response:', response);
      if (response?.data) {
        const fullResult = response.data;

        // Capture both sections reliably
        const doctorMatch = fullResult.match(
          /Doctor-Level Explanation[:*]?\s*([\s\S]*?)(?=Layman-Friendly Explanation[:*]?)/i
        );

        const laymanMatch = fullResult.match(
          /Layman-Friendly Explanation[:*]?\s*([\s\S]*?)(This is a computer-generated response and not a replacement for professional medical advice\.?)/i
        );

        // Combine explanation + disclaimer
        const laymanText = laymanMatch
          ? laymanMatch[1].trim() + "\n\n" + laymanMatch[2].trim()
          : null;

        const doctorLevel = doctorMatch ? doctorMatch[1].trim() : null;
        const laymanFriendly = laymanText; // Use combined version here

        setDoctorResult(doctorLevel);
        setLaymanResult(laymanFriendly);

      } else if (response?.msg) {
        setDoctorResult(null);
        setLaymanResult(null);
        setResult(response.msg);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', 'Failed to analyze the images. Please try again.');
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
      Alert.alert("Error", "Translation failed.");
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
      Alert.alert("Error", "Translation failed.");
    } finally {
      setIsTranslatingLayman(false);
    }
  }, [laymanResult, result]);


  function markdownToHTML(text: string) {
    if (!text) return '';
    return text
      // Headings: ### Heading -> <b>Heading</b>
      .replace(/^###\s*(.*)$/gm, '$1')
      // Bold: **text** -> <b>text</b>
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Italic: *text* -> <i>text</i>
      .replace(/\*(.*?)\*/g, '$1')
      // Line breaks
      .replace(/\n/g, '');
  }


  const copyExplanations = useCallback(async () => {
    let textToCopy = '';
    if (doctorResult) {
      textToCopy += `Doctor-Level Explanation:\n  ${markdownToHTML(doctorResult)}\n\n`;
    }
    if (laymanResult) {
      textToCopy += `Layman-Friendly Explanation:\n  ${markdownToHTML(laymanResult)}`;
    }
    if (textToCopy) {
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert('Success', 'Explanations copied to clipboard!');
    } else {
      Alert.alert('Error', 'No explanations available to copy.');
    }
  }, [doctorResult, laymanResult]);

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
                    accessibilityLabel="Remove image"
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
              <TouchableOpacity
                style={[styles.addMoreButton, { backgroundColor: Colors.background.tertiary }]}
                onPress={pickImageFromGallery}
                accessibilityLabel="Add more images"
              >
                <FileImage color={Colors.primary} size={32} />
                <Text style={[styles.uploadButtonText, { color: Colors.text.primary }]}>Add More</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: Colors.background.tertiary }]}
                onPress={takePhoto}
                accessibilityLabel="Take photo with camera"
              >
                <CameraIcon color={Colors.primary} size={32} />
                <Text style={[styles.uploadButtonText, { color: Colors.text.primary }]}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: Colors.background.tertiary }]}
                onPress={pickImageFromGallery}
                accessibilityLabel="Choose image from gallery"
              >
                <FileImage color={Colors.primary} size={32} />
                <Text style={[styles.uploadButtonText, { color: Colors.text.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Camera Modal */}
        <Modal visible={cameraModalVisible} animationType="slide">
          <SafeAreaView style={[styles.container, { backgroundColor: Colors.background.primary }]}>
            <CameraView
              style={{ flex: 1 }}
              ref={cameraRef}
              facing="back"
              ratio="4:3"
            />
            <ScrollView horizontal style={styles.cameraPreviewContainer}>
              {cameraPhotos.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.cameraPreviewImage} />
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
                    onPress={() => setCameraPhotos(prev => prev.filter((_, i) => i !== index))}
                    accessibilityLabel="Remove captured photo"
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
            </ScrollView>
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: Colors.primary }]}
                onPress={capturePhoto}
                accessibilityLabel="Capture photo"
              >
                <CameraIcon color={Colors.text.white} size={24} />
                <Text style={[styles.cameraButtonText, { color: Colors.text.white }]}>Capture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cameraButton,
                  { backgroundColor: cameraPhotos.length === 0 ? Colors.primary : Colors.success },
                ]}
                onPress={finishCapture}
                disabled={cameraPhotos.length === 0}
                accessibilityLabel="Finish capturing photos"
                accessibilityHint={cameraPhotos.length === 0 ? "No photos captured yet" : "Save captured photos"}
              >
                <Text style={[styles.cameraButtonText, { color: Colors.text.white }]}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: Colors.danger }]}
                onPress={cancelCapture}
                accessibilityLabel="Cancel photo capture"
              >
                <Text style={[styles.cameraButtonText, { color: Colors.text.white }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
        {/* Model Selection */}
        {/* {selectedImages.length > 0 && (
          <View style={[styles.uploadSection, { backgroundColor: Colors.background.secondary, marginTop: 16 }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text.primary }]}>Select Analysis Model</Text>
            <Picker
              selectedValue={selectedModel}
              style={[
                styles.languagePicker,
                {
                  color: Colors.text.primary,
                  backgroundColor: Colors.background.tertiary,
                },
              ]}
              onValueChange={(itemValue) => setSelectedModel(itemValue)}
              accessibilityLabel="Select analysis model"
            >
              <Picker.Item label="Rork" value="rork" />
              <Picker.Item label="ChexNet" value="chexnet" />
              <Picker.Item label="OpenAI" value="openai" />
            </Picker>
          </View>
        )} */}
        {/* New Analysis Button */}
        {selectedImages.length > 0 && (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={resetAnalysis}
              accessibilityLabel="Start new analysis"
            >
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
            accessibilityLabel="Analyze uploaded X-ray images"
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
        {(doctorResult !== null || laymanResult !== null || result !== null) && (
          <View style={[styles.resultContainer, { backgroundColor: Colors.background.secondary }]}>
            {(doctorResult !== null || laymanResult !== null) && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
                <TouchableOpacity
                  onPress={copyExplanations}
                  accessibilityLabel="Copy both explanations"
                >
                  <Copy size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            {doctorResult !== null || laymanResult !== null ? (
              <>
                {/* Doctor Section */}
                {doctorResult !== null && (
                  <View style={[styles.resultContainer, { backgroundColor: Colors.background.secondary, marginBottom: 16 }]}>

                    {/* Title row (always full width) */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                      <Zap size={20} color={Colors.accent} />
                      <Text style={[styles.resultTitle, { color: Colors.text.primary, marginLeft: 6 }]}>
                        Doctor-Level Explanation
                      </Text>
                    </View>

                    {/* Controls row (below, aligned right) */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      {/* Speak button */}
                      <TouchableOpacity
                        onPress={() => doctorResult && toggleDoctorSpeak(doctorResult, doctorLanguage)}
                        disabled={isLoading1 || isTranslatingDoctor || isLaymanSpeaking}
                        accessibilityLabel={
                          isDoctorSpeaking
                            ? "Stop reading doctor explanation"
                            : "Read doctor explanation aloud"
                        }
                      >
                        {isLoading1 && isDoctorSpeaking ? (
                          <ActivityIndicator size="small" color={Colors.text.light} />
                        ) : isDoctorSpeaking ? (
                          <StopCircle size={20} color={Colors.danger} />
                        ) : (
                          <Volume2 size={20} color={Colors.primary} />
                        )}
                      </TouchableOpacity>

                      {/* Translate icon */}
                      <View style={styles.iconButton}>
                        {isTranslatingDoctor ? (
                          <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                          <Languages size={20} color={Colors.primary} />
                        )}
                      </View>

                      {/* Language Picker */}
                      <LanguagePicker
                        selectedValue={doctorLanguage}
                        onChange={(value) => translateDoctor(value)}
                        enabled={!isTranslatingDoctor && !isLoading1 && !isDoctorSpeaking}
                        loading={isTranslatingDoctor}
                      />

                    </View>

                    <Markdown style={{ body: { color: Colors.text.primary, fontSize: 16 } }}>
                      {doctorResult}
                    </Markdown>
                  </View>
                )}

                {/* Layman Section */}
                {laymanResult !== null && (
                  <View
                    style={[
                      styles.resultContainer,
                      { backgroundColor: Colors.background.secondary },
                    ]}
                  >
                    {/* Title row */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                      <Zap size={20} color={Colors.accent} />
                      <Text
                        style={[
                          styles.resultTitle,
                          { color: Colors.text.primary, marginLeft: 6 },
                        ]}
                      >
                        Layman-Friendly Explanation
                      </Text>
                    </View>

                    {/* Controls row */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      {/* Speak button */}
                      <TouchableOpacity
                        onPress={() => laymanResult && toggleLaymanSpeak(laymanResult, laymanLanguage)}
                        disabled={isLoading1 || isTranslatingLayman || isDoctorSpeaking}
                        accessibilityLabel={
                          isLaymanSpeaking
                            ? "Stop reading layman explanation"
                            : "Read layman explanation aloud"
                        }
                      >
                        {isLoading1 && isLaymanSpeaking ? (
                          <ActivityIndicator size="small" color={Colors.text.light} />
                        ) : isLaymanSpeaking ? (
                          <StopCircle size={20} color={Colors.danger} />
                        ) : (
                          <Volume2 size={20} color={Colors.primary} />
                        )}
                      </TouchableOpacity>

                      {/* Translate icon */}
                      <View style={styles.iconButton}>
                        {isTranslatingLayman ? (
                          <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                          <Languages size={20} color={Colors.primary} />
                        )}
                      </View>

                      {/* Language Picker */}
                      <LanguagePicker
                        selectedValue={laymanLanguage}
                        onChange={(value) => translateLayman(value)}
                        enabled={!isTranslatingLayman && !isLoading1 && !isLaymanSpeaking}
                        loading={isTranslatingLayman}
                      />

                    </View>

                    {/* Explanation text */}
                    <Markdown
                      style={{ body: { color: Colors.text.primary, fontSize: 16, marginTop: 10 } }}
                    >
                      {laymanResult}
                    </Markdown>
                  </View>
                )}

              </>
            ) : (
              <>
                {/* Error/Result Section */}
                <View style={styles.resultHeader}>
                  <Zap size={20} color={Colors.accent} />
                  <Text style={[styles.resultTitle, { color: Colors.text.primary }]}>Analysis Result</Text>

                  <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto", gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => result && toggleLaymanSpeak(result, laymanLanguage)}
                      disabled={isLoading1 || isTranslatingLayman || isDoctorSpeaking}
                      accessibilityLabel={isLaymanSpeaking ? "Stop reading result" : "Read result aloud"}
                    >
                      {isLoading1 && isLaymanSpeaking ? (
                        <ActivityIndicator size="small" color={Colors.text.light} />
                      ) : isLaymanSpeaking ? (
                        <StopCircle size={20} color={Colors.danger} />
                      ) : (
                        <Volume2 size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>

                    <View style={styles.iconButton}>
                      {isTranslatingLayman ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                      ) : (
                        <Languages size={20} color={Colors.primary} />
                      )}
                    </View>

                    <LanguagePicker
                      selectedValue={laymanLanguage}
                      onChange={(value) => translateLayman(value)}
                      enabled={!isTranslatingLayman && !isLoading1 && !isLaymanSpeaking}
                      loading={isTranslatingLayman}
                    />


                  </View>
                </View>

                <Markdown style={{ body: { color: Colors.text.primary, fontSize: 16 } }}>
                  {result || "⚠️ We couldn’t analyze this document as a valid medical report. \n👉 Please check if the file is a clear X-ray, MRI, CT scan, ultrasound, or medical report before uploading. If the issue continues, try again later — the server may be busy."}
                </Markdown>
              </>
            )}
          </View>
        )}

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.featuresTitle, { color: Colors.text.primary }]}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <CameraIcon size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>AI-Powered Analysis</Text>
                <Text style={[styles.featureDescription, { color: Colors.text.light }]}>Advanced machine learning algorithms analyze your X-rays</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <FileImage size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>Detailed Reports</Text>
                <Text style={[styles.featureDescription, { color: Colors.text.light }]}>Get comprehensive analysis with observations and recommendations</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Upload size={24} color={Colors.primary} />
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: Colors.text.primary }]}>Easy Upload</Text>
                <Text style={[styles.featureDescription, { color: Colors.text.light }]}>Upload from gallery or take photos directly with your camera</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Floating Chat */}
      {chatVisible && (
        <View style={[styles.chatWindow, { backgroundColor: Colors.background.secondary }]}>
          <View style={[styles.chatHeader, { backgroundColor: Colors.background.primary }]}>
            <View>
              <Bot size={24} color={Colors.primary} />
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>Ask me anything about health</Text>
            </View>
            <TouchableOpacity
              onPress={() => setChatVisible(false)}
              accessibilityLabel="Close chat window"
            >
              <X size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ChatScreen />
        </View>
      )}
      {!chatVisible && (
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: Colors.primary }]}
          onPress={() => setChatVisible(true)}
          accessibilityLabel="Open AI assistant chat"
        >
          <MessageCircle size={28} color={Colors.text.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}