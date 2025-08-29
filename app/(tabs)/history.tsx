import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, FileText } from 'lucide-react-native';
import { XrayAnalysis } from '@/types/xray';
import { apiService } from '@/services/api';
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  const [history, setHistory] = useState<XrayAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await apiService.getHistory();
      console.log("API history response:", data); // 🔎 Debug API response
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderHistoryItem = ({ item }: { item: XrayAnalysis }) => (
    <TouchableOpacity style={styles.historyItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemDate}>{formatDate(item?.timestamp)}</Text>
          <View style={styles.dateIcon}>
            <Calendar size={16} color={Colors.text.secondary} />
          </View>
        </View>
        <View style={styles.resultsContainer}>
          {item?.analysisResult ? (
            (Array.isArray(item.analysisResult)
              ? item.analysisResult
              : [item.analysisResult]
            ).map((res, index) => (
              <Text key={index} style={styles.conditionName}>{res}</Text>
            ))
          ) : (
            <Text style={styles.conditionName}>No results available</Text>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        <Text style={styles.subtitle}>Your previous X-ray analyses</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={64} color={Colors.text.light} />
          <Text style={styles.emptyTitle}>No analyses yet</Text>
          <Text style={styles.emptyDescription}>
            Upload your first X-ray to see analysis results here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.background.tertiary,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemDate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dateIcon: {
    opacity: 0.6,
  },
  resultsContainer: {
    gap: 4,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  confidence: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
