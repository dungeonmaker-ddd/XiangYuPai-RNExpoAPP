/**
 * MessageItem Types - 消息列表项类型定义
 */

import type { StyleProp, ViewStyle } from 'react-native';

/**
 * MessageItem Props接口
 * 基于YAGNI原则的简化设计
 */
export interface MessageItemProps {
  // 基础数据
  id: string;
  type: 'conversation' | 'notification';
  
  // 用户信息
  avatar: string;
  title: string;
  subtitle: string;
  
  // 状态信息
  timestamp: number;
  isRead: boolean;
  unreadCount?: number;
  
  // 交互配置
  onPress: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  
  // 样式配置
  style?: StyleProp<ViewStyle>;
}

/**
 * MessageItem状态类型
 */
export interface MessageItemState {
  pressed: boolean;
  animatedValue: any; // Animated.Value
}
