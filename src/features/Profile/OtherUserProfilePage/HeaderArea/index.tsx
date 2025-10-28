// #region 1. File Banner & TOC
/**
 * HeaderArea - Top Navigation Area
 * 
 * 顶部导航区域
 * - 返回按钮
 * - 用户昵称
 * - 分享按钮
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

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants';

// #endregion

// #region 3. Component

interface HeaderAreaProps {
  nickname: string;
  onShare?: () => void;
}

const HeaderArea: React.FC<HeaderAreaProps> = ({ nickname, onShare }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      <TouchableOpacity style={styles.button} onPress={handleBack}>
        <Ionicons name="arrow-back" size={SIZES.iconMedium} color={COLORS.gray900} />
      </TouchableOpacity>
      
      <Text style={styles.title} numberOfLines={1}>
        {nickname}
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={onShare}>
        <Ionicons name="share-outline" size={SIZES.iconMedium} color={COLORS.gray900} />
      </TouchableOpacity>
    </View>
  );
};

// #endregion

// #region 4. Styles

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
});

// #endregion

// #region 5. Export

export default HeaderArea;

// #endregion

