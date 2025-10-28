// #region 1. File Banner & TOC
/**
 * BackgroundArea - 背景头图区域
 * 
 * 功能：
 * - 用户背景图展示
 * - 渐变遮罩效果
 * - 返回按钮
 * 
 * TOC: [1-9] Standard sections
 */
// #endregion

// #region 2. Imports
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SIZES } from '../constants';
import type { BackgroundAreaProps } from '../types';
// #endregion

// #region 3-5. Types, Constants & Utils
const DEFAULT_BACKGROUND = require('@/assets/images/icon.png');
// #endregion

// #region 6-7. State & Logic
// (简单组件，无需复杂状态和逻辑)
// #endregion

// #region 8. UI Components & Rendering
const BackgroundArea: React.FC<BackgroundAreaProps> = ({
  imageUrl,
  avatarUrl,
  onBack,
  onEdit,
  showEditButton,
  style,
}) => {
  const backgroundSource = imageUrl 
    ? { uri: imageUrl } 
    : avatarUrl 
      ? { uri: avatarUrl }
      : DEFAULT_BACKGROUND;

  return (
    <View style={[styles.container, style]}>
      {/* 背景图片（使用头像或背景图） */}
      <ImageBackground
        source={backgroundSource}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={20}
      >
        {/* 模糊遮罩层 */}
        <BlurView intensity={30} style={styles.blurOverlay} tint="dark" />
        
        {/* 渐变遮罩 - 从透明到半透明黑色 */}
        <View style={styles.gradientMask} />
        
        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        
        {/* 编辑按钮（仅在本人主页显示） */}
        {showEditButton && onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.editText}>编辑</Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    height: SIZES.BACKGROUND_HEIGHT,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },
  editButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default BackgroundArea;
// #endregion

