/**
 * Styles Index - 统一导出样式设计系统
 */

// 导出主题系统
export {
    ANIMATIONS, BORDER_RADIUS, BREAKPOINTS, COLORS, DARK_THEME, DEFAULT_THEME, LAYOUT,
    LIGHT_THEME, SHADOWS,
    SIZES, SPACING, THEMES, TYPOGRAPHY, Z_INDEX
} from './theme';

export type {
    Theme,
    ThemeColors,
    ThemeMode
} from './theme';

// 导出响应式工具
export {
    DeviceType, getDeviceType,
    getOrientation, getScreenInfo,
    getScreenSize, isLandscape, isSmallScreen,
    isTablet, mediaQuery, Orientation,
    responsive, safeArea, ScreenSize, useResponsive
} from './responsive';

// 导出样式工具
export {
    background,
    border, combine, conditionalStyle, createStyles,
    createThemedStyles, flex, margin,
    padding, platformStyle, position, shadow,
    shortcuts, stateStyles, text, textStyles
} from './utils';

// 常用样式预设
export const COMMON_STYLES = {
  // 安全区域
  safeArea: {
    flex: 1,
    paddingTop: safeArea.top(),
    paddingBottom: safeArea.bottom(),
  },
  
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  
  containerCentered: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
  },
  
  // 内容容器
  contentContainer: {
    flexGrow: 1,
    padding: SPACING.MD,
  },
  
  // 列表容器
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  
  listContentContainer: {
    padding: SPACING.MD,
  },
  
  // 卡片样式
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    ...SHADOWS.SM,
  },
  
  cardElevated: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    ...SHADOWS.MD,
  },
  
  // 分隔线
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY[200],
  },
  
  dividerVertical: {
    width: 1,
    backgroundColor: COLORS.GRAY[200],
  },
  
  // 覆盖层
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.ALPHA.BLACK_50,
  },
  
  // 居中布局
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  centeredRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 空间分布
  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  spaceAround: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  // 文本样式
  headingText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XXL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.GRAY[900],
  },
  
  bodyText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    color: COLORS.GRAY[700],
    lineHeight: TYPOGRAPHY.FONT_SIZE.BASE * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  
  captionText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    color: COLORS.GRAY[500],
    lineHeight: TYPOGRAPHY.FONT_SIZE.SM * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  },
  
  linkText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.PRIMARY[500],
  },
} as const;

// 组件样式预设
export const COMPONENT_STYLES = {
  // 头像样式
  avatar: (size: number) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: COLORS.GRAY[200],
  }),
  
  // 标签样式
  tag: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.PRIMARY[100],
  },
  
  tagText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.PRIMARY[700],
  },
  
  // 徽章样式
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.ERROR[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  badgeText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.WHITE,
  },
  
  // 浮动操作按钮
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.LG,
  },
  
  // 搜索栏样式
  searchBar: {
    backgroundColor: COLORS.GRAY[100],
    borderRadius: BORDER_RADIUS.FULL,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    flexDirection: 'row' as const,
    alignItems: 'center',
  },
  
  // 底部导航样式
  tabBar: {
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY[200],
    paddingTop: SPACING.XS,
    paddingBottom: safeArea.bottom() + SPACING.XS,
    height: 60 + safeArea.bottom(),
  },
  
  // 模态框样式
  modal: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    ...SHADOWS.XL,
  },
  
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.GRAY[300],
    borderRadius: BORDER_RADIUS.FULL,
    alignSelf: 'center' as const,
    marginTop: SPACING.SM,
    marginBottom: SPACING.MD,
  },
} as const;

// 动画预设
export const ANIMATION_PRESETS = {
  // 淡入淡出
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: ANIMATIONS.DURATION.BASE,
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: ANIMATIONS.DURATION.BASE,
  },
  
  // 滑动
  slideInUp: {
    from: { transform: [{ translateY: 100 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: ANIMATIONS.DURATION.SLOW,
  },
  
  slideInDown: {
    from: { transform: [{ translateY: -100 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
    duration: ANIMATIONS.DURATION.SLOW,
  },
  
  slideInLeft: {
    from: { transform: [{ translateX: -100 }], opacity: 0 },
    to: { transform: [{ translateX: 0 }], opacity: 1 },
    duration: ANIMATIONS.DURATION.SLOW,
  },
  
  slideInRight: {
    from: { transform: [{ translateX: 100 }], opacity: 0 },
    to: { transform: [{ translateX: 0 }], opacity: 1 },
    duration: ANIMATIONS.DURATION.SLOW,
  },
  
  // 缩放
  scaleIn: {
    from: { transform: [{ scale: 0.8 }], opacity: 0 },
    to: { transform: [{ scale: 1 }], opacity: 1 },
    duration: ANIMATIONS.DURATION.BASE,
  },
  
  scaleOut: {
    from: { transform: [{ scale: 1 }], opacity: 1 },
    to: { transform: [{ scale: 0.8 }], opacity: 0 },
    duration: ANIMATIONS.DURATION.BASE,
  },
  
  // 弹簧动画
  springIn: {
    from: { transform: [{ scale: 0.3 }], opacity: 0 },
    to: { transform: [{ scale: 1 }], opacity: 1 },
    spring: ANIMATIONS.SPRING.BOUNCY,
  },
} as const;

// 工具函数导入
import { safeArea } from './responsive';
import { ANIMATIONS } from './theme';

