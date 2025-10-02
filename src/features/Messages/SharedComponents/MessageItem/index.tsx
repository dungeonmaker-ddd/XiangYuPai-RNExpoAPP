// #region 1. File Banner & TOC
/**
 * MessageItem - 消息列表项组件
 * 
 * 功能描述：统一的消息列表项UI组件，支持对话和通知两种类型
 * 设计规范：基于现有Button.tsx的八段式架构模板
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
// React/框架核心导入
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

// 内部模块导入
import { ANIMATION, COLORS, SIZES, SPACING, TYPOGRAPHY } from './constants';
import type { MessageItemProps } from './types';
// #endregion

// #region 3. Types & Schema
// Props接口已在types.ts中定义
// #endregion

// #region 4. Constants & Config
// 常量已在constants.ts中定义
// #endregion

// #region 5. Utils & Helpers
/**
 * 格式化时间显示
 * 根据时间差显示不同格式的时间文本
 */
const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  // 1分钟内
  if (diff < 60000) {
    return '刚刚';
  }

  // 1小时内
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}分钟前`;
  }

  // 24小时内
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }

  // 7天内
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}天前`;
  }

  // 超过7天显示日期
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * 格式化未读数量显示
 */
const formatUnreadCount = (count: number): string => {
  if (count > 99) {
    return '99+';
  }
  return count.toString();
};
// #endregion

// #region 6. State Management
/**
 * 消息项状态管理Hook
 * 管理按压动画和交互状态
 */
const useMessageItemState = (props: MessageItemProps) => {
  const [pressed, setPressed] = useState(false);
  const animatedValue = useRef(new Animated.Value(1)).current;

  /**
   * 处理按下事件
   */
  const handlePressIn = useCallback(() => {
    setPressed(true);

    Animated.timing(animatedValue, {
      toValue: ANIMATION.pressScale,
      duration: ANIMATION.pressDuration,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  /**
   * 处理松开事件
   */
  const handlePressOut = useCallback(() => {
    setPressed(false);

    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: ANIMATION.releaseSpringTension,
      friction: ANIMATION.releaseSpringFriction,
    }).start();
  }, [animatedValue]);

  return {
    pressed,
    animatedValue,
    handlePressIn,
    handlePressOut,
  };
};
// #endregion

// #region 7. Domain Logic
// 事件处理逻辑集中在useMessageItemState中
// #endregion

// #region 8. UI Components & Rendering
/**
 * 用户头像组件
 */
const Avatar: React.FC<{ uri: string }> = React.memo(({ uri }) => (
  <Image
    source={{ uri }}
    style={styles.avatar}
    defaultSource={require('@/assets/images/react-logo.png')} // 占位图
  />
));

Avatar.displayName = 'Avatar';

/**
 * 未读角标组件
 */
const UnreadBadge: React.FC<{ count: number }> = React.memo(({ count }) => {
  if (count <= 0) return null;

  return (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadText}>{formatUnreadCount(count)}</Text>
    </View>
  );
});

UnreadBadge.displayName = 'UnreadBadge';

/**
 * MessageItem 主组件
 */
const MessageItem: React.FC<MessageItemProps> = (props) => {
  const {
    id,
    type,
    avatar,
    title,
    subtitle,
    timestamp,
    isRead,
    unreadCount = 0,
    onPress,
    onLongPress,
    style,
  } = props;

  // 使用状态管理Hook
  const state = useMessageItemState(props);

  // 格式化时间 (使用useMemo缓存)
  const formattedTime = useMemo(
    () => formatTime(timestamp),
    [timestamp]
  );

  // 处理点击事件
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  // 处理长按事件
  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      onLongPress();
    }
  }, [onLongPress]);

  return (
    <TouchableWithoutFeedback
      onPressIn={state.handlePressIn}
      onPressOut={state.handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <Animated.View
        style={[
          styles.container,
          state.pressed && styles.containerPressed,
          { transform: [{ scale: state.animatedValue }] },
          style,
        ]}
      >
        {/* 左侧头像 */}
        <Avatar uri={avatar} />

        {/* 中央内容区域 */}
        <View style={styles.contentArea}>
          <Text
            style={[styles.title, !isRead && styles.unreadTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        {/* 右侧状态区域 */}
        <View style={styles.rightArea}>
          <Text style={styles.time}>{formattedTime}</Text>
          <UnreadBadge count={unreadCount} />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SIZES.containerHeight,
    paddingHorizontal: SPACING.containerPadding,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  containerPressed: {
    backgroundColor: COLORS.backgroundPressed,
  },
  avatar: {
    width: SIZES.avatarSize,
    height: SIZES.avatarSize,
    borderRadius: SIZES.avatarSize / 2,
    marginRight: SPACING.avatarMarginRight,
    backgroundColor: COLORS.border,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.titleSize,
    color: COLORS.textPrimary,
    marginBottom: SPACING.titleMarginBottom,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.subtitleSize,
    color: COLORS.textSecondary,
  },
  rightArea: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 60,
  },
  time: {
    fontSize: TYPOGRAPHY.timeSize,
    color: COLORS.textTime,
    marginBottom: SPACING.timeMarginBottom,
  },
  unreadBadge: {
    backgroundColor: COLORS.unreadBadge,
    borderRadius: SIZES.unreadBadgeSize / 2,
    minWidth: SIZES.unreadBadgeMinWidth,
    height: SIZES.unreadBadgeSize,
    paddingHorizontal: SPACING.badgePaddingHorizontal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: COLORS.unreadBadgeText,
    fontSize: TYPOGRAPHY.badgeSize,
    fontWeight: '600',
  },
});
// #endregion

// #region 9. Exports
export default React.memo(MessageItem);
export type { MessageItemProps };
// #endregion
