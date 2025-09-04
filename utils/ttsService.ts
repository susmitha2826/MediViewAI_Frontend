// hooks/useSpeech.ts
import { useState } from "react";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { apiService } from "../services/api";

export function useSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
    const [cachedUrl, setCachedUrl] = useState<string | null>(null);

    const sanitizeForSpeech = (text: string) =>
        text.replace(/\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim();

    const speakExpo = (text: string, lang: string) => {
        Speech.speak(text, {
            language: lang,
            rate: 1.1,
            pitch: 1.0,
            onDone: () => setIsSpeaking(false),
        });
    };

    const speakCloud = async (text: string, lang: string) => {
        try {
            setIsLoading1(true);

            let url = cachedUrl;
            if (!url) {
                url = await apiService.getCloudTTS(text, lang); // 🔥 call API only once
                setCachedUrl(url);
            }

            const { sound } = await Audio.Sound.createAsync({ uri: url });
            setSoundObj(sound);
            await sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) return;
                if (status.didJustFinish) {
                    setIsSpeaking(false);
                    sound.unloadAsync();
                }
            });
        } catch (err) {
            console.error("❌ Cloud TTS error:", err);
            setIsSpeaking(false);
        } finally {
            setIsLoading1(false);
        }
    };

    const toggleSpeak = async (text: string, lang: string) => {
        if (!text) return;

        if (isSpeaking) {
            Speech.stop();
            if (soundObj) await soundObj.stopAsync();
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);

        const safeText = sanitizeForSpeech(text);

        // Check available voices
        const voices = await Speech.getAvailableVoicesAsync();
        const supported = voices.some((v) => v.language.startsWith(lang));

        if (supported) {
            speakExpo(safeText, lang);
        } else {
            await speakCloud(safeText, lang);
        }
    };

    return { isSpeaking, isLoading1, toggleSpeak, stop: Speech.stop };
}
