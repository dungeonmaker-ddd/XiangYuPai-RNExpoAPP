/**
 * InfoCard - 信息卡片组件
 * 
 * 功能：
 * - 显示卡片标题
 * - 支持编辑按钮（仅本人显示）
 * - 白色背景，圆角12px
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// #region Types
interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  onEditPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
// #endregion

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  onEditPress,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        
        {/* 编辑按钮（如果提供了onEditPress） */}
        {onEditPress && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color="#8A2BE2" />
            <Text style={styles.editText}>编辑</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 内容区域 */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 17,
    color: '#333333',
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 14,
    color: '#8A2BE2',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default InfoCard;

