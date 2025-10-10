/**
 * GameBannerArea - 游戏推广横幅区域组件
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
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
// #endregion

// #region 2. Types & Schema
interface GameBannerAreaProps {
  onPress: () => void;
}
// #endregion

// #region 3. Constants & Config
const BANNER_ASPECT_RATIO = 702 / 246; // 2.85 - 基于设计稿尺寸（容器宽高比）
const BANNER_BORDER_RADIUS = 24;
const IMAGE_ASPECT_RATIO = 702 / 492; // 1.43 - 图片原始宽高比
const IMAGE_HEIGHT = 492; // 图片原始高度
const IMAGE_TOP_OFFSET = -87 + (IMAGE_HEIGHT * 0.08); // 向下移动30%：-87 + 147.6 ≈ 61
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
 * GameBannerArea 组件 - 游戏推广横幅区域
 * 展示游戏推广内容的大图横幅
 */
const GameBannerArea: React.FC<GameBannerAreaProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require('../../../../../assets/images/images/home/banner/assassin-creed-4-poster.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          {/* 可选：添加文案叠加层 */}
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: BANNER_BORDER_RADIUS,
    overflow: 'hidden',
  },
  bannerContainer: {
    width: '100%',
    aspectRatio: BANNER_ASPECT_RATIO,
    overflow: 'hidden',
    borderRadius: BANNER_BORDER_RADIUS,
    backgroundColor: '#D8D8D8', // 背景色（图片加载前显示）
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: IMAGE_TOP_OFFSET, // -87px 向上偏移，裁剪图片顶部
    width: '100%',
    aspectRatio: IMAGE_ASPECT_RATIO, // 保持图片原始比例 702/492
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: BANNER_BORDER_RADIUS,
  },
});
// #endregion

// #region 9. Exports
export default GameBannerArea;
export type { GameBannerAreaProps };
// #endregion
