import { useEffect } from "react";
import { Platform, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/constants/darkColors";
import LandingPage from "./landing";

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (!isLoading) {
      if (isWeb) {
        // Web: landing page is handled by rendering, no redirect needed here
        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        }else{
        console.log("Redirecting to landing page for web user");
       router.replace("/landing");
      }
      } else {
        // Mobile: redirect to login or home
        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/login");
        }
      }
    }
  }, [isAuthenticated, isLoading, router, isWeb]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Web landing page
  if (isWeb && !isAuthenticated) {
    console.log("Rendering landing page for web user");
    return <LandingPage />;
  }

  // Mobile loading fallback
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background.primary,
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
