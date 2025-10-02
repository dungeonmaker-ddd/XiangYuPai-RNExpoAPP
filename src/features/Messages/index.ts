/**
 * Messages Module - 消息模块主入口
 * 
 * 功能：统一导出所有页面组件和共享组件
 * 架构：基于UNIVERSAL_COMPONENT_ARCHITECTURE_CORE v2.5标准
 * 参考：Homepage模块和AuthModule模块
 */

// 导出主页面
export { default as MainPage } from './MainPage';

// 导出子页面
export { default as ChatPage } from './ChatPage';
export { default as CommentsPage } from './CommentsPage';
export { default as FollowersPage } from './FollowersPage';
export { default as LikesPage } from './LikesPage';
export { default as NotificationsPage } from './NotificationsPage';

// 导出共享组件
export * from './SharedComponents';

// 导出类型定义
export type * from './types';

// 导出常量配置
export * from './constants';

// 导出Store
export * from './stores';

// 导出API
export * from './api';
