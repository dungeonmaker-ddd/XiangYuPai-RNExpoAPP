/**
 * 响应式布局工具
 * 提供屏幕尺寸检测和响应式样式工具
 */

import React from 'react';
import { Dimensions, PixelRatio, Platform } from 'react-native';

// 获取屏幕信息
const getScreenInfo = () => {
  const { width, height } = Dimensions.get('window');
  const screenData = Dimensions.get('screen');
  
  return {
    window: { width, height },
    screen: screenData,
    pixelRatio: PixelRatio.get(),
    fontScale: PixelRatio.getFontScale(),
    platform: Platform.OS,
  };
};

// 屏幕尺寸类别
export enum ScreenSize {
  SMALL = 'small',    // < 576px
  MEDIUM = 'medium',  // 576px - 768px
  LARGE = 'large',    // 768px - 992px
  XLARGE = 'xlarge',  // >= 992px
}

// 设备类型
export enum DeviceType {
  PHONE = 'phone',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
}

// 屏幕方向
export enum Orientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

/**
 * 获取屏幕尺寸类别
 */
export const getScreenSize = (width?: number): ScreenSize => {
  const screenWidth = width || Dimensions.get('window').width;
  
  if (screenWidth < 576) return ScreenSize.SMALL;
  if (screenWidth < 768) return ScreenSize.MEDIUM;
  if (screenWidth < 992) return ScreenSize.LARGE;
  return ScreenSize.XLARGE;
};

/**
 * 获取设备类型
 */
export const getDeviceType = (): DeviceType => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 768;
  
  if (Platform.OS === 'web') {
    return width >= 992 ? DeviceType.DESKTOP : DeviceType.TABLET;
  }
  
  return isTablet ? DeviceType.TABLET : DeviceType.PHONE;
};

/**
 * 获取屏幕方向
 */
export const getOrientation = (): Orientation => {
  const { width, height } = Dimensions.get('window');
  return width > height ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
};

/**
 * 检查是否为小屏设备
 */
export const isSmallScreen = (): boolean => {
  return getScreenSize() === ScreenSize.SMALL;
};

/**
 * 检查是否为平板设备
 */
export const isTablet = (): boolean => {
  return getDeviceType() === DeviceType.TABLET;
};

/**
 * 检查是否为横屏
 */
export const isLandscape = (): boolean => {
  return getOrientation() === Orientation.LANDSCAPE;
};

/**
 * 响应式数值计算
 */
export const responsive = {
  /**
   * 基于屏幕宽度的缩放
   */
  scale: (size: number, baseWidth: number = 375): number => {
    const { width } = Dimensions.get('window');
    return (width / baseWidth) * size;
  },
  
  /**
   * 响应式字体大小
   */
  fontSize: (size: number): number => {
    const fontScale = PixelRatio.getFontScale ? PixelRatio.getFontScale() : 1;
    const scaledSize = size * fontScale;
    
    // 限制最小和最大字体大小
    const minSize = size * 0.8;
    const maxSize = size * 1.3;
    
    return Math.max(minSize, Math.min(maxSize, scaledSize));
  },
  
  /**
   * 响应式间距
   */
  spacing: (base: number): number => {
    const screenSize = getScreenSize();
    
    switch (screenSize) {
      case ScreenSize.SMALL:
        return base * 0.8;
      case ScreenSize.MEDIUM:
        return base;
      case ScreenSize.LARGE:
        return base * 1.2;
      case ScreenSize.XLARGE:
        return base * 1.4;
      default:
        return base;
    }
  },
  
  /**
   * 响应式宽度
   */
  width: {
    quarter: (): number => Dimensions.get('window').width * 0.25,
    third: (): number => Dimensions.get('window').width * 0.33,
    half: (): number => Dimensions.get('window').width * 0.5,
    twoThirds: (): number => Dimensions.get('window').width * 0.67,
    threeQuarters: (): number => Dimensions.get('window').width * 0.75,
    full: (): number => Dimensions.get('window').width,
    
    // 自定义百分比
    percent: (percentage: number): number => Dimensions.get('window').width * (percentage / 100),
    
    // 基于列数计算宽度
    columns: (columns: number, totalColumns: number = 12, gutter: number = 16): number => {
      const { width } = Dimensions.get('window');
      const totalGutter = gutter * (totalColumns - 1);
      const availableWidth = width - totalGutter;
      return (availableWidth / totalColumns) * columns;
    },
  },
  
  /**
   * 响应式高度
   */
  height: {
    quarter: (): number => Dimensions.get('window').height * 0.25,
    third: (): number => Dimensions.get('window').height * 0.33,
    half: (): number => Dimensions.get('window').height * 0.5,
    twoThirds: (): number => Dimensions.get('window').height * 0.67,
    threeQuarters: (): number => Dimensions.get('window').height * 0.75,
    full: (): number => Dimensions.get('window').height,
    
    // 自定义百分比
    percent: (percentage: number): number => Dimensions.get('window').height * (percentage / 100),
  },
};

/**
 * 媒体查询工具
 */
export const mediaQuery = {
  /**
   * 小屏幕样式
   */
  small: (styles: any) => {
    return getScreenSize() === ScreenSize.SMALL ? styles : {};
  },
  
  /**
   * 中屏幕样式
   */
  medium: (styles: any) => {
    const size = getScreenSize();
    return size === ScreenSize.MEDIUM || size === ScreenSize.LARGE ? styles : {};
  },
  
  /**
   * 大屏幕样式
   */
  large: (styles: any) => {
    const size = getScreenSize();
    return size === ScreenSize.LARGE || size === ScreenSize.XLARGE ? styles : {};
  },
  
  /**
   * 平板样式
   */
  tablet: (styles: any) => {
    return isTablet() ? styles : {};
  },
  
  /**
   * 横屏样式
   */
  landscape: (styles: any) => {
    return isLandscape() ? styles : {};
  },
  
  /**
   * 竖屏样式
   */
  portrait: (styles: any) => {
    return !isLandscape() ? styles : {};
  },
  
  /**
   * iOS样式
   */
  ios: (styles: any) => {
    return Platform.OS === 'ios' ? styles : {};
  },
  
  /**
   * Android样式
   */
  android: (styles: any) => {
    return Platform.OS === 'android' ? styles : {};
  },
};

/**
 * 响应式Hook
 */
export const useResponsive = () => {
  const [screenInfo, setScreenInfo] = React.useState(getScreenInfo);
  
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setScreenInfo({
        window,
        screen,
        pixelRatio: PixelRatio.get(),
        fontScale: PixelRatio.getFontScale ? PixelRatio.getFontScale() : 1,
        platform: Platform.OS,
      });
    });
    
    return () => subscription?.remove();
  }, []);
  
  return {
    ...screenInfo,
    screenSize: getScreenSize(screenInfo.window.width),
    deviceType: getDeviceType(),
    orientation: getOrientation(),
    isSmallScreen: getScreenSize(screenInfo.window.width) === ScreenSize.SMALL,
    isTablet: getDeviceType() === DeviceType.TABLET,
    isLandscape: screenInfo.window.width > screenInfo.window.height,
  };
};

/**
 * 屏幕安全区域工具
 */
export const safeArea = {
  /**
   * 获取顶部安全区域高度
   */
  top: (): number => {
    if (Platform.OS === 'ios') {
      const { height } = Dimensions.get('window');
      // iPhone X系列及以上
      return height >= 812 ? 44 : 20;
    }
    return 0;
  },
  
  /**
   * 获取底部安全区域高度
   */
  bottom: (): number => {
    if (Platform.OS === 'ios') {
      const { height } = Dimensions.get('window');
      // iPhone X系列及以上
      return height >= 812 ? 34 : 0;
    }
    return 0;
  },
  
  /**
   * 获取水平安全区域
   */
  horizontal: (): { left: number; right: number } => {
    // 通常水平方向不需要安全区域
    return { left: 0, right: 0 };
  },
};

// 导出所有工具
export {
    getDeviceType,
    getOrientation, getScreenInfo,
    getScreenSize, isLandscape, isSmallScreen,
    isTablet
};

