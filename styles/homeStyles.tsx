import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/darkColors';
import {

  Platform,

} from 'react-native';
const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  camera: {
    flex: 1,
    aspectRatio: 1,
    margin: 20,
    borderRadius: 10,
  },
  cameraPreviewContainer: {
    maxHeight: 100,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  cameraPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  imagePreviewContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageWrapper: {
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  addMoreButton: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },


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
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: isWeb ? 350 : Math.min(300, width * 0.7), // Narrower width
    height: isWeb ? 600 : Math.min(500, height * 0.8), // Taller height
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2000,
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
    paddingHorizontal: 12,   // smaller horizontal padding
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,        // rounded pill shape
    alignSelf: "center",     // shrink to text size
  },

  changeImageText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.secondary,
  },
    headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
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