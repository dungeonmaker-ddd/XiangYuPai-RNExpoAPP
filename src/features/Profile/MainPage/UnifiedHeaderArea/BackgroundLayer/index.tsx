/**
 * BackgroundLayer - 背景层组件
 * 
 * 功能：
 * - 显示背景图片或默认渐变色
 * - 底部渐变遮罩确保文字可读性
 */

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { BACKGROUND_HEIGHT, COLORS } from '../constants';
import type { BackgroundLayerProps } from '../types';

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ backgroundImage }) => {
  const renderContent = () => (
    <>
      {/* 底部渐变遮罩 */}
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_MID, COLORS.GRADIENT_END]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
    </>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.background}
        resizeMode="cover"
      >
        {renderContent()}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.background, styles.defaultBackground]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BACKGROUND_HEIGHT,
  },
  defaultBackground: {
    backgroundColor: COLORS.DEFAULT_BACKGROUND,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
  },
});

export default BackgroundLayer;

