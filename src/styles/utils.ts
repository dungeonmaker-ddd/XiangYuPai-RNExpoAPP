/**
 * 样式工具函数
 * 提供常用的样式计算和生成工具
 */

import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from './theme';

// 样式类型
type StyleObject = Record<string, any>;
type ConditionalStyle = StyleObject | null | undefined | false;

/**
 * 条件样式合并工具
 */
export const conditionalStyle = (...styles: ConditionalStyle[]): StyleObject => {
  return Object.assign({}, ...styles.filter(Boolean));
};

/**
 * 响应式边距工具
 */
export const margin = {
  all: (size: keyof typeof SPACING): ViewStyle => ({ margin: SPACING[size] }),
  top: (size: keyof typeof SPACING): ViewStyle => ({ marginTop: SPACING[size] }),
  bottom: (size: keyof typeof SPACING): ViewStyle => ({ marginBottom: SPACING[size] }),
  left: (size: keyof typeof SPACING): ViewStyle => ({ marginLeft: SPACING[size] }),
  right: (size: keyof typeof SPACING): ViewStyle => ({ marginRight: SPACING[size] }),
  horizontal: (size: keyof typeof SPACING): ViewStyle => ({ 
    marginLeft: SPACING[size], 
    marginRight: SPACING[size] 
  }),
  vertical: (size: keyof typeof SPACING): ViewStyle => ({ 
    marginTop: SPACING[size], 
    marginBottom: SPACING[size] 
  }),
  none: (): ViewStyle => ({ margin: 0 }),
};

/**
 * 响应式内边距工具
 */
export const padding = {
  all: (size: keyof typeof SPACING): ViewStyle => ({ padding: SPACING[size] }),
  top: (size: keyof typeof SPACING): ViewStyle => ({ paddingTop: SPACING[size] }),
  bottom: (size: keyof typeof SPACING): ViewStyle => ({ paddingBottom: SPACING[size] }),
  left: (size: keyof typeof SPACING): ViewStyle => ({ paddingLeft: SPACING[size] }),
  right: (size: keyof typeof SPACING): ViewStyle => ({ paddingRight: SPACING[size] }),
  horizontal: (size: keyof typeof SPACING): ViewStyle => ({ 
    paddingLeft: SPACING[size], 
    paddingRight: SPACING[size] 
  }),
  vertical: (size: keyof typeof SPACING): ViewStyle => ({ 
    paddingTop: SPACING[size], 
    paddingBottom: SPACING[size] 
  }),
  none: (): ViewStyle => ({ padding: 0 }),
};

/**
 * Flexbox布局工具
 */
export const flex = {
  // 基础flex
  flex: (value: number = 1): ViewStyle => ({ flex: value }),
  none: (): ViewStyle => ({ flex: 0 }),
  
  // 方向
  row: (): ViewStyle => ({ flexDirection: 'row' }),
  column: (): ViewStyle => ({ flexDirection: 'column' }),
  rowReverse: (): ViewStyle => ({ flexDirection: 'row-reverse' }),
  columnReverse: (): ViewStyle => ({ flexDirection: 'column-reverse' }),
  
  // 主轴对齐
  justifyStart: (): ViewStyle => ({ justifyContent: 'flex-start' }),
  justifyEnd: (): ViewStyle => ({ justifyContent: 'flex-end' }),
  justifyCenter: (): ViewStyle => ({ justifyContent: 'center' }),
  justifyBetween: (): ViewStyle => ({ justifyContent: 'space-between' }),
  justifyAround: (): ViewStyle => ({ justifyContent: 'space-around' }),
  justifyEvenly: (): ViewStyle => ({ justifyContent: 'space-evenly' }),
  
  // 交叉轴对齐
  alignStart: (): ViewStyle => ({ alignItems: 'flex-start' }),
  alignEnd: (): ViewStyle => ({ alignItems: 'flex-end' }),
  alignCenter: (): ViewStyle => ({ alignItems: 'center' }),
  alignStretch: (): ViewStyle => ({ alignItems: 'stretch' }),
  alignBaseline: (): ViewStyle => ({ alignItems: 'baseline' }),
  
  // 换行
  wrap: (): ViewStyle => ({ flexWrap: 'wrap' }),
  nowrap: (): ViewStyle => ({ flexWrap: 'nowrap' }),
  wrapReverse: (): ViewStyle => ({ flexWrap: 'wrap-reverse' }),
  
  // 常用组合
  center: (): ViewStyle => ({ justifyContent: 'center', alignItems: 'center' }),
  centerRow: (): ViewStyle => ({ 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }),
  spaceBetween: (): ViewStyle => ({ 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  }),
  spaceAround: (): ViewStyle => ({ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  }),
};

/**
 * 定位工具
 */
export const position = {
  relative: (): ViewStyle => ({ position: 'relative' }),
  absolute: (): ViewStyle => ({ position: 'absolute' }),
  
  // 绝对定位的快捷方式
  absoluteFill: (): ViewStyle => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }),
  
  // 定位偏移
  top: (value: number): ViewStyle => ({ top: value }),
  bottom: (value: number): ViewStyle => ({ bottom: value }),
  left: (value: number): ViewStyle => ({ left: value }),
  right: (value: number): ViewStyle => ({ right: value }),
  
  // 居中定位
  centerX: (): ViewStyle => ({ 
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  }),
  centerY: (): ViewStyle => ({ 
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -50 }],
  }),
  center: (): ViewStyle => ({ 
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  }),
};

/**
 * 文本样式工具
 */
export const text = {
  // 字体大小
  xs: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.XS }),
  sm: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.SM }),
  base: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.BASE }),
  md: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.MD }),
  lg: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.LG }),
  xl: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.XL }),
  xxl: (): TextStyle => ({ fontSize: TYPOGRAPHY.FONT_SIZE.XXL }),
  
  // 字重
  light: (): TextStyle => ({ fontWeight: TYPOGRAPHY.FONT_WEIGHT.LIGHT }),
  regular: (): TextStyle => ({ fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR }),
  medium: (): TextStyle => ({ fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM }),
  semibold: (): TextStyle => ({ fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD }),
  bold: (): TextStyle => ({ fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD }),
  
  // 对齐
  left: (): TextStyle => ({ textAlign: 'left' }),
  center: (): TextStyle => ({ textAlign: 'center' }),
  right: (): TextStyle => ({ textAlign: 'right' }),
  justify: (): TextStyle => ({ textAlign: 'justify' }),
  
  // 颜色
  primary: (): TextStyle => ({ color: COLORS.PRIMARY[500] }),
  secondary: (): TextStyle => ({ color: COLORS.SECONDARY[500] }),
  success: (): TextStyle => ({ color: COLORS.SUCCESS[500] }),
  warning: (): TextStyle => ({ color: COLORS.WARNING[500] }),
  error: (): TextStyle => ({ color: COLORS.ERROR[500] }),
  gray: (shade: keyof typeof COLORS.GRAY = 500): TextStyle => ({ 
    color: COLORS.GRAY[shade] 
  }),
  white: (): TextStyle => ({ color: COLORS.WHITE }),
  black: (): TextStyle => ({ color: COLORS.BLACK }),
  
  // 文本装饰
  underline: (): TextStyle => ({ textDecorationLine: 'underline' }),
  lineThrough: (): TextStyle => ({ textDecorationLine: 'line-through' }),
  noDecoration: (): TextStyle => ({ textDecorationLine: 'none' }),
  
  // 行高
  tight: (): TextStyle => ({ lineHeight: undefined }),
  normal: (): TextStyle => ({ lineHeight: undefined }),
  relaxed: (): TextStyle => ({ lineHeight: undefined }),
};

/**
 * 背景样式工具
 */
export const background = {
  // 颜色
  primary: (shade: keyof typeof COLORS.PRIMARY = 500): ViewStyle => ({ 
    backgroundColor: COLORS.PRIMARY[shade] 
  }),
  secondary: (shade: keyof typeof COLORS.SECONDARY = 500): ViewStyle => ({ 
    backgroundColor: COLORS.SECONDARY[shade] 
  }),
  success: (shade: keyof typeof COLORS.SUCCESS = 500): ViewStyle => ({ 
    backgroundColor: COLORS.SUCCESS[shade] 
  }),
  warning: (shade: keyof typeof COLORS.WARNING = 500): ViewStyle => ({ 
    backgroundColor: COLORS.WARNING[shade] 
  }),
  error: (shade: keyof typeof COLORS.ERROR = 500): ViewStyle => ({ 
    backgroundColor: COLORS.ERROR[shade] 
  }),
  gray: (shade: keyof typeof COLORS.GRAY = 500): ViewStyle => ({ 
    backgroundColor: COLORS.GRAY[shade] 
  }),
  white: (): ViewStyle => ({ backgroundColor: COLORS.WHITE }),
  black: (): ViewStyle => ({ backgroundColor: COLORS.BLACK }),
  transparent: (): ViewStyle => ({ backgroundColor: COLORS.TRANSPARENT }),
  
  // 透明度
  opacity: (opacity: number): ViewStyle => ({ opacity }),
};

/**
 * 边框样式工具
 */
export const border = {
  // 边框宽度
  none: (): ViewStyle => ({ borderWidth: 0 }),
  thin: (): ViewStyle => ({ borderWidth: 1 }),
  thick: (): ViewStyle => ({ borderWidth: 2 }),
  
  // 边框颜色
  primary: (): ViewStyle => ({ borderColor: COLORS.PRIMARY[500] }),
  secondary: (): ViewStyle => ({ borderColor: COLORS.SECONDARY[500] }),
  gray: (shade: keyof typeof COLORS.GRAY = 200): ViewStyle => ({ 
    borderColor: COLORS.GRAY[shade] 
  }),
  
  // 圆角
  rounded: (size: keyof typeof BORDER_RADIUS = 'BASE'): ViewStyle => ({ 
    borderRadius: BORDER_RADIUS[size] 
  }),
  roundedTop: (size: keyof typeof BORDER_RADIUS = 'BASE'): ViewStyle => ({ 
    borderTopLeftRadius: BORDER_RADIUS[size],
    borderTopRightRadius: BORDER_RADIUS[size],
  }),
  roundedBottom: (size: keyof typeof BORDER_RADIUS = 'BASE'): ViewStyle => ({ 
    borderBottomLeftRadius: BORDER_RADIUS[size],
    borderBottomRightRadius: BORDER_RADIUS[size],
  }),
  roundedLeft: (size: keyof typeof BORDER_RADIUS = 'BASE'): ViewStyle => ({ 
    borderTopLeftRadius: BORDER_RADIUS[size],
    borderBottomLeftRadius: BORDER_RADIUS[size],
  }),
  roundedRight: (size: keyof typeof BORDER_RADIUS = 'BASE'): ViewStyle => ({ 
    borderTopRightRadius: BORDER_RADIUS[size],
    borderBottomRightRadius: BORDER_RADIUS[size],
  }),
  circle: (): ViewStyle => ({ borderRadius: BORDER_RADIUS.FULL }),
};

/**
 * 阴影样式工具
 */
export const shadow = {
  xs: (): ViewStyle => SHADOWS.XS || {},
  sm: (): ViewStyle => SHADOWS.SM || {},
  base: (): ViewStyle => SHADOWS.BASE || {},
  md: (): ViewStyle => SHADOWS.MD || {},
  lg: (): ViewStyle => SHADOWS.LG || {},
  xl: (): ViewStyle => SHADOWS.XL || {},
  none: (): ViewStyle => Platform.select({
    ios: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: {
      elevation: 0,
    },
  }) || {},
};

/**
 * 快捷样式组合
 */
export const shortcuts = {
  // 容器样式
  container: (): ViewStyle => ({
    flex: 1,
    backgroundColor: COLORS.WHITE,
  }),
  
  containerPadded: (): ViewStyle => ({
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
  }),
  
  containerCentered: (): ViewStyle => ({
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  
  // 卡片样式
  card: (): ViewStyle => ({
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    ...SHADOWS.SM,
  }),
  
  cardElevated: (): ViewStyle => ({
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    ...SHADOWS.MD,
  }),
  
  // 按钮样式
  buttonPrimary: (): ViewStyle => ({
    backgroundColor: COLORS.PRIMARY[500],
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.SM,
  }),
  
  buttonSecondary: (): ViewStyle => ({
    backgroundColor: COLORS.GRAY[100],
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.GRAY[300],
  }),
  
  // 输入框样式
  input: (): ViewStyle => ({
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GRAY[300],
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
  }),
  
  inputFocused: (): ViewStyle => ({
    borderColor: COLORS.PRIMARY[500],
    ...SHADOWS.SM,
  }),
  
  // 分隔线样式
  divider: (): ViewStyle => ({
    height: 1,
    backgroundColor: COLORS.GRAY[200],
  }),
  
  dividerVertical: (): ViewStyle => ({
    width: 1,
    backgroundColor: COLORS.GRAY[200],
  }),
  
  // 覆盖层样式
  overlay: (): ViewStyle => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.ALPHA.BLACK_50,
  }),
  
  overlayLight: (): ViewStyle => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.ALPHA.BLACK_20,
  }),
  
  overlayDark: (): ViewStyle => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.ALPHA.BLACK_70,
  }),
};

/**
 * 文本样式预设
 */
export const textStyles = {
  // 标题样式
  h1: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.DISPLAY_MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.GRAY[900],
    lineHeight: TYPOGRAPHY.FONT_SIZE.DISPLAY_MD * TYPOGRAPHY.LINE_HEIGHT.TIGHT,
  }),
  
  h2: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.DISPLAY_SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.GRAY[900],
    lineHeight: TYPOGRAPHY.FONT_SIZE.DISPLAY_SM * TYPOGRAPHY.LINE_HEIGHT.TIGHT,
  }),
  
  h3: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.XXL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.GRAY[900],
    lineHeight: TYPOGRAPHY.FONT_SIZE.XXL * TYPOGRAPHY.LINE_HEIGHT.TIGHT,
  }),
  
  h4: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.GRAY[900],
    lineHeight: TYPOGRAPHY.FONT_SIZE.XL * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  }),
  
  // 正文样式
  body: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    color: COLORS.GRAY[700],
    lineHeight: TYPOGRAPHY.FONT_SIZE.BASE * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  }),
  
  bodyLarge: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    color: COLORS.GRAY[700],
    lineHeight: TYPOGRAPHY.FONT_SIZE.MD * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  }),
  
  bodySmall: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    color: COLORS.GRAY[600],
    lineHeight: TYPOGRAPHY.FONT_SIZE.SM * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  }),
  
  // 说明文本
  caption: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
    color: COLORS.GRAY[500],
    lineHeight: TYPOGRAPHY.FONT_SIZE.XS * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  }),
  
  // 标签样式
  label: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.GRAY[700],
    lineHeight: TYPOGRAPHY.FONT_SIZE.SM * TYPOGRAPHY.LINE_HEIGHT.NORMAL,
  }),
  
  // 按钮文本
  button: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    lineHeight: TYPOGRAPHY.FONT_SIZE.BASE * TYPOGRAPHY.LINE_HEIGHT.TIGHT,
  }),
  
  // 链接样式
  link: (): TextStyle => ({
    fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.MEDIUM,
    color: COLORS.PRIMARY[500],
    textDecorationLine: 'underline',
  }),
};

/**
 * 样式组合工具
 */
export const combine = (...styles: (StyleProp<ViewStyle> | StyleProp<TextStyle>)[]): any => {
  return styles.filter(Boolean);
};

/**
 * 平台特定样式
 */
export const platformStyle = {
  ios: (styles: StyleObject): StyleObject => Platform.OS === 'ios' ? styles : {},
  android: (styles: StyleObject): StyleObject => Platform.OS === 'android' ? styles : {},
  web: (styles: StyleObject): StyleObject => Platform.OS === 'web' ? styles : {},
};

/**
 * 状态样式工具
 */
export const stateStyles = {
  disabled: (): ViewStyle => ({
    opacity: 0.6,
  }),
  
  loading: (): ViewStyle => ({
    opacity: 0.8,
  }),
  
  pressed: (): ViewStyle => ({
    opacity: 0.9,
  }),
  
  focused: (): ViewStyle => ({
    borderColor: COLORS.PRIMARY[500],
    ...SHADOWS.SM,
  }),
  
  error: (): ViewStyle => ({
    borderColor: COLORS.ERROR[500],
  }),
  
  success: (): ViewStyle => ({
    borderColor: COLORS.SUCCESS[500],
  }),
};

// 导入StyleSheet用于样式创建
import { StyleSheet } from 'react-native';

/**
 * 创建样式的工具函数
 */
export const createStyles = <T extends Record<string, any>>(
  stylesFn: () => T
): T => {
  return StyleSheet.create(stylesFn());
};

/**
 * 主题感知样式创建工具
 */
export const createThemedStyles = <T extends Record<string, any>>(
  stylesFn: (theme: typeof LIGHT_THEME) => T,
  theme: typeof LIGHT_THEME
): T => {
  return StyleSheet.create(stylesFn(theme));
};

// 导出主题
import { LIGHT_THEME } from './theme';
