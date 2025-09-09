import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  Shield,
  HelpCircle,
  FileText,
  Trash2,
  ExternalLink,
  Edit3,
  LogOut,
} from "lucide-react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkColors : LightColors;

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    dob: user?.dob || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        dob: user.dob,
      });
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const data = await apiService.getProfile();
      setAnalyses(data?.history || []);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllAnalyses = async () => {
    try {
      await apiService.clearHistory();
      setAnalyses([]);
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.dob) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await apiService.updateProfile(formData);
      updateUser({ ...user!, ...formData });
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to logout?")) logout();
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]);
    }
  };

  const handleClearHistory = () => {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Are you sure you want to delete all your analysis history? This action cannot be undone."
        )
      )
        clearAllAnalyses();
    } else {
      Alert.alert(
        "Clear All History",
        "Are you sure you want to delete all your analysis history? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear All", style: "destructive", onPress: clearAllAnalyses },
        ]
      );
    }
  };

  const showPrivacyInfo = () => {
    if (Platform.OS === "web") {
      window.alert(
        "Privacy & Security\n\nYour medical images are processed securely and are not stored on our servers. All data remains on your device."
      );
    } else {
      Alert.alert(
        "Privacy & Security",
        "Your medical images are processed securely and are not stored on our servers. All data remains on your device.",
        [{ text: "OK" }]
      );
    }
  };

  const showDisclaimerInfo = () => {
    Alert.alert(
      "Medical Disclaimer",
      "This app is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.",
      [{ text: "Understood" }]
    );
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.background.tertiary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <User color={Colors.primary} size={40} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: Colors.text.primary }}>
            {user?.name}
          </Text>
          <Text style={{ fontSize: 14, color: Colors.text.secondary, marginTop: 4 }}>
            {user?.email}
          </Text>
        </View>

        {/* Personal Info */}
        <View
          style={{
            backgroundColor: Colors.background.primary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: Colors.text.primary, marginBottom: 12 }}>
              Personal Information
            </Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Edit3 color={Colors.primary} size={20} />
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <>
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
              />
              <Input
                label="Date of Birth"
                value={formData.dob}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, dob: text }))}
              />

              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 16 }}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setEditing(false);
                    setFormData({ name: user?.name || "", dob: user?.dob || "" });
                  }}
                  style={{ marginLeft: 10 }}
                />
                <Button
                  title="Save"
                  loading={loading}
                  onPress={handleSave}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 15, color: Colors.text.primary, marginBottom: 8 }}>
                Full Name: {user?.name}
              </Text>
              <Text style={{ fontSize: 15, color: Colors.text.primary, marginBottom: 8 }}>
                Email: {user?.email}
              </Text>
              <Text style={{ fontSize: 15, color: Colors.text.primary, marginBottom: 8 }}>
                DOB: {user?.dob}
              </Text>
              <Text style={{ fontSize: 15, color: Colors.text.primary, marginBottom: 8 }}>
                Member Since: {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </Text>
            </>
          )}
        </View>

        {/* Stats */}
        <View
          style={{
            backgroundColor: Colors.background.primary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: Colors.text.primary, marginBottom: 12 }}>
            Your Activity
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: Colors.primary, marginBottom: 4 }}>
                {analyses?.length}
              </Text>
              <Text style={{ fontSize: 14, color: Colors.text.secondary }}>Total Analyses</Text>
            </View>
            <View style={{ width: 1, height: 40, backgroundColor: Colors.border }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: Colors.primary, marginBottom: 4 }}>
                {analyses.filter((a: any) => {
                  const today = new Date();
                  const d = new Date(a.timestamp);
                  return d.toDateString() === today.toDateString();
                }).length}
              </Text>
              <Text style={{ fontSize: 14, color: Colors.text.secondary }}>Today</Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: Colors.text.primary, marginBottom: 12 }}>
            Information
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.background.primary,
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
            onPress={showPrivacyInfo}
          >
            <Shield color={Colors.primary} size={20} />
            <Text style={{ flex: 1, fontSize: 16, color: Colors.text.primary, marginLeft: 12 }}>
              Privacy & Security
            </Text>
            <ExternalLink color={Colors.text.secondary} size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.background.primary,
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
            onPress={showDisclaimerInfo}
          >
            <FileText color={Colors.primary} size={20} />
            <Text style={{ flex: 1, fontSize: 16, color: Colors.text.primary, marginLeft: 12 }}>
              Medical Disclaimer
            </Text>
            <ExternalLink color={Colors.text.secondary} size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.background.primary,
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
            onPress={() =>
              Alert.alert(
                "Help",
                "For support, please contact our team through the app store."
              )
            }
          >
            <HelpCircle color={Colors.primary} size={20} />
            <Text style={{ flex: 1, fontSize: 16, color: Colors.text.primary, marginLeft: 12 }}>
              Help & Support
            </Text>
            <ExternalLink color={Colors.text.secondary} size={16} />
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", color: Colors.text.primary, marginBottom: 12 }}>
            Data Management
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors.background.tertiary,
              padding: 16,
              borderRadius: 12,
              marginBottom: 8,
            }}
            onPress={handleClearHistory}
          >
            <Trash2 color={Colors.danger} size={20} />
            <Text style={{ flex: 1, fontSize: 16, color: Colors.danger, marginLeft: 12 }}>
              Clear All History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.background.tertiary,
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
          }}
          onPress={handleLogout}
        >
          <LogOut color={Colors.danger} size={20} />
          <Text style={{ flex: 1, fontSize: 16, color: Colors.danger, marginLeft: 12 }}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View
          style={{
            alignItems: "center",
            marginTop: 32,
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
          }}
        >
          <Text style={{ fontSize: 14, color: Colors.text.secondary, marginBottom: 4 }}>
            Medical Report Analysis v1.0.0
          </Text>
          <Text style={{ fontSize: 12, color: Colors.text.secondary, textAlign: "center" }}>
            Always consult healthcare professionals for medical advice
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
