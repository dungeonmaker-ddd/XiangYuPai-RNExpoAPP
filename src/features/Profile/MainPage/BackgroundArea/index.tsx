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
import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SIZES } from '../constants';
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
  onBack,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={imageUrl ? { uri: imageUrl } : DEFAULT_BACKGROUND}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* 渐变遮罩 */}
        <View style={styles.gradientMask} />
        
        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: {
    height: SIZES.BACKGROUND_HEIGHT,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradientMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: COLORS.MASK,
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SEMI_TRANSPARENT_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.TEXT_WHITE,
    fontWeight: '600',
  },
});

export default BackgroundArea;
// #endregion

