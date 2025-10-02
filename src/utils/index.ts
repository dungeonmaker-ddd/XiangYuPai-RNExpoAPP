/**
 * Utils Index - 统一导出所有工具函数
 */

// 导出性能优化工具
export {
    CacheManager, callbackOptimizer, globalCache, imageOptimization, listOptimization, memo, memoOptimizer, memoryManagement, networkOptimization, default as performance, performanceHooks, renderPerformance,
    stateOptimization, useComponentCache,
    usePerformanceMonitor, virtualization, withPerformanceOptimization
} from './performance';

// 性能优化配置
export const PERFORMANCE_CONFIG = {
  // 组件记忆化配置
  MEMO: {
    ENABLE_BY_DEFAULT: true,
    DEBUG_MODE: __DEV__,
  },
  
  // 列表优化配置
  LIST: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_BATCH_SIZE: 10,
    RENDER_THRESHOLD: 0.5,
    WINDOW_SIZE: 10,
  },
  
  // 缓存配置
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5分钟
    MAX_CACHE_SIZE: 100,
    CLEANUP_INTERVAL: 60 * 1000, // 1分钟
  },
  
  // 网络优化配置
  NETWORK: {
    MAX_CONCURRENT_REQUESTS: 5,
    REQUEST_TIMEOUT: 10000,
    RETRY_COUNT: 3,
    DEBOUNCE_DELAY: 300,
  },
  
  // 渲染优化配置
  RENDER: {
    MAX_RENDER_TIME: 16, // 一帧的时间
    WARNING_THRESHOLD: 100, // 渲染次数警告阈值
    ENABLE_MONITORING: __DEV__,
  },
  
  // 内存管理配置
  MEMORY: {
    WARNING_THRESHOLD: 100 * 1024 * 1024, // 100MB
    CLEANUP_THRESHOLD: 200 * 1024 * 1024, // 200MB
    MONITOR_INTERVAL: 30 * 1000, // 30秒
  },
} as const;

// 性能优化工具集
export const perfUtils = {
  /**
   * 创建优化的组件
   */
  optimizeComponent: <P extends object>(
    Component: React.ComponentType<P>,
    options?: {
      memo?: boolean;
      displayName?: string;
      compareProps?: (prev: P, next: P) => boolean;
    }
  ) => {
    const { memo: enableMemo = true, displayName, compareProps } = options || {};
    
    let OptimizedComponent = Component;
    
    if (enableMemo) {
      OptimizedComponent = React.memo(Component, compareProps);
    }
    
    if (displayName) {
      OptimizedComponent.displayName = displayName;
    }
    
    return OptimizedComponent;
  },
  
  /**
   * 创建优化的Hook
   */
  optimizeHook: <T extends (...args: any[]) => any>(
    hookFn: T,
    deps: React.DependencyList
  ): T => {
    return React.useCallback(hookFn, deps);
  },
  
  /**
   * 创建优化的计算属性
   */
  optimizeComputed: <T>(
    computeFn: () => T,
    deps: React.DependencyList
  ): T => {
    return React.useMemo(computeFn, deps);
  },
  
  /**
   * 获取列表优化配置
   */
  getListOptimization: (listType: 'basic' | 'large' | 'infinite' | 'image' = 'basic') => {
    switch (listType) {
      case 'large':
        return listOptimization.getLargeListConfig();
      case 'infinite':
        return listOptimization.getInfiniteScrollConfig();
      case 'image':
        return listOptimization.getImageListConfig();
      default:
        return listOptimization.getBasicConfig();
    }
  },
};

// 性能监控工具
export const perfMonitor = {
  /**
   * 开始性能监控
   */
  start: (label: string): (() => void) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (__DEV__) {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        
        if (duration > PERFORMANCE_CONFIG.RENDER.MAX_RENDER_TIME) {
          console.warn(`⚠️ ${label} 执行时间过长: ${duration.toFixed(2)}ms`);
        }
      }
    };
  },
  
  /**
   * 监控组件渲染性能
   */
  measureRender: <P extends object>(
    Component: React.ComponentType<P>,
    name?: string
  ) => {
    return (props: P) => {
      const componentName = name || Component.displayName || Component.name;
      const endMeasure = perfMonitor.start(`Render ${componentName}`);
      
      React.useEffect(() => {
        endMeasure();
      });
      
      return React.createElement(Component, props);
    };
  },
  
  /**
   * 监控异步操作性能
   */
  measureAsync: async <T>(
    label: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const endMeasure = perfMonitor.start(label);
    
    try {
      const result = await asyncFn();
      return result;
    } finally {
      endMeasure();
    }
  },
};

// React性能优化Hook重导出
export const {
  useCallback,
  useMemo,
  memo: ReactMemo,
} = React;

// 导出类型
export type {
    ComponentPerfConfig, PerformanceMetrics
} from './performance';

