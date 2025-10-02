/**
 * Chat API - 聊天接口
 * 
 * 处理私聊相关的API调用
 */

import { api } from '@/services/api/client';
import { API_ENDPOINTS, PAGINATION_CONFIG } from '../constants';
import type { ApiResponse, MessagesResponse } from '../types';

/**
 * 聊天模块API接口
 */
export const chatApi = {
  /**
   * 获取聊天消息列表
   */
  getMessages: async (
    chatId: string,
    page: number = PAGINATION_CONFIG.INITIAL_PAGE
  ): Promise<MessagesResponse> => {
    try {
      const response = await api.get<MessagesResponse>(
        API_ENDPOINTS.MESSAGES(chatId),
        {
          params: {
            page,
            pageSize: PAGINATION_CONFIG.PAGE_SIZE,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('[chatApi] getMessages error:', error);
      throw error;
    }
  },

  /**
   * 发送消息
   */
  sendMessage: async (
    chatId: string,
    content: string
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>(
        API_ENDPOINTS.SEND_MESSAGE(chatId),
        { content }
      );
      return response.data;
    } catch (error) {
      console.error('[chatApi] sendMessage error:', error);
      throw error;
    }
  },

  /**
   * 标记消息为已读
   */
  markMessagesAsRead: async (
    chatId: string,
    messageIds: string[]
  ): Promise<ApiResponse> => {
    try {
      const response = await api.patch<ApiResponse>(
        API_ENDPOINTS.MARK_MESSAGES_READ(chatId),
        { messageIds }
      );
      return response.data;
    } catch (error) {
      console.error('[chatApi] markMessagesAsRead error:', error);
      throw error;
    }
  },
};
