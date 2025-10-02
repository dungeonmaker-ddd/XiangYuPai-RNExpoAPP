// #region 1. File Banner & TOC
/**
 * EventCenterPage - 组局中心页面
 * 功能描述：线下活动组织系统
 * TOC: [1] Imports - [2] Types - [3] Constants - [4] Utils - [5] State - [6] Logic - [7] UI - [8] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, ErrorBoundary } from '../../../../components';
// #endregion

// #region 3. Types & Schema
interface EventCenterPageProps {}
interface EventData {
  eventId: string;
  title: string;
  organizer: { nickname: string; avatar: string };
  startTime: string;
  location: { address: string; distance: number };
  currentCount: number;
  maxCount: number;
  status: 'open' | 'full' | 'closed';
}
// #endregion

// #region 4. Constants & Config
const COLORS = { BACKGROUND: '#FFFFFF', PRIMARY: '#6366F1', TEXT: '#1F2937', TEXT_SECONDARY: '#6B7280', BORDER: '#E5E7EB' };
// #endregion

// #region 5-6. Utils & State Management
const useEventCenterLogic = () => {
  const router = useRouter();
  const [events] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  
  const handleEventPress = useCallback((eventId: string) => {
    console.log('Event clicked:', eventId);
  }, []);
  
  const handlePublish = useCallback(() => {
    console.log('Publish event');
  }, []);
  
  return { events, loading, handleEventPress, handlePublish, handleBack: () => router.back() };
};
// #endregion

// #region 7. UI Components & Rendering
const EventCenterPage: React.FC<EventCenterPageProps> = () => {
  const { events, loading, handleEventPress, handlePublish, handleBack } = useEventCenterLogic();
  
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.title}>组局中心</Text>
          <TouchableOpacity onPress={handlePublish}><Text style={styles.publishButton}>发布</Text></TouchableOpacity>
        </View>
        
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEventPress(item.eventId)}>
                <Card style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventInfo}>👤 {item.currentCount}/{item.maxCount} · 📍 {formatDistance(item.location.distance)}</Text>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.eventId}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyTitle}>暂无活动</Text>
            <Text style={styles.emptySubtitle}>发布一个组局活动吧</Text>
          </View>
        )}
      </View>
    </ErrorBoundary>
  );
};

const formatDistance = (distance: number) => distance < 1000 ? `${Math.round(distance)}m` : `${(distance/1000).toFixed(1)}km`;
// #endregion

// #region 8. Exports & Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER },
  backButton: { fontSize: 24, color: COLORS.TEXT, marginRight: 16 },
  title: { flex: 1, fontSize: 18, fontWeight: '600', color: COLORS.TEXT, textAlign: 'center' },
  publishButton: { fontSize: 14, color: COLORS.PRIMARY, fontWeight: '600' },
  eventCard: { margin: 16, padding: 16 },
  eventTitle: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT, marginBottom: 8 },
  eventInfo: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.TEXT, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
});

export default EventCenterPage;
// #endregion
