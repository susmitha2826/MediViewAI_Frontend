import {
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/darkColors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.text.secondary, textAlign: 'center' },
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },

  // Floating Chat Window
  chatWindow: {
    position: "absolute",
    bottom: 100, // sits above chat button
    right: 20,
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    overflow: "hidden",
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
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

  iconButton: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  iconButtonActive: {
    backgroundColor: Colors.primary,
  },

  languagePicker: {
    marginVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },

  supportedFormats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  supportedText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    flex: 1,
  },
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