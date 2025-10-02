/**
 * LoginMainPage 样式定义文件
 * 
 * 定义登录主页面相关的所有样式、主题和响应式配置
 */

import { Dimensions, Platform, StyleSheet } from 'react-native';
import { AUTH_COLORS, UI_SIZES } from './constants';

// #region 屏幕尺寸和响应式配置

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * 响应式工具函数
 */
export const responsive = {
  // 基于屏幕宽度的缩放
  scale: (size: number, baseWidth = 375) => (SCREEN_WIDTH / baseWidth) * size,
  
  // 字体大小缩放
  fontSize: (size: number) => {
    if (SCREEN_WIDTH < 350) return size - 2; // 小屏幕
    if (SCREEN_WIDTH > 414) return size + 1;  // 大屏幕
    return size; // 标准屏幕
  },
  
  // 宽度百分比
  width: {
    percent: (percent: number) => (SCREEN_WIDTH * percent) / 100,
  },
  
  // 高度百分比
  height: {
    percent: (percent: number) => (SCREEN_HEIGHT * percent) / 100,
  },
};

/**
 * 媒体查询工具
 */
export const mediaQuery = {
  isSmallScreen: SCREEN_WIDTH < 350,
  isMediumScreen: SCREEN_WIDTH >= 350 && SCREEN_WIDTH < 414,
  isLargeScreen: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
};

/**
 * 安全区域工具
 */
export const safeArea = {
  top: () => Platform.OS === 'ios' ? 44 : 0,
  bottom: () => Platform.OS === 'ios' ? 34 : 0,
};

// #endregion

// #region 主题样式定义

/**
 * 文本样式
 */
export const textStyles = StyleSheet.create({
  // 标题文本
  title: {
    fontSize: responsive.fontSize(28),
    fontWeight: '700',
    color: AUTH_COLORS.TEXT_PRIMARY,
    lineHeight: responsive.fontSize(34),
    letterSpacing: -0.5,
  },
  
  // 副标题文本
  subtitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_SECONDARY,
    lineHeight: responsive.fontSize(24),
  },
  
  // 正文文本
  body: {
    fontSize: responsive.fontSize(14),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_PRIMARY,
    lineHeight: responsive.fontSize(20),
  },
  
  // 辅助文本
  caption: {
    fontSize: responsive.fontSize(12),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_SECONDARY,
    lineHeight: responsive.fontSize(16),
  },
  
  // 链接文本
  link: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: AUTH_COLORS.TEXT_LINK,
    lineHeight: responsive.fontSize(20),
  },
  
  // 错误文本
  error: {
    fontSize: responsive.fontSize(12),
    fontWeight: '400',
    color: AUTH_COLORS.ERROR,
    lineHeight: responsive.fontSize(16),
  },
  
  // 成功文本
  success: {
    fontSize: responsive.fontSize(12),
    fontWeight: '400',
    color: AUTH_COLORS.SUCCESS,
    lineHeight: responsive.fontSize(16),
  },
});

/**
 * 按钮样式
 */
export const buttonStyles = StyleSheet.create({
  // 主按钮容器
  primaryContainer: {
    height: UI_SIZES.BUTTON_HEIGHT,
    borderRadius: UI_SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AUTH_COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // 主按钮文本
  primaryText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: AUTH_COLORS.WHITE,
    letterSpacing: 0.3,
  },
  
  // 辅助按钮容器
  secondaryContainer: {
    height: UI_SIZES.BUTTON_HEIGHT,
    borderRadius: UI_SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AUTH_COLORS.BORDER,
  },
  
  // 辅助按钮文本
  secondaryText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '500',
    color: AUTH_COLORS.TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  
  // 文本按钮
  textButton: {
    paddingVertical: UI_SIZES.SPACING.SM,
    paddingHorizontal: UI_SIZES.SPACING.MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 文本按钮文字
  textButtonText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: AUTH_COLORS.TEXT_LINK,
  },
  
  // 禁用状态
  disabled: {
    opacity: 0.5,
  },
  
  // 加载状态
  loading: {
    opacity: 0.8,
  },
});

/**
 * 输入框样式
 */
export const inputStyles = StyleSheet.create({
  // 输入框容器
  container: {
    marginBottom: UI_SIZES.SPACING.MD,
  },
  
  // 标签样式
  label: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: AUTH_COLORS.TEXT_PRIMARY,
    marginBottom: UI_SIZES.SPACING.XS,
  },
  
  // 输入框包装器
  wrapper: {
    height: UI_SIZES.INPUT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AUTH_COLORS.WHITE,
    borderWidth: 1,
    borderColor: AUTH_COLORS.BORDER,
    borderRadius: UI_SIZES.BORDER_RADIUS,
    paddingHorizontal: UI_SIZES.SPACING.MD,
  },
  
  // 聚焦状态
  focused: {
    borderColor: AUTH_COLORS.BORDER_FOCUS,
    shadowColor: AUTH_COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // 错误状态
  error: {
    borderColor: AUTH_COLORS.BORDER_ERROR,
  },
  
  // 输入框
  input: {
    flex: 1,
    fontSize: responsive.fontSize(16),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_PRIMARY,
    paddingVertical: 0, // 移除默认padding
  },
  
  // 前缀/后缀容器
  prefix: {
    marginRight: UI_SIZES.SPACING.SM,
  },
  suffix: {
    marginLeft: UI_SIZES.SPACING.SM,
  },
  
  // 错误信息
  errorText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '400',
    color: AUTH_COLORS.ERROR,
    marginTop: UI_SIZES.SPACING.XS,
  },
  
  // 帮助文本
  helpText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_SECONDARY,
    marginTop: UI_SIZES.SPACING.XS,
  },
});

/**
 * 卡片样式
 */
export const cardStyles = StyleSheet.create({
  // 基础卡片
  container: {
    backgroundColor: AUTH_COLORS.WHITE,
    borderRadius: UI_SIZES.BORDER_RADIUS * 2,
    padding: UI_SIZES.SPACING.LG,
    shadowColor: AUTH_COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // 紧凑卡片
  compact: {
    padding: UI_SIZES.SPACING.MD,
  },
  
  // 突出卡片
  elevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

/**
 * 布局样式
 */
export const layoutStyles = StyleSheet.create({
  // 容器
  container: {
    flex: 1,
    backgroundColor: AUTH_COLORS.BACKGROUND,
  },
  
  // 安全区域
  safeArea: {
    flex: 1,
    backgroundColor: AUTH_COLORS.BACKGROUND,
  },
  
  // 内容区域
  content: {
    flex: 1,
    paddingHorizontal: UI_SIZES.SPACING.LG,
  },
  
  // 居中容器
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 行布局
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // 列布局
  column: {
    flexDirection: 'column',
  },
  
  // 间距
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  
  // 对齐
  alignStart: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
});

// #endregion

// #region 组件特定样式

/**
 * Logo样式
 */
export const logoStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: UI_SIZES.SPACING.XL,
  },
  
  image: {
    width: UI_SIZES.LOGO_SIZE,
    height: UI_SIZES.LOGO_SIZE,
    marginBottom: UI_SIZES.SPACING.MD,
  },
  
  text: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: AUTH_COLORS.PRIMARY,
    letterSpacing: -0.5,
  },
});

/**
 * 分隔符样式
 */
export const separatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: UI_SIZES.SPACING.LG,
  },
  
  line: {
    flex: 1,
    height: 1,
    backgroundColor: AUTH_COLORS.BORDER,
  },
  
  text: {
    fontSize: responsive.fontSize(14),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_SECONDARY,
    marginHorizontal: UI_SIZES.SPACING.MD,
  },
});

/**
 * 复选框样式
 */
export const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: UI_SIZES.SPACING.MD,
  },
  
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: AUTH_COLORS.BORDER,
    marginRight: UI_SIZES.SPACING.SM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  checked: {
    backgroundColor: AUTH_COLORS.PRIMARY,
    borderColor: AUTH_COLORS.PRIMARY,
  },
  
  checkmark: {
    color: AUTH_COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  label: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    fontWeight: '400',
    color: AUTH_COLORS.TEXT_SECONDARY,
    lineHeight: responsive.fontSize(20),
  },
});

/**
 * 倒计时样式
 */
export const countdownStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  
  text: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: AUTH_COLORS.TEXT_SECONDARY,
  },
  
  active: {
    color: AUTH_COLORS.PRIMARY,
  },
});

// #endregion

// #region 动画样式

/**
 * 动画相关样式
 */
export const animationStyles = StyleSheet.create({
  fadeIn: {
    opacity: 0,
  },
  
  fadeInActive: {
    opacity: 1,
  },
  
  slideUp: {
    transform: [{ translateY: 20 }],
  },
  
  slideUpActive: {
    transform: [{ translateY: 0 }],
  },
  
  scale: {
    transform: [{ scale: 0.95 }],
  },
  
  scaleActive: {
    transform: [{ scale: 1 }],
  },
});

// #endregion

// #region 响应式样式

/**
 * 响应式样式集合
 */
export const responsiveStyles = StyleSheet.create({
  // 小屏幕样式
  ...(mediaQuery.isSmallScreen && {
    smallScreenContainer: {
      paddingHorizontal: UI_SIZES.SPACING.MD,
    },
    smallScreenTitle: {
      fontSize: responsive.fontSize(24),
    },
  }),
  
  // 大屏幕样式
  ...(mediaQuery.isLargeScreen && {
    largeScreenContainer: {
      paddingHorizontal: UI_SIZES.SPACING.XXL,
    },
    largeScreenTitle: {
      fontSize: responsive.fontSize(32),
    },
  }),
  
  // 平板样式
  ...(mediaQuery.isTablet && {
    tabletContainer: {
      maxWidth: 480,
      alignSelf: 'center',
    },
  }),
});

// #endregion

// #region 导出合并样式

/**
 * 主样式导出
 */
export const styles = StyleSheet.create({
  // 合并所有样式
  ...layoutStyles,
  ...textStyles,
  ...buttonStyles,
  ...inputStyles,
  ...cardStyles,
  ...logoStyles,
  ...separatorStyles,
  ...checkboxStyles,
  ...countdownStyles,
  ...animationStyles,
  ...responsiveStyles,
});

/**
 * 样式工具函数
 */
export const styleUtils = {
  // 合并样式
  combine: (...styles: any[]) => StyleSheet.flatten(styles),
  
  // 条件样式
  conditional: (condition: boolean, trueStyle: any, falseStyle?: any) =>
    condition ? trueStyle : falseStyle || {},
  
  // 响应式样式
  responsive: (smallStyle: any, mediumStyle?: any, largeStyle?: any) => {
    if (mediaQuery.isSmallScreen) return smallStyle;
    if (mediaQuery.isLargeScreen) return largeStyle || mediumStyle || smallStyle;
    return mediumStyle || smallStyle;
  },
  
  // 平台样式
  platform: (iosStyle: any, androidStyle?: any) =>
    Platform.OS === 'ios' ? iosStyle : androidStyle || iosStyle,
};

// #endregion

// #region 颜色工具

/**
 * 颜色工具函数
 */
export const colorUtils = {
  // 添加透明度
  alpha: (color: string, alpha: number) => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  },
  
  // 获取对比色
  contrast: (color: string) => {
    // 简单的对比色计算，实际可以更复杂
    const lightColors = [AUTH_COLORS.WHITE, AUTH_COLORS.GRAY_50, AUTH_COLORS.GRAY_100];
    return lightColors.includes(color) ? AUTH_COLORS.TEXT_PRIMARY : AUTH_COLORS.WHITE;
  },
};

// #endregion
