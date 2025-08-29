import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Edit3, LogOut, Calendar } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    dob: user?.dob || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        dob: user.dob,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name || !formData.dob) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await apiService.updateProfile(formData);
      updateUser({ ...user!, ...formData });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
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
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  }
};


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={40} color={Colors.text.white} />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editing && (
              <Button
                title="Edit"
                onPress={() => setEditing(true)}
                variant="outline"
                size="small"
              />
            )}
          </View>

          {editing ? (
            <View style={styles.form}>
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
              />

              <Input
                label="Date of Birth"
                value={formData.dob}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dob: text }))}
                placeholder="DD-MM-YYYY"
              />

              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setEditing(false);
                    setFormData({
                      name: user?.name || '',
                      dob: user?.dob || '',
                    });
                  }}
                  variant="outline"
                  style={styles.actionButton}
                />
                <Button
                  title="Save"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{user?.dob}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  infoSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  form: {
    gap: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  actionsSection: {
    marginTop: 20,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
});