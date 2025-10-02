// #region 1. File Banner & TOC
/**
 * ChatPage - 私聊对话页面
 * 
 * 功能：一对一聊天，消息气泡显示，实时收发消息
 */
// #endregion

// #region 2. Imports
import React, { useCallback, useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChatBubble } from '../SharedComponents';
import { useChatStore } from '../stores';
import type { ChatPageProps } from '../types';
// #endregion

// #region 6. State Management
const useChatPageLogic = (conversationId: string) => {
  const chat = useChatStore();

  useEffect(() => {
    chat.loadMessages(conversationId).catch(error => {
      console.error('[ChatPage] loadMessages error:', error);
    });
    
    return () => chat.clearChat();
  }, [conversationId]);

  const handleSend = useCallback(() => {
    if (chat.inputText.trim()) {
      chat.sendMessage(chat.inputText);
    }
  }, [chat]);

  return { chat, handleSend };
};
// #endregion

// #region 8. UI Components & Rendering
const ChatPage: React.FC<ChatPageProps> = ({ conversationId }) => {
  const { chat, handleSend } = useChatPageLogic(conversationId);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.title}>聊天</Text>
      </View>

      <FlatList
        data={chat.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            id={item.id}
            content={item.content}
            timestamp={item.timestamp}
            isSelf={item.senderId === 'current-user'}
            status={item.status}
          />
        )}
        inverted={false}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={chat.inputText}
          onChangeText={chat.setInputText}
          placeholder="输入消息..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !chat.inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!chat.inputText.trim()}
        >
          <Text style={styles.sendText}>发送</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: '600' },
  messagesList: { paddingVertical: 16 },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  input: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, maxHeight: 100 },
  sendButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#6366F1', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  sendButtonDisabled: { backgroundColor: '#9CA3AF' },
  sendText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
// #endregion

// #region 9. Exports
export default ChatPage;
// #endregion
