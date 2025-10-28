/**
 * Comment API - 评论系统API
 * 
 * 功能：
 * - 发表评论
 * - 删除评论
 * - 获取评论列表
 * - 获取评论回复
 * - 评论点赞
 * - 统计评论数
 */

import { apiClient } from './client';
import { buildQueryParams } from './config';

// ==================== 类型定义 ====================

/**
 * 评论VO
 */
export interface CommentVO {
  id: string;                  // 评论ID
  contentId: string;           // 内容ID
  userId: string;              // 用户ID
  userName: string;            // 用户名
  userAvatar: string;          // 用户头像
  parentId?: string;           // 父评论ID（回复时有值）
  replyToUserId?: string;      // 回复的用户ID
  replyToUserName?: string;    // 回复的用户名
  content: string;             // 评论内容
  likeCount: number;           // 点赞数
  replyCount: number;          // 回复数
  isLiked: boolean;            // 是否点赞
  isTop: boolean;              // 是否置顶
  createdAt: number;           // 创建时间
  replies?: CommentVO[];       // 子回复列表
}

/**
 * 发表评论DTO
 */
export interface CommentAddDTO {
  contentId: number;           // 内容ID
  content: string;             // 评论内容
  parentId?: number;           // 父评论ID（回复时传递）
  replyToUserId?: number;      // 回复的用户ID
}

/**
 * 评论查询参数
 */
export interface CommentQueryParams {
  contentId: number;           // 内容ID
  pageNum?: number;            // 页码
  pageSize?: number;           // 每页数量
}

// ==================== Comment API Class ====================

class CommentAPI {
  /**
   * 发表评论
   */
  async add(data: CommentAddDTO): Promise<number> {
    console.log('[CommentAPI] 发表评论', {
      contentId: data.contentId,
      parentId: data.parentId,
      contentLength: data.content.length
    });
    
    try {
      const response = await apiClient.post<number>('/xypai-content/api/v1/comments/app', data);
      
      console.log('[CommentAPI] 发表成功', {
        commentId: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('[CommentAPI] 发表失败', error);
      throw error;
    }
  }

  /**
   * 删除评论
   */
  async delete(commentId: number): Promise<boolean> {
    console.log('[CommentAPI] 删除评论', { commentId });
    
    try {
      await apiClient.delete<void>(`/xypai-content/api/v1/comments/app/${commentId}`);
      
      console.log('[CommentAPI] 删除成功');
      return true;
    } catch (error) {
      console.error('[CommentAPI] 删除失败', error);
      return false;
    }
  }

  /**
   * 获取评论列表
   */
  async getList(params: CommentQueryParams): Promise<CommentVO[]> {
    const { contentId, pageNum = 1, pageSize = 20 } = params;
    
    console.log('[CommentAPI] 获取评论列表', { contentId, pageNum, pageSize });
    
    try {
      const queryParams = buildQueryParams({ pageNum, pageSize });
      const url = `/xypai-content/api/v1/comments/app/content/${contentId}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await apiClient.get<CommentVO[]>(url);
      
      console.log('[CommentAPI] 获取成功', {
        count: response.data?.length || 0
      });
      
      return response.data || [];
    } catch (error) {
      console.error('[CommentAPI] 获取失败', error);
      return [];
    }
  }

  /**
   * 获取评论回复
   */
  async getReplies(parentId: number): Promise<CommentVO[]> {
    console.log('[CommentAPI] 获取评论回复', { parentId });
    
    try {
      const response = await apiClient.get<CommentVO[]>(`/xypai-content/api/v1/comments/app/${parentId}/replies`);
      
      console.log('[CommentAPI] 获取回复成功', {
        count: response.data?.length || 0
      });
      
      return response.data || [];
    } catch (error) {
      console.error('[CommentAPI] 获取回复失败', error);
      return [];
    }
  }

  /**
   * 评论点赞/取消点赞
   */
  async toggleLike(commentId: number): Promise<boolean> {
    console.log('[CommentAPI] 切换点赞状态', { commentId });
    
    try {
      const response = await apiClient.post<boolean>(`/xypai-content/api/v1/comments/app/${commentId}/like`);
      
      console.log('[CommentAPI] 点赞操作成功', {
        liked: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('[CommentAPI] 点赞操作失败', error);
      return false;
    }
  }

  /**
   * 统计评论数
   */
  async count(contentId: number): Promise<number> {
    console.log('[CommentAPI] 统计评论数', { contentId });
    
    try {
      const response = await apiClient.get<number>(`/xypai-content/api/v1/comments/app/count/${contentId}`);
      
      console.log('[CommentAPI] 统计成功', {
        count: response.data
      });
      
      return response.data || 0;
    } catch (error) {
      console.error('[CommentAPI] 统计失败', error);
      return 0;
    }
  }
}

// 导出单例
export const commentApi = new CommentAPI();

// 导出类型
export type { CommentAddDTO, CommentQueryParams, CommentVO };

