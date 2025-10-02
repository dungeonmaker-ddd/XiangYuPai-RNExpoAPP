/**
 * Chat Store - 聊天状态管理
 * 
 * 管理当前聊天会话和消息列表
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { chatApi } from '../api';
import { ERROR_MESSAGES } from '../constants';
import type { ChatState, Message } from '../types';

/**
 * 聊天Store
 * 注意：聊天消息不持久化，每次从服务器加载
 */
export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
  // ============================================
  // 状态
  // ============================================
  currentChat: null,
  messages: [],
  inputText: '',
  loading: false,

  // ============================================
  // Actions
  // ============================================

  /**
   * 加载聊天消息
   */
  loadMessages: async (chatId: string) => {
    set({ loading: true });
    
    try {
      const response = await chatApi.getMessages(chatId);
      const messages = response.messages || [];
      
      set({
        messages,
        loading: false,
      });
      
      // 标记消息为已读
      const unreadMessageIds = messages
        .filter(msg => msg.status !== 'read' && !msg.senderId)
        .map(msg => msg.id);
      
      if (unreadMessageIds.length > 0) {
        chatApi.markMessagesAsRead(chatId, unreadMessageIds).catch(error => {
          console.error('[chatStore] markMessagesAsRead error:', error);
        });
      }
    } catch (error) {
      console.error('[chatStore] loadMessages error:', error);
      set({ loading: false });
      throw new Error(ERROR_MESSAGES.LOAD_MESSAGES_FAILED);
    }
  },

  /**
   * 设置当前对话
   */
  setCurrentChat: (conversation) => {
    set({ currentChat: conversation });
  },

  /**
   * 发送消息
   */
  sendMessage: async (content: string) => {
    const { currentChat } = get();
    
    if (!currentChat || !content.trim()) {
      return;
    }
    
    // 创建临时消息（乐观更新）
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: currentChat.id,
      senderId: 'current-user', // TODO: 从用户Store获取当前用户ID
      content: content.trim(),
      timestamp: Date.now(),
      status: 'sending',
    };
    
    // 立即显示在UI上
    set(state => ({
      messages: [...state.messages, tempMessage],
      inputText: '', // 清空输入框
    }));
    
    try {
      // 调用API发送消息
      await chatApi.sendMessage(currentChat.id, content.trim());
      
      // 更新消息状态为已发送 (使用state获取最新值)
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, status: 'sent' as const }
            : msg
        ),
      }));
    } catch (error) {
      console.error('[chatStore] sendMessage error:', error);
      
      // 更新消息状态为失败 (使用state获取最新值)
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, status: 'failed' as const }
            : msg
        ),
      }));
      
      throw new Error(ERROR_MESSAGES.SEND_MESSAGE_FAILED);
    }
  },

  /**
   * 设置输入文本
   */
  setInputText: (text: string) => {
    set({ inputText: text });
  },

  /**
   * 清空聊天
   */
  clearChat: () => {
    set({
      currentChat: null,
      messages: [],
      inputText: '',
      loading: false,
    });
  },
    }),
    { name: 'ChatStore' }
  )
);

// ============================================
// 选择器导出 (Selector Exports)
// ============================================

/**
 * 获取当前对话
 */
export const useCurrentChat = () => useChatStore(state => state.currentChat);

/**
 * 获取聊天消息列表
 */
export const useChatMessages = () => useChatStore(state => state.messages);

/**
 * 获取输入文本
 */
export const useChatInputText = () => useChatStore(state => state.inputText);

/**
 * 获取聊天加载状态
 */
export const useChatLoading = () => useChatStore(state => state.loading);
