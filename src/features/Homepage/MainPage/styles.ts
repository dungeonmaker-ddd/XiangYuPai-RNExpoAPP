/**
 * MainPage 样式定义
 */

import { Platform, StatusBar, StyleSheet } from 'react-native';
import { MAIN_PAGE_CONSTANTS } from './constants';

const { COLORS, SIZES } = MAIN_PAGE_CONSTANTS;

export const styles = StyleSheet.create({
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  contentContainer: {
    paddingBottom: 100, // 底部导航空间
    flexGrow: 1,
  },

  // 错误状态样式
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: SIZES.PADDING_HORIZONTAL,
  },

  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 16,
  },

  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.BORDER_RADIUS,
  },

  errorButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 16,
    fontWeight: '600',
  },

  // 加载状态样式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },

  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
  },

  // 区域间距样式
  sectionSpacing: {
    marginBottom: SIZES.SECTION_SPACING,
  },

  // 区域分隔样式
  sectionDivider: {
    height: 8,
    backgroundColor: COLORS.SURFACE,
  },

  // 刷新控件样式
  refreshControl: {
    tintColor: COLORS.PRIMARY,
  },

  // 安全区域样式
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: Platform.OS === 'ios' ? SIZES.STATUS_BAR_HEIGHT : StatusBar.currentHeight || 0,
  },

  // 头部样式
  header: {
    height: SIZES.HEADER_HEIGHT,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.PADDING_HORIZONTAL,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
    textAlign: 'center',
    flex: 1,
  },

  // 通用按钮样式
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },

  secondaryButton: {
    backgroundColor: COLORS.SURFACE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  primaryButtonText: {
    color: COLORS.BACKGROUND,
  },

  secondaryButtonText: {
    color: COLORS.TEXT,
  },

  // 卡片样式
  card: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.PADDING_HORIZONTAL,
    marginBottom: SIZES.MARGIN_BOTTOM,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // 文本样式
  headingText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
    lineHeight: 32,
  },

  bodyText: {
    fontSize: 16,
    color: COLORS.TEXT,
    lineHeight: 24,
  },

  captionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },

  // 列表样式
  list: {
    flexGrow: 1,
  },

  listItem: {
    paddingVertical: 12,
    paddingHorizontal: SIZES.PADDING_HORIZONTAL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },

  lastListItem: {
    borderBottomWidth: 0,
  },

  // 空状态样式
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 12,
  },

  // 分隔线样式
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER,
  },

  // 浮动操作按钮样式
  fab: {
    position: 'absolute',
    bottom: 100, // 避免遮挡Tab栏
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  fabIcon: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.BACKGROUND,
    lineHeight: 24,
  },
});
