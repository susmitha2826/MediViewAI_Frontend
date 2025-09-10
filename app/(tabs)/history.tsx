import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, FileText } from 'lucide-react-native';
import { XrayAnalysis } from '@/types/xray';
import { apiService } from '@/services/api';
import { useTheme } from "@/contexts/ThemeContext";
import LightColors from "@/constants/colors";
import DarkColors from "@/constants/darkColors";
import { useFocusEffect } from 'expo-router';

export default function HistoryScreen() {
  const { darkMode } = useTheme();
  const Colors = darkMode ? DarkColors : LightColors;

  const [history, setHistory] = useState<XrayAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setHistory([]);
      setPage(1);
      setHasMore(true);
      loadHistory(1);
    }, [])
  );

  const loadHistory = async (pageToLoad: number) => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const data = await apiService.getHistory(pageToLoad, 7);
      setHistory((prev) => {
        const newHistory = [...prev, ...data.history];
        const uniqueHistory = Array.from(new Map(newHistory.map(item => [item.id, item])).values());
        return uniqueHistory;
      });
      setHasMore(pageToLoad < data.totalPages);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadHistory(nextPage);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const renderHistoryItem = ({ item }: { item: XrayAnalysis }) => (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.background.secondary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Horizontal scroll of images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {item?.imageUrl?.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              backgroundColor: Colors.background.tertiary,
              marginRight: 8,
            }}
          />
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text.primary }}>
          {formatDate(item.timestamp)}
        </Text>
        <Calendar size={16} color={Colors.text.secondary} />
      </View>

      <View style={{ gap: 4 }}>
        {(Array.isArray(item.analysisResult) ? item.analysisResult : [item.analysisResult]).map((res, index) => (
          <Text key={index} style={{ fontSize: 14, color: Colors.text.secondary }}>
            {res || "No results available"}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.primary }}>
      {/* Header */}
      <View style={{ padding: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 4 }}>
          Analysis History
        </Text>
        <Text style={{ fontSize: 16, color: Colors.text.secondary }}>
          Your previous medical report analyses
        </Text>
      </View>

      {/* Empty state */}
      {history.length === 0 && !loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <FileText size={64} color={Colors.text.light} />
          <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.text.primary, marginTop: 16, marginBottom: 8 }}>
            No analyses yet
          </Text>
          <Text style={{ fontSize: 16, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22 }}>
            Upload your first report to see analysis results here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? (
            <View style={{ padding: 16 }}>
              <Text style={{ textAlign: 'center', color: Colors.text.secondary }}>Loading more...</Text>
            </View>
          ) : null}
        />
      )}
    </SafeAreaView>
  );
}
