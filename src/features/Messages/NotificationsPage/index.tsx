// #region 1. File Banner & TOC
/**
 * NotificationsPage - 系统通知页面
 */
// #endregion

// #region 2. Imports
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MessageItem } from '../SharedComponents';
import { notificationsApi } from '../api';
// #endregion

// #region 6. State Management
const useNotificationsPageState = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsApi.getNotifications('system');
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('[NotificationsPage] loadNotifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, loading, loadNotifications };
};
// #endregion

// #region 8. UI Components & Rendering
const NotificationsPage: React.FC = () => {
  const state = useNotificationsPageState();

  useEffect(() => {
    state.loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>系统通知</Text>
      </View>
      
      <FlatList
        data={state.notifications}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => (
          <MessageItem
            id={item.id}
            type="notification"
            avatar={item.user?.avatar || ''}
            title="系统通知"
            subtitle={item.content}
            timestamp={item.timestamp}
            isRead={item.isRead}
            onPress={() => {}}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>暂无系统通知</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: '600' },
  empty: { padding: 48, textAlign: 'center', color: '#9CA3AF' },
});
// #endregion

// #region 9. Exports
export default NotificationsPage;
// #endregion
