/**
 * Content API - 内容操作API
 * 
 * 功能：
 * - 发布内容
 * - 编辑内容
 * - 删除内容
 * - 点赞/收藏/分享
 * - 获取我的内容
 */

import { apiClient } from './client';
import { buildQueryParams } from './config';
import type { ContentListVO } from './types/content';

// ==================== 类型定义 ====================

/**
 * 发布内容DTO
 */
export interface ContentPublishDTO {
  title?: string;              // 标题（可选）
  content: string;             // 正文（必填）
  type?: number;               // 内容类型（1:图文, 2:视频）
  mediaUrls?: string[];        // 媒体URL列表
  topicIds?: number[];         // 话题ID列表
  location?: string;           // 位置信息
  locationCode?: string;       // 位置编码
  longitude?: number;          // 经度
  latitude?: number;           // 纬度
}

/**
 * 编辑内容DTO
 */
export interface ContentUpdateDTO extends ContentPublishDTO {
  id: number;                  // 内容ID
}

/**
 * 内容操作DTO
 */
export interface ContentActionDTO {
  contentId: number;           // 内容ID
}

/**
 * 查询参数
 */
export interface ContentQueryParams {
  type?: number;               // 内容类型
  status?: number;             // 内容状态
  pageNum?: number;            // 页码
  pageSize?: number;           // 每页数量
}

// ==================== Content API Class ====================

class ContentAPI {
  /**
   * 发布内容
   */
  async publish(data: ContentPublishDTO): Promise<number> {
    console.log('[ContentAPI] 发布内容', { title: data.title });
    
    try {
      const response = await apiClient.post<number>('/xypai-content/api/v1/contents/app/publish', data);
      
      console.log('[ContentAPI] 发布成功', {
        contentId: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('[ContentAPI] 发布失败', error);
      throw error;
    }
  }

  /**
   * 编辑内容
   */
  async update(data: ContentUpdateDTO): Promise<boolean> {
    console.log('[ContentAPI] 编辑内容', { contentId: data.id });
    
    try {
      await apiClient.put<void>(`/xypai-content/api/v1/contents/app/${data.id}`, data);
      
      console.log('[ContentAPI] 编辑成功');
      return true;
    } catch (error) {
      console.error('[ContentAPI] 编辑失败', error);
      return false;
    }
  }

  /**
   * 删除内容
   */
  async delete(contentId: number): Promise<boolean> {
    console.log('[ContentAPI] 删除内容', { contentId });
    
    try {
      await apiClient.delete<void>(`/xypai-content/api/v1/contents/app/${contentId}`);
      
      console.log('[ContentAPI] 删除成功');
      return true;
    } catch (error) {
      console.error('[ContentAPI] 删除失败', error);
      return false;
    }
  }

  /**
   * 获取我的内容列表
   */
  async getMyContents(params: ContentQueryParams = {}): Promise<ContentListVO[]> {
    const { type, status, pageNum = 1, pageSize = 20 } = params;
    
    console.log('[ContentAPI] 获取我的内容', { type, status, pageNum, pageSize });
    
    try {
      const queryParams = buildQueryParams({ type, status, pageNum, pageSize });
      const url = `/xypai-content/api/v1/contents/app/my${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);
      
      console.log('[ContentAPI] 获取成功', {
        count: response.data?.length || 0
      });
      
      return response.data || [];
    } catch (error) {
      console.error('[ContentAPI] 获取失败', error);
      return [];
    }
  }

  /**
   * 点赞/取消点赞
   */
  async toggleLike(contentId: number): Promise<boolean> {
    console.log('[ContentAPI] 切换点赞状态', { contentId });
    
    try {
      await apiClient.post<void>('/xypai-content/api/v1/actions/like', { contentId });
      
      console.log('[ContentAPI] 点赞操作成功');
      return true;
    } catch (error) {
      console.error('[ContentAPI] 点赞操作失败', error);
      return false;
    }
  }

  /**
   * 收藏/取消收藏
   */
  async toggleCollect(contentId: number): Promise<boolean> {
    console.log('[ContentAPI] 切换收藏状态', { contentId });
    
    try {
      await apiClient.post<void>('/xypai-content/api/v1/actions/collect', { contentId });
      
      console.log('[ContentAPI] 收藏操作成功');
      return true;
    } catch (error) {
      console.error('[ContentAPI] 收藏操作失败', error);
      return false;
    }
  }

  /**
   * 分享
   */
  async share(contentId: number): Promise<boolean> {
    console.log('[ContentAPI] 分享内容', { contentId });
    
    try {
      await apiClient.post<void>('/xypai-content/api/v1/actions/share', { contentId });
      
      console.log('[ContentAPI] 分享成功');
      return true;
    } catch (error) {
      console.error('[ContentAPI] 分享失败', error);
      return false;
    }
  }

  /**
   * 检查点赞状态
   */
  async checkLikeStatus(contentId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`/xypai-content/api/v1/actions/like/status/${contentId}`);
      return response.data || false;
    } catch (error) {
      console.error('[ContentAPI] 检查点赞状态失败', error);
      return false;
    }
  }

  /**
   * 检查收藏状态
   */
  async checkCollectStatus(contentId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<boolean>(`/xypai-content/api/v1/actions/collect/status/${contentId}`);
      return response.data || false;
    } catch (error) {
      console.error('[ContentAPI] 检查收藏状态失败', error);
      return false;
    }
  }

  /**
   * 批量检查点赞状态
   */
  async batchCheckLikeStatus(contentIds: number[]): Promise<Map<number, boolean>> {
    try {
      const response = await apiClient.post<Record<number, boolean>>('/xypai-content/api/v1/actions/like/batch-status', contentIds);
      return new Map(Object.entries(response.data || {}).map(([k, v]) => [parseInt(k), v]));
    } catch (error) {
      console.error('[ContentAPI] 批量检查点赞状态失败', error);
      return new Map();
    }
  }

  /**
   * 批量检查收藏状态
   */
  async batchCheckCollectStatus(contentIds: number[]): Promise<Map<number, boolean>> {
    try {
      const response = await apiClient.post<Record<number, boolean>>('/xypai-content/api/v1/actions/collect/batch-status', contentIds);
      return new Map(Object.entries(response.data || {}).map(([k, v]) => [parseInt(k), v]));
    } catch (error) {
      console.error('[ContentAPI] 批量检查收藏状态失败', error);
      return new Map();
    }
  }

  /**
   * 获取我的点赞列表
   */
  async getMyLikes(pageNum: number = 1, pageSize: number = 20): Promise<ContentListVO[]> {
    try {
      const queryParams = buildQueryParams({ pageNum, pageSize });
      const url = `/xypai-content/api/v1/actions/like/my${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);
      return response.data || [];
    } catch (error) {
      console.error('[ContentAPI] 获取我的点赞列表失败', error);
      return [];
    }
  }

  /**
   * 获取我的收藏列表
   */
  async getMyCollects(pageNum: number = 1, pageSize: number = 20): Promise<ContentListVO[]> {
    try {
      const queryParams = buildQueryParams({ pageNum, pageSize });
      const url = `/xypai-content/api/v1/actions/collect/my${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<ContentListVO[]>(url);
      return response.data || [];
    } catch (error) {
      console.error('[ContentAPI] 获取我的收藏列表失败', error);
      return [];
    }
  }
}

// 导出单例
export const contentApi = new ContentAPI();

// 导出类型
export type { ContentListVO };

