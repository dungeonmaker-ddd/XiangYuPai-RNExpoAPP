// #region 1. File Banner & TOC
/**
 * Discovery页面组 - 发现页面模块主文件
 * 
 * 职责：
 * - 页面组导航协调
 * - 状态初始化
 * - 子页面统一包装
 * 
 * TOC (快速跳转):
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Types & Schema
 * [4] Constants & Config
 * [5] Utils & Helpers
 * [6] State Management
 * [7] Domain Logic
 * [8] UI Components & Rendering
 * [9] Exports
 */
// #endregion

// #region 2. Imports
import React from 'react';

// 类型和常量
import type { DiscoveryProps } from './types';

// 主页面
import MainPage from './MainPage';
// #endregion

// #region 3. Types & Schema
// (使用types.ts中的DiscoveryProps)
// #endregion

// #region 4. Constants & Config
// (使用constants.ts中的配置)
// #endregion

// #region 5. Utils & Helpers
// (暂无工具函数)
// #endregion

// #region 6. State Management
/**
 * Discovery页面组状态管理
 * 注：主要状态管理在各子页面内部
 */
const useDiscoveryState = (props: DiscoveryProps) => {
  return {
    initialTab: props.initialTab || 'hot',
    userId: props.userId,
  };
};
// #endregion

// #region 7. Domain Logic
/**
 * Discovery页面组业务逻辑
 */
const useDiscoveryLogic = (props: DiscoveryProps) => {
  const state = useDiscoveryState(props);
  
  return {
    ...state,
  };
};
// #endregion

// #region 8. UI Components & Rendering
/**
 * Discovery页面组主组件
 */
const Discovery: React.FC<DiscoveryProps> = (props) => {
  const { initialTab, userId } = useDiscoveryLogic(props);
  
  return (
    <MainPage 
      initialTab={initialTab}
      userId={userId}
    />
  );
};
// #endregion

// #region 9. Exports
export default Discovery;
export type { DiscoveryProps } from './types';

// 导出子页面
export { default as DetailPage } from './DetailPage';
export { default as LocationSelectPage } from './LocationSelectPage';
export { default as MainPage } from './MainPage';
export { default as PublishPage } from './PublishPage';
export { default as ReportPage } from './ReportPage';
export { default as TopicPage } from './TopicPage';
export { default as TopicSelectPage } from './TopicSelectPage';
// #endregion
