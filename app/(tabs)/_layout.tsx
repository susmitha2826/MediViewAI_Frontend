import { Tabs, useRouter } from "expo-router";
import { Home, History, User, Info } from "lucide-react-native";
import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function TabLayout() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();
  const theme = darkMode ? DarkColors : LightColors;

  // Get user from AuthContext
  const { user } = useAuth();

  // Fallback if user not loaded
  const displayUser = {
    name: user?.name || "User",
    avatar: user?.avatar || "",
  };

  const getInitial = (name?: string) => (!name ? "?" : name.charAt(0).toUpperCase());

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.light,
        tabBarStyle: {
          backgroundColor: theme.background.primary,
          borderTopColor: theme.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },

        headerShown: true,
        headerStyle: { backgroundColor: theme.background.primary },
        headerTitleStyle: { color: theme.text.primary },
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 28, height: 28, borderRadius: 6 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text.primary }}>
              MediView AI
            </Text>
          </View>
        ),

        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginRight: 12 }}>
            <TouchableOpacity onPress={toggleDarkMode}>
              {darkMode ? <Moon size={24} color={theme.text.primary} /> : <Sun size={24} color={theme.warning} />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/profile")}>
              {displayUser.avatar ? (
                <Image
                  source={{ uri: displayUser.avatar }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
              ) : (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.primary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: theme.text.white, fontWeight: "600" }}>
                    {getInitial(displayUser.name)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ tabBarLabel: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ tabBarLabel: "History", tabBarIcon: ({ color, size }) => <History color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarLabel: "Profile", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="about"
        options={{ tabBarLabel: "About", tabBarIcon: ({ color, size }) => <Info color={color} size={size} /> }}
      />
    </Tabs>
  );
}
