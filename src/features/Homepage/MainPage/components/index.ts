/**
 * MainPage Components Index - 统一导出MainPage区域组件
 */

// 导出区域组件
export { default as EventCenterArea } from './EventCenterArea';
export { default as FeaturedUsersArea } from './FeaturedUsersArea';
export { default as GameBannerArea } from './GameBannerArea';
export { default as ServiceGridArea } from './ServiceGridArea';
export { default as TopFunctionArea } from './TopFunctionArea';
export { default as UserListArea } from './UserListArea';

// 导出组件类型
export type { EventCenterAreaProps } from './EventCenterArea';
export type { FeaturedUsersAreaProps } from './FeaturedUsersArea';
export type { GameBannerAreaProps } from './GameBannerArea';
export type { ServiceGridAreaProps } from './ServiceGridArea';
export type { TopFunctionAreaProps } from './TopFunctionArea';
export type { UserListAreaProps } from './UserListArea';

// 组件配置常量
export const AREA_COMPONENTS = {
  TOP_FUNCTION: 'TopFunctionArea',
  GAME_BANNER: 'GameBannerArea',
  SERVICE_GRID: 'ServiceGridArea',
  FEATURED_USERS: 'FeaturedUsersArea',
  EVENT_CENTER: 'EventCenterArea',
  USER_LIST: 'UserListArea',
} as const;

// 组件显示名称映射
export const AREA_COMPONENT_NAMES = {
  [AREA_COMPONENTS.TOP_FUNCTION]: '顶部功能区域',
  [AREA_COMPONENTS.GAME_BANNER]: '游戏横幅区域',
  [AREA_COMPONENTS.SERVICE_GRID]: '服务网格区域',
  [AREA_COMPONENTS.FEATURED_USERS]: '限时专享区域',
  [AREA_COMPONENTS.EVENT_CENTER]: '组队聚会区域',
  [AREA_COMPONENTS.USER_LIST]: '用户列表区域',
} as const;

// 组件默认配置
export const AREA_COMPONENT_CONFIG = {
  [AREA_COMPONENTS.TOP_FUNCTION]: {
    required: true,
    order: 1,
    defaultProps: {},
  },
  [AREA_COMPONENTS.GAME_BANNER]: {
    required: false,
    order: 2,
    defaultProps: {},
  },
  [AREA_COMPONENTS.SERVICE_GRID]: {
    required: true,
    order: 3,
    defaultProps: {},
  },
  [AREA_COMPONENTS.FEATURED_USERS]: {
    required: false,
    order: 4,
    defaultProps: {},
  },
  [AREA_COMPONENTS.EVENT_CENTER]: {
    required: false,
    order: 5,
    defaultProps: {},
  },
  [AREA_COMPONENTS.USER_LIST]: {
    required: true,
    order: 6,
    defaultProps: {},
  },
} as const;
