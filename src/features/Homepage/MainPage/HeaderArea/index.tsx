/**
 * HeaderArea - 顶部导航区域组件
 * 
 * TOC (快速跳转):
 * [1] Imports
 * [2] Types & Schema  
 * [3] Constants & Config
 * [4] Utils & Helpers
 * [5] State Management
 * [6] Domain Logic
 * [7] UI Components & Rendering
 * [8] Exports
 */

// #region 1. Imports
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 内部模块导入
import { COLORS } from '../constants';
import type { LocationInfo } from '../types';
// #endregion

// #region 2. Types & Schema
interface HeaderAreaProps {
  location: LocationInfo;
  onLocationPress: () => void;
  onSearch: (query: string) => void;
  onSearchPress?: () => void;
}
// #endregion

// #region 3. Constants & Config
// 组件特定常量
// #endregion

// #region 4. Utils & Helpers
// 本地工具函数
// #endregion

// #region 5. State Management
// 状态管理逻辑
// #endregion

// #region 6. Domain Logic
// 业务逻辑处理
// #endregion

// #region 7. UI Components & Rendering
/**
 * HeaderArea 组件 - 顶部导航区域
 * 包含位置显示和搜索功能
 */
const HeaderArea: React.FC<HeaderAreaProps> = ({ 
  location, 
  onLocationPress, 
  onSearch, 
  onSearchPress 
}) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      { paddingTop: safeAreaInsets.top }
    ]}>
      <View style={styles.contentRow}>
        {/* 左侧位置显示（2份）*/}
        <View style={styles.locationContainer}>
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={onLocationPress}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={16} color={COLORS.white} />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {location.city}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 右侧搜索框（8份）*/}
        <View style={styles.searchWrapper}>
          <TouchableOpacity 
            style={styles.searchContainer}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={14} color="#999999" />
            <Text style={styles.searchPlaceholder}>
              搜索词
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 左侧位置容器（自适应宽度）
  locationContainer: {
    flexShrink: 0,                                // 不收缩
    marginRight: 12,
    minWidth: 50,                                 // 最小宽度
    maxWidth: 120,                                // 最大宽度（响应式）
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,                                   // 容器高度
    gap: 2,                                       // 紧凑间距
  },
  locationIconContainer: {
    width: 18,                                    // 图标容器
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    color: COLORS.white,
    fontSize: 14,                                 // 字体放大到14px
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0,
    flex: 1,
    marginLeft: 3,
  },
  // 右侧搜索框容器（占用剩余空间）
  searchWrapper: {
    flex: 1,                                      // 占用剩余所有空间
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',  // 半透明白色背景
    borderRadius: 16,                               // 圆角缩小
    borderWidth: 1,                                 // 1px边框
    borderColor: '#FFFFFF',                         // 白色边框
    paddingHorizontal: 10,                          // 内边距缩小
    height: 28,                                     // 高度缩小到28px
    gap: 6,
  },
  searchPlaceholder: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',             // 半透明白色文字
    fontSize: 12,                                   // 字体缩小到12px
  },
});
// #endregion

// #region 9. Exports
export default HeaderArea;
export type { HeaderAreaProps };
// #endregion
