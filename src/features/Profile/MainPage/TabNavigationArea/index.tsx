// #region 1. File Banner & TOC
/**
 * TabNavigationArea - Tab标签栏
 * 
 * 功能：
 * - 四Tab切换（动态/收藏/点赞/资料）
 * - Tab指示器动画
 * - 吸顶固定效果（滚动时）
 */
// #endregion

// #region 2. Imports
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TABS } from '../../constants';
import { COLORS, SIZES } from '../constants';
import type { TabNavigationAreaProps } from '../types';
// #endregion

// #region 3-5. Types, Constants & Utils
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH / 4;
// #endregion

// #region 6-7. State & Logic
// (简单组件)
// #endregion

// #region 8. UI Components & Rendering
const TabNavigationArea: React.FC<TabNavigationAreaProps> = ({
  activeTab,
  onTabChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    height: SIZES.TAB_HEIGHT,
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    color: '#999999',
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: '#8A2BE2',
    borderRadius: 1.5,
  },
});

export default TabNavigationArea;
// #endregion

