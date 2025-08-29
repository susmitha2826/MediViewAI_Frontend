import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest, LoginRequest, VerifyOTPRequest, User } from '@/types/auth';
import { XrayAnalysis, AnalysisResult } from '@/types/xray';

const BASE_URL = "http://localhost:5000/api";


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

  async getHistory(): Promise<XrayAnalysis[]> {
    const response = await fetch(`${BASE_URL}/history/get-history`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  // X-ray API
  async analyzeXray(base64Image: string): Promise<AnalysisResult> {
    const response = await fetch(`${BASE_URL}/xray/analyze`, {
      method: 'POST',
      headers: {
        ...(await this.getAuthHeaders()), // e.g. { Authorization: "Bearer <token>", "Content-Type": "application/json" }
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image, // backend expects base64 string
      }),
    });

    return response.json();
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
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    return response.json();
  }
}

export const apiService = new ApiService();