import { Tabs, useRouter } from "expo-router";
import { Home, History, User, Info } from "lucide-react-native";
import React, { useState } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import Colors from "@/constants/colors";
import { Sun, Moon } from "lucide-react-native";

// Dummy user data (replace with AuthContext later)
const user = {
  name: "Susmitha Gopireddy",
  avatar: "", // leave empty to show initial
};

export default function TabLayout() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // helper: get initial from name
  const getInitial = (name?: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.light,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopColor: Colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },

        // 👇 Custom Header
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 28, height: 28, borderRadius: 6 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: Colors.text.primary,
              }}
            >
              MediView AI
            </Text>
          </View>
        ),

        // 👇 Right side actions
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginRight: 12 }}>
            {/* Dark/Light toggle */}
            <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
              {darkMode ? (
                <Moon size={24} color="#000" />
              ) : (
                <Sun size={24} color="#FFA500" />
              )}
            </TouchableOpacity>

            {/* Profile picture OR Initial */}
            <TouchableOpacity onPress={() => router.push("/profile")}>
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
              ) : (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {getInitial(user?.name)}
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
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
