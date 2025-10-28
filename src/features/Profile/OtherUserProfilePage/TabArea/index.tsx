// #region 1. File Banner & TOC
/**
 * TabArea - Tab Navigation Area
 * 
 * Tab切换区域
 * - 动态
 * - 资料
 * - 技能
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Imports
 * [3] Component
 * [4] Styles
 * [5] Export
 */
// #endregion

// #region 2. Imports

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, TAB_BAR_HEIGHT, TAB_ITEMS } from '../constants';
import type { TabType } from '../types';

// #endregion

// #region 3. Component

interface TabAreaProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabArea: React.FC<TabAreaProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.key;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// #endregion

// #region 4. Styles

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

// #endregion

// #region 5. Export

export default TabArea;

// #endregion

