import React from "react";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator, View } from "react-native";
import LightColors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import DarkColors from "@/constants/darkColors";
type Props = {
    selectedValue: string;
    onChange: (value: string) => void;
    enabled?: boolean;
    loading?: boolean;
};
const { darkMode } = useTheme();
const Colors = darkMode ? DarkColors : LightColors;

const languages = [
    { label: "English", value: "en" },
    { label: "Hindi", value: "hi" },
    { label: "Telugu", value: "te" },
    { label: "Tamil", value: "ta" },
    { label: "Kannada", value: "kn" },
    { label: "Malayalam", value: "ml" },
    { label: "Gujarati", value: "gu" },
    { label: "Marathi", value: "mr" },
    { label: "Bengali", value: "bn" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Chinese", value: "zh" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Arabic", value: "ar" },
    { label: "Turkish", value: "tr" },
    { label: "Dutch", value: "nl" },
    { label: "Swedish", value: "sv" },
];

export default function LanguagePicker({
    selectedValue,
    onChange,
    enabled = true,
    loading = false,
}: Props) {
    return (
        <View style={{ minWidth: 120, maxWidth: 180 }}>
            {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onChange}
                    enabled={enabled}
                    style={{
                        color: Colors.text.primary,
                        backgroundColor: Colors.background.tertiary,
                    }}
                >
                    {languages.map((lang) => (
                        <Picker.Item
                            key={lang.value}
                            label={lang.label}
                            value={lang.value}
                        />
                    ))}
                </Picker>
            )}
        </View>
    );
}
