/**
 * Notifications API - 通知接口
 * 
 * 处理各类通知（赞、评论、粉丝、系统通知）的API调用
 */

import { api } from '@/services/api/client';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, NotificationsResponse } from '../types';

/**
 * 通知类型
 */
type NotificationType = 'like' | 'comment' | 'follow' | 'system';

/**
 * 通知模块API接口
 */
export const notificationsApi = {
  /**
   * 获取指定类型的通知列表
   */
  getNotifications: async (
    type: NotificationType
  ): Promise<NotificationsResponse> => {
    try {
      const response = await api.get<NotificationsResponse>(
        API_ENDPOINTS.NOTIFICATIONS(type)
      );
      return response.data;
    } catch (error) {
      console.error('[notificationsApi] getNotifications error:', error);
      throw error;
    }
  },

  /**
   * 清空指定类型的通知
   */
  clearNotifications: async (type: NotificationType): Promise<ApiResponse> => {
    try {
      const response = await api.delete<ApiResponse>(
        API_ENDPOINTS.CLEAR_NOTIFICATIONS(type)
      );
      return response.data;
    } catch (error) {
      console.error('[notificationsApi] clearNotifications error:', error);
      throw error;
    }
  },
};
