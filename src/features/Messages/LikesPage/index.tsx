// #region 1. File Banner & TOC
/**
 * LikesPage - 赞和收藏消息页面
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MessageItem } from '../SharedComponents';
import { notificationsApi } from '../api';
// #endregion

// #region 3. Types & Schema
// #endregion

// #region 4. Constants & Config
// #endregion

// #region 5. Utils & Helpers
// #endregion

// #region 6. State Management
const useLikesPageState = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsApi.getNotifications('like');
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('[LikesPage] loadNotifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, loading, loadNotifications };
};
// #endregion

// #region 7. Domain Logic
// #endregion

// #region 8. UI Components & Rendering
const LikesPage: React.FC = () => {
  const router = useRouter();
  const state = useLikesPageState();

  useEffect(() => {
    state.loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>赞和收藏</Text>
      </View>
      
      {state.loading ? (
        <Text style={styles.loading}>加载中...</Text>
      ) : (
        <FlatList
          data={state.notifications}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: any) => (
            <MessageItem
              id={item.id}
              type="notification"
              avatar={item.user?.avatar || ''}
              title={item.user?.nickname || ''}
              subtitle={item.content}
              timestamp={item.timestamp}
              isRead={item.isRead}
              onPress={() => {}}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>暂无通知</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: '600' },
  loading: { padding: 32, textAlign: 'center', color: '#9CA3AF' },
  empty: { padding: 48, textAlign: 'center', color: '#9CA3AF' },
});
// #endregion

// #region 9. Exports
export default LikesPage;
// #endregion
