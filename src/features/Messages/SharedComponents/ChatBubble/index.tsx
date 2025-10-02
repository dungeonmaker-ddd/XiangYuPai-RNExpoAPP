// #region 1. File Banner & TOC
/**
 * ChatBubble - 消息气泡组件
 * 
 * 功能：发送和接收消息的气泡样式，支持消息状态指示
 */
// #endregion

// #region 2. Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ChatBubbleProps } from '../../types';
// #endregion

// #region 3. Types & Schema
// #endregion

// #region 4. Constants & Config
const COLORS = {
  bubbleSelf: '#6366F1',
  bubbleOther: '#F3F4F6',
  textSelf: '#FFFFFF',
  textOther: '#1F2937',
  statusText: '#9CA3AF',
  errorText: '#EF4444',
};

const MAX_WIDTH = 280;
// #endregion

// #region 5. Utils & Helpers
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getStatusText = (status?: ChatBubbleProps['status']): string => {
  switch (status) {
    case 'sending':
      return '发送中...';
    case 'failed':
      return '发送失败';
    default:
      return '';
  }
};
// #endregion

// #region 6. State Management
// #endregion

// #region 7. Domain Logic
// #endregion

// #region 8. UI Components & Rendering
const ChatBubble: React.FC<ChatBubbleProps> = ({
  id,
  content,
  timestamp,
  isSelf,
  status,
  onPress,
  onLongPress,
  onResend,
}) => {
  const bubbleColor = isSelf ? COLORS.bubbleSelf : COLORS.bubbleOther;
  const textColor = isSelf ? COLORS.textSelf : COLORS.textOther;
  const showStatus = isSelf && (status === 'sending' || status === 'failed');

  return (
    <View style={[styles.container, isSelf ? styles.containerSelf : styles.containerOther]}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
        style={[styles.bubble, { backgroundColor: bubbleColor }]}
      >
        <Text style={[styles.content, { color: textColor }]}>{content}</Text>
        <View style={styles.footer}>
          <Text style={[styles.time, { color: isSelf ? COLORS.textSelf : COLORS.statusText }]}>
            {formatTime(timestamp)}
          </Text>
          {showStatus && (
            <Text
              style={[
                styles.status,
                { color: status === 'failed' ? COLORS.errorText : COLORS.textSelf },
              ]}
            >
              {getStatusText(status)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      {status === 'failed' && onResend && (
        <TouchableOpacity onPress={onResend} style={styles.resendButton}>
          <Text style={styles.resendText}>重发</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  containerSelf: {
    justifyContent: 'flex-end',
  },
  containerOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: MAX_WIDTH,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    marginRight: 6,
  },
  status: {
    fontSize: 11,
  },
  resendButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resendText: {
    color: COLORS.errorText,
    fontSize: 12,
  },
});
// #endregion

// #region 9. Exports
export default React.memo(ChatBubble);
// #endregion
