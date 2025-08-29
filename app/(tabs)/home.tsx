import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, FileImage, AlertTriangle, Zap } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Colors from '@/constants/colors';
import Markdown from 'react-native-markdown-display';


export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);


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
      base64: true, // ✅ get base64 string
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
      base64: true, // ✅ get base64 string
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
      const base64 = selectedImage.split(',')[1]; // strip data:image/...;base64, prefix

      const response = await apiService.analyzeXray(base64);
      setResult(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MediView AI</Text>
          <Text style={styles.subtitle}>Hello, {user?.name} 👋</Text>
          <Text style={styles.subtitle}>X-ray Analysis Assistant</Text>
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
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
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
            </View>
            <Markdown style={{ body: { color: '#000', fontSize: 16 } }}>
              {result}
            </Markdown>
          </View>
        )}


        {/* Features Section (from new) */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.text.secondary, textAlign: 'center' },

  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },

  uploadSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.text.primary, marginBottom: 20 },
  uploadOptions: { gap: 16 },
  uploadButton: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  uploadButtonText: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginTop: 12 },

  imagePreview: { alignItems: 'center' },
  previewImage: { width: 300, height: 300, borderRadius: 16, marginBottom: 16 },
  changeImageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  changeImageText: { color: '#64748b', fontWeight: '500' },

  analyzeButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 8,
  },
  analyzeButtonDisabled: { backgroundColor: '#94a3b8' },
  analyzeButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },

  resultContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  resultTitle: { fontSize: 18, fontWeight: '600', color: Colors.text.primary },
  resultText: { fontSize: 14, color: Colors.text.secondary, lineHeight: 20 },

  featuresSection: { marginTop: 8 },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  featuresList: { gap: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: Colors.text.primary, marginBottom: 4 },
  featureDescription: { fontSize: 14, color: Colors.text.secondary, lineHeight: 18 },
});
