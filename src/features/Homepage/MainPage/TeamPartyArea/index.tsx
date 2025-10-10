/**
 * TeamPartyArea - 组队聚会区域组件
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
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 内部模块导入
import { COLORS } from '../constants';
// #endregion

// #region 2. Types & Schema
interface TeamPartyAreaProps {
  onPress: () => void;
  onMorePress: () => void;
}
// #endregion

// #region 3. Constants & Config
const BANNER_CONFIG = {
  aspectRatio: 702 / 230, // 3.05 - 基于设计稿尺寸
  borderRadius: 16, // 四个角都是16px圆角
} as const;

// 字幕图片配置
const SUBTITLE_CONFIG = {
  width: 380,
  height: 90,
  left: 161,
  top: 75 - (230 * 0.3), // 原位置向上移动30% (75 - 69 = 6)
  aspectRatio: 380 / 90, // 4.22
} as const;

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
 * TeamPartyArea 组件 - 组队聚会区域
 * 展示组局中心的大图入口
 */
const TeamPartyArea: React.FC<TeamPartyAreaProps> = ({ onPress, onMorePress }) => {
  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.headerRow}>
        <Text style={styles.mainTitle}>组队聚会</Text>
        <TouchableOpacity onPress={onMorePress}>
          <Text style={styles.moreText}>查看更多 {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 组局中心大图 */}
      <TouchableOpacity
        style={styles.bannerContainer}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.bannerWrapper}>
          {/* 背景图片 */}
          <ImageBackground
            source={require('../../../../../assets/images/images/home/team-party/组局中心.png')}
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            {/* 渐变遮罩层 */}
            <View style={styles.gradientOverlay} />
            
            {/* 字幕图片 */}
            <Image
              source={require('../../../../../assets/images/images/home/team-party/组局中心字幕.png')}
              style={styles.subtitleImage}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
};
// #endregion

// #region 8. Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  moreText: {
    color: COLORS.gray500,
    fontSize: 14,
  },
  bannerContainer: {
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: BANNER_CONFIG.borderRadius, // 四个角都是16px圆角
  },
  bannerWrapper: {
    width: '100%',
    aspectRatio: BANNER_CONFIG.aspectRatio,
    overflow: 'hidden',
    borderRadius: BANNER_CONFIG.borderRadius, // 四个角都是16px圆角
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: BANNER_CONFIG.borderRadius, // 四个角都是16px圆角
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // 轻微的黑色遮罩代替渐变
  },
  subtitleImage: {
    position: 'absolute',
    left: '23%', // 161/702 ≈ 23%
    top: '-15%',   // 6/230 ≈ 3% (向上移动30%: 33% - 30% = 3%)
    width: '54%', // 380/702 ≈ 54%
    aspectRatio: SUBTITLE_CONFIG.aspectRatio,
  },
});
// #endregion

// #region 9. Exports
export default TeamPartyArea;
export type { TeamPartyAreaProps };
// #endregion
