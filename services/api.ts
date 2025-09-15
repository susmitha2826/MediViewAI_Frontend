import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest, LoginRequest, VerifyOTPRequest, User } from '@/types/auth';
import { XrayAnalysis, AnalysisResult } from '@/types/xray';

// const BASE_URL = "http://localhost:5000/api";

// const BASE_URL = "https://mediviewai-backend.onrender.com/api";

// const BASE_URL = "http://100.24.165.115:5050/api";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const SUPPORTED_LANGUAGES: any = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", flag: "🇮🇳" },

  // keep the global ones you had before
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
];


class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async getFormDataHeaders() {
    const token = await AsyncStorage.getItem('auth_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Auth APIs
  async register(data: RegisterRequest) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async verifyOTP(data: VerifyOTPRequest) {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async login(data: LoginRequest) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }


  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const langObj = SUPPORTED_LANGUAGES.find((lang: any) => lang.code === targetLanguage);
      if (!langObj) throw new Error("Unsupported language");

      const response = await fetch(`${BASE_URL}/xray/translate`, {
        method: "POST",
        headers: {
          ...(await this.getAuthHeaders()),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, languageName: langObj.code }), // use code
      });

      if (!response.ok) {
        throw new Error("Failed to translate");
      }

      return response.json();
    } catch (err) {
      console.error("Translation error:", err);
      return text;
    }
  }



  // User APIs
  async getProfile(): Promise<User> {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async updateProfile(data: { name: string; dob: string }) {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getHistory(
    page = 1,
    limit = 7
  ): Promise<{ history: XrayAnalysis[]; totalPages: number }> {
    try {
      // console.log(`[apiService] Fetching history - page: ${page}, limit: ${limit}`);

      const response = await fetch(
        `${BASE_URL}/history/get-history?page=${page}&limit=${limit}`,
        {
          headers: await this.getAuthHeaders(),
        }
      );

      // console.log('[apiService] Raw response:', response);

      const data = await response.json();
      // console.log('[apiService] Parsed JSON:', data);

      // Ensure backend returns { history, totalPages }
      const historyData = data.history || [];
      const totalPages = data.totalPages || 1;

      // console.log(`[apiService] Returning history length: ${historyData.length}, totalPages: ${totalPages}`);

      return {
        history: historyData,
        totalPages,
      };
    } catch (error) {
      console.error('[apiService] Error fetching history:', error);
      return { history: [], totalPages: 1 };
    }
  }


  async clearHistory(): Promise<{ msg: string }> {
    const response = await fetch(`${BASE_URL}/history/clear-history`, {
      method: "PUT", // safer than GET, since we’re updating
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  // X-ray API
async analyzeXray(base64Images: string[] | string, model: any): Promise<AnalysisResult> {
  const imagesArray = Array.isArray(base64Images) ? base64Images : [base64Images];

  // Determine endpoint based on model
  const endpoint = model === "chexnet" ? "/xray/upload" : "/xray/analyze";

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(await this.getAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      images: imagesArray,
    }),
  });

  return response.json();
}

  // apiService.ts
  async getCloudTTS(text: string, lang: string) {
    try {
      const res = await fetch(`${BASE_URL}/xray/tts`, {
        method: "POST",
        headers: {
          ...(await this.getAuthHeaders()),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, lang }),
      });

      if (!res.ok) {
        throw new Error(`TTS request failed: ${res.status}`);
      }

      const { audioBase64, mimeType } = await res.json();

      if (!audioBase64) {
        throw new Error("No audioBase64 in TTS response");
      }

      // Build playable URI
      const audioUri = `data:${mimeType};base64,${audioBase64}`;
      return audioUri; // ✅ works in <audio src> (web) or expo-av
    } catch (err) {
      console.error("❌ Error fetching TTS:", err);
      throw err;
    }
  }



  // async uploadDicom(file: any): Promise<AnalysisResult> {
  //   const token = await AsyncStorage.getItem('auth_token');

  //   const form = new FormData();
  //   form.append('file', {
  //     uri: file.uri,
  //     type: file.type || 'application/dicom',
  //     name: file.name || 'xray.dcm',
  //   } as any); // cast to any to satisfy TS


  //   const response = await fetch(`${BASE_URL}/xray/upload-dicom`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       ...(token && { Authorization: `Bearer ${token}` }),
  //     },
  //     body: form, // ✅ send FormData here
  //   });

  //   if (!response.ok) {
  //     throw new Error('DICOM upload failed');
  //   }

  //   return response.json(); // ✅ parse JSON response
  // }


  // AI Chat API
  async sendChatMessage(messages: { role: string; content: string }[]) {
    // Prepend a system message to set medical context
    const systemMessage = {
      role: "system",
      content: `You are a knowledgeable medical chatbot. Answer all questions accurately and professionally. 
Provide clear explanations and use medical terminology when appropriate, but also explain complex terms in simple language if needed. 
Only respond to medical-related queries; do not provide unrelated advice.`
    };

    const updatedMessages = [systemMessage, ...messages];

    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    return response.json();
  }

}

export const apiService = new ApiService();