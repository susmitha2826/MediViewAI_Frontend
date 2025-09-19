import {
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';

const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isDesktop = width >= 1024;

export const styles = StyleSheet.create({
  // Base Container
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: isWeb ? (isDesktop ? 40 : 24) : 20,
    paddingBottom: 100,
    maxWidth: isWeb ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },

  // Modern Header
  modernHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center', // center title & animated text
    justifyContent: 'center',
    marginVertical: 20,
  },
  appTitle: {
    fontSize: isDesktop ? 36 : isTablet ? 32 : 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  animatedSubtitle: {
    fontSize: isDesktop ? 18 : 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Modern Disclaimer
  modernDisclaimer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimerContent: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 30,
  },

  // Modern Cards
  modernCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Upload Section
  uploadOptionsGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 16,
  },
  modernUploadButton: {
    flex: isWeb ? 1 : undefined,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadOptionSubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },

  // Image Section
  imageSection: {
    marginTop: 8,
  },
  imageCarousel: {
    flexDirection: 'row',
  },
  modernImageWrapper: {
    marginRight: 16,
    position: 'relative',
  },
  modernPreviewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  modernRemoveButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addMoreCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.02)',
  },
  addMoreText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },

  // Model Selection
  modernPickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  modernPicker: {
    height: 48,
    paddingHorizontal: 16,
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: isWeb && isTablet ? 'row' : 'column',
    gap: 12,
    marginBottom: 24,
  },
  secondaryActionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    flex: isWeb && isTablet ? 1 : undefined,
  },
  primaryActionButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flex: isWeb && isTablet ? 2 : undefined,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Results Section
  resultsContainer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },

  // Explanations
  explanationsContainer: {
    gap: 20,
  },
  explanationCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  explanationHeader: {
    marginBottom: 16,
  },
  explanationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  explanationIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  explanationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  controlButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  languageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  explanationContent: {
    paddingTop: 8,
  },

  // Camera Modal
  cameraContainer: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modernCamera: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraPreviewBar: {
    maxHeight: 80,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cameraPreviewItem: {
    marginRight: 12,
    position: 'relative',
  },
  cameraPreviewThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  previewRemoveButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernCameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  modernCameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  primaryButton: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  successButton: {
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cameraButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Features Section
  featureGrid: {
    gap: 20,
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Modern Chat
  modernChatWindow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: isDesktop ? 400 : isTablet ? 350 : Math.min(320, width * 0.85),
    height: isDesktop ? 650 : isTablet ? 600 : Math.min(550, height * 0.8),
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1000,
    overflow: 'hidden',
  },
  modernChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  chatCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modernChatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },

  // Legacy styles for compatibility (keeping existing ones that might be used elsewhere)
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center' },
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
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
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
  uploadButtonText: { fontSize: 16, fontWeight: '600', marginTop: 12 },
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
  previewImage: { width: 300, height: 300, borderRadius: 16, marginBottom: 16 },
  changeImageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    alignSelf: "center",
  },
  changeImageText: {
    fontWeight: "600",
  },
  analyzeButton: {
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
    borderRadius: 16,
    padding: 10,
    marginBottom: 24,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  resultTitle: { fontSize: 18, fontWeight: '600' },
  iconButton: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  languagePicker: {
    marginVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  featuresSection: { marginTop: 8 },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresList: { gap: 16 },
  featureContent: { flex: 1 },
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
  chatWindow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: isWeb ? 350 : Math.min(300, width * 0.7),
    height: isWeb ? 600 : Math.min(500, height * 0.8),
    borderRadius: 16,
    shadowColor: '#000',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: '#3b82f6',
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
});