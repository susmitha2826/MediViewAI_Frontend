import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
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

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState([]);
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
      // console.log("API profile response:", data);
      setAnalyses(data?.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllAnalyses = async () => {
    try {
      const res = await apiService.clearHistory();
      // console.log(res.msg); // "History Cleared"

      // Optionally, refresh local state
      setAnalyses([]); // or refetch if you need latest from server
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
      if (window.confirm("Are you sure you want to logout?")) {
        logout();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]);
    }
  };

  const handleClearHistory = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete all your analysis history? This action cannot be undone.")) {
        clearAllAnalyses();
      }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileIcon}>
            <User color="#4A90E2" size={40} />
          </View>
          <Text style={styles.title}>{user?.name}</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>

        {/* Personal Info */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Edit3 color="#4A90E2" size={20} />
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View>
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
              />
              <Input
                label="Date of Birth"
                value={formData.dob}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, dob: text }))
                }
              />

              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setEditing(false);
                    setFormData({
                      name: user?.name || "",
                      dob: user?.dob || "",
                    });
                  }}
                  style={styles.actionButton}
                />
                <Button
                  title="Save"
                  loading={loading}
                  onPress={handleSave}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.infoText}>Full Name: {user?.name}</Text>
              <Text style={styles.infoText}>Email: {user?.email}</Text>
              <Text style={styles.infoText}>DOB: {user?.dob}</Text>
              <Text style={styles.infoText}>
                Member Since:{" "}
                {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analyses?.length}</Text>
              <Text style={styles.statLabel}>Total Analyses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {
                  analyses.filter((a: any) => {
                    const today = new Date();
                    const d = new Date(a.timestamp);
                    return d.toDateString() === today.toDateString();
                  }).length
                }
              </Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>

          <TouchableOpacity style={styles.menuItem} onPress={showPrivacyInfo}>
            <Shield color="#4A90E2" size={20} />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <ExternalLink color="#8E8E93" size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={showDisclaimerInfo}
          >
            <FileText color="#4A90E2" size={20} />
            <Text style={styles.menuText}>Medical Disclaimer</Text>
            <ExternalLink color="#8E8E93" size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                "Help",
                "For support, please contact our team through the app store."
              )
            }
          >
            <HelpCircle color="#4A90E2" size={20} />
            <Text style={styles.menuText}>Help & Support</Text>
            <ExternalLink color="#8E8E93" size={16} />
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleClearHistory}
          >
            <Trash2 color="#FF3B30" size={20} />
            <Text style={[styles.menuText, styles.dangerText]}>
              Clear All History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.menuItem, styles.dangerItem]}
          onPress={handleLogout}
        >
          <LogOut color="#FF3B30" size={20} />
          <Text style={[styles.menuText, styles.dangerText]}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Medical Report Analysis v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Always consult healthcare professionals for medical advice
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20 },
  header: { alignItems: "center", marginBottom: 32 },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1C1C1E" },
  subtitle: { fontSize: 14, color: "#6D6D70", marginTop: 4 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  infoText: { fontSize: 15, color: "#333", marginBottom: 8 },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  actionButton: { marginLeft: 10 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 4,
  },
  statLabel: { fontSize: 14, color: "#8E8E93" },
  statDivider: { width: 1, height: 40, backgroundColor: "#E5E5EA" },
  section: { marginBottom: 24 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    marginLeft: 12,
  },
  dangerItem: { backgroundColor: "#FFF5F5" },
  dangerText: { color: "#FF3B30" },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  footerText: { fontSize: 14, color: "#8E8E93", marginBottom: 4 },
  footerSubtext: { fontSize: 12, color: "#8E8E93", textAlign: "center" },
});
