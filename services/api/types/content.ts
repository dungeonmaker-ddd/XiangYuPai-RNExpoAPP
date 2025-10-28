/**
 * 内容服务类型定义
 * 
 * 对应后端：ContentListVO、ContentDetailVO
 */

// ==================== 内容列表 VO ====================

/**
 * 内容列表项（后端 ContentListVO）
 * 
 * 注：此类型用于发现页面的动态流列表
 */
/**
 * 作者信息
 */
export interface AuthorVO {
  userId: string;
  username?: string;
  nickname: string;
  avatar?: string;
}

export interface ContentListVO {
  // 内容基本信息
  id: string;
  userId: string;
  type: number;              // 内容类型: 1=动态, 2=服务, 3=活动
  typeDesc?: string;         // 类型描述
  title?: string;            // 标题
  summary?: string;          // 摘要
  coverImage?: string;       // 封面图
  
  // 作者信息（嵌套对象 - 后端规范）
  author?: AuthorVO;         // 作者信息对象
  
  // 用户冗余信息（扁平字段 - 兼容旧代码）
  userNickname?: string;     // 用户昵称（兼容）
  userAvatar?: string;       // 用户头像（兼容）
  
  // 地理位置（v7.1新增）
  locationName?: string;     // 位置名称
  locationAddress?: string;  // 详细地址
  longitude?: number;        // 经度
  latitude?: number;         // 纬度
  distance?: number;         // 距离（km）
  cityId?: number;           // 城市ID
  
  // 统计数据
  viewCount: number;         // 浏览数
  likeCount: number;         // 点赞数
  collectCount: number;      // 收藏数
  commentCount: number;      // 评论数
  shareCount: number;        // 分享数
  
  // 用户互动状态（后端字段名）
  liked?: boolean;           // 是否点赞（后端字段）
  collected?: boolean;       // 是否收藏（后端字段）
  
  // 用户互动状态（兼容旧字段名）
  isLiked?: boolean;         // 是否点赞（兼容）
  isCollected?: boolean;     // 是否收藏（兼容）
  
  // 时间
  createdAt: string;         // 创建时间
  updatedAt?: string;        // 更新时间
}

// ==================== 内容详情 VO ====================

/**
 * 内容详情（后端 ContentDetailVO）
 */
export interface ContentDetailVO extends ContentListVO {
  // 完整内容
  content: string;           // 正文内容
  
  // 扩展信息
  tags?: string[];           // 标签列表
  topicIds?: number[];       // 话题ID列表
  mediaIds?: number[];       // 媒体ID列表
  
  // 状态信息
  status: number;            // 状态: 0=草稿, 1=已发布, 2=已下架
  auditStatus?: number;      // 审核状态
  publishTime?: string;      // 发布时间
  
  // SEO相关
  keywords?: string;         // 关键词
  description?: string;      // 描述
}

// ==================== 类型别名（兼容性） ====================

/**
 * FeedListItem - 发现页面动态流项
 * 
 * 注：这是前端的命名习惯，实际对应后端的 ContentListVO
 */
export type FeedListItem = ContentListVO;

/**
 * FeedDetail - 发现页面动态详情
 * 
 * 注：这是前端的命名习惯，实际对应后端的 ContentDetailVO
 */
export type FeedDetail = ContentDetailVO;

// ==================== 请求参数类型 ====================

/**
 * 内容查询参数
 */
export interface ContentQueryParams {
  type?: number;             // 内容类型
  status?: number;           // 状态
  keyword?: string;          // 关键词
  userId?: string;           // 用户ID
  pageNum?: number;          // 页码
  pageSize?: number;         // 每页数量
}

/**
 * 附近内容查询参数
 */
export interface NearbyContentParams {
  longitude: number;         // 经度
  latitude: number;          // 纬度
  radius?: number;           // 半径（米）
  type?: number;             // 内容类型
  limit?: number;            // 限制数量
}

/**
 * 城市内容查询参数
 */
export interface CityContentParams {
  cityId: number;            // 城市ID
  type?: number;             // 内容类型
  limit?: number;            // 限制数量
}

// ==================== 响应类型 ====================

/**
 * 内容列表响应
 */
export interface ContentListResponse {
  list: ContentListVO[];
  total?: number;
  pageNum?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/**
 * 内容详情响应
 */
export interface ContentDetailResponse {
  content: ContentDetailVO;
}

