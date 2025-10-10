/**
 * 🏠 首页模块统一导出 - 嵌套化主导架构
 */

// 主页面组件（默认导出）
export { default, default as MainPage } from './MainPage';

// 页面父组件（备用）
export { default as HomeScreen } from './HomeScreen';

// 区域组件导出
export { default as FilterTabsArea } from './FilterTabsArea';
export { default as FunctionGridArea } from './FunctionGridArea';
export { default as GameBannerArea } from './GameBannerArea';
export { default as HeaderArea } from './HeaderArea';
export { default as LimitedOffersArea } from './LimitedOffersArea';
export { default as TeamPartyArea } from './TeamPartyArea';
export { default as UserListArea } from './UserListArea';

// 状态管理Hooks导出
export { useHomeData } from './useHomeData';
export { useHomeNavigation } from './useHomeNavigation';
export { useHomeState } from './useHomeState';

// 类型和常量导出
export { COLORS, GRADIENTS, SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';
export type { FunctionItem, LocationInfo, UserCard } from './types';

