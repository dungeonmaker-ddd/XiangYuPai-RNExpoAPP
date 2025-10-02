/**
 * Discovery模块 - 类型定义
 * 
 * 包含：
 * - 页面组Props和状态类型
 * - 动态实体类型
 * - 评论相关类型
 * - API交互类型
 * - 组件Props类型
 */

// ==================== 页面组级别类型 ====================

/**
 * Discovery页面组Props接口
 */
export interface DiscoveryProps {
  initialTab?: TabType;
  userId?: string;
}

/**
 * Discovery页面组状态类型
 */
export interface DiscoveryState {
  activeTab: TabType;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Tab类型
 */
export type TabType = 'follow' | 'hot' | 'local';

// ==================== 动态实体类型 ====================

/**
 * 动态数据类型
 */
export interface Feed {
  id: string;
  userId: string;
  userInfo: UserInfo;
  title?: string;
  content: string;
  mediaList: MediaItem[];
  topicList: Topic[];
  location?: LocationInfo;
  
  // 互动数据
  likeCount: number;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  viewCount: number;
  
  // 用户互动状态
  isLiked: boolean;
  isCollected: boolean;
  
  // 时间戳
  createdAt: number;
  updatedAt: number;
}

/**
 * 用户信息类型
 */
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  gender?: 'male' | 'female';
  age?: number;
  tags?: UserTag[];
  isFollowed: boolean;
}

/**
 * 用户标签类型
 */
export interface UserTag {
  type: 'gender_age' | 'certified' | 'popular' | 'custom';
  label: string;
  color: string;
}

/**
 * 媒体项类型
 */
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  duration?: number; // 视频时长(秒)
}

/**
 * 话题类型
 */
export interface Topic {
  name: string;
  description?: string;
  coverUrl?: string;
  participantCount: number;
  postCount: number;
  hotIndex: number;
  trendChange: number;
  createdAt: number;
}

/**
 * 位置信息类型
 */
export interface LocationInfo {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // 距离用户的距离(米)
}

// ==================== 评论相关类型 ====================

/**
 * 评论数据类型
 */
export interface Comment {
  id: string;
  feedId: string;
  userId: string;
  userInfo: UserInfo;
  content: string;
  replyTo?: string;
  replyToUser?: UserInfo;
  likeCount: number;
  isLiked: boolean;
  replies: Comment[];
  createdAt: number;
}

/**
 * 评论排序类型
 */
export type CommentSortType = 'time' | 'hot' | 'like';

// ==================== API交互类型 ====================

/**
 * API响应基础类型
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  page: number;
  pageSize: number;
}

/**
 * 动态列表响应
 */
export interface FeedListResponse {
  list: Feed[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * 创建动态请求
 */
export interface CreateFeedRequest {
  title?: string;
  content: string;
  mediaIds: string[];
  topicNames: string[];
  locationId?: string;
}

/**
 * 创建评论请求
 */
export interface CreateCommentRequest {
  feedId: string;
  content: string;
  replyTo?: string;
}

/**
 * 举报请求
 */
export interface ReportRequest {
  targetType: 'feed' | 'comment' | 'user';
  targetId: string;
  reasonId: number;
  description?: string;
}

/**
 * 互动操作请求
 */
export interface InteractionRequest {
  targetType: 'feed' | 'comment';
  targetId: string;
  action: 'like' | 'unlike' | 'collect' | 'uncollect';
}

// ==================== 组件Props类型 ====================

/**
 * 动态卡片Props
 */
export interface FeedCardProps {
  feed: Feed;
  onUserClick: (userId: string) => void;
  onTopicClick: (topicName: string) => void;
  onLike: (feedId: string) => void;
  onComment: (feedId: string) => void;
  onShare: (feedId: string) => void;
  onCollect: (feedId: string) => void;
}

/**
 * 评论项Props
 */
export interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onMore: (commentId: string) => void;
}

/**
 * 媒体查看器Props
 */
export interface MediaViewerProps {
  mediaList: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}
