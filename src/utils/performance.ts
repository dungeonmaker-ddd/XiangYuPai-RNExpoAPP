/**
 * 性能优化工具
 * 提供组件记忆化、列表优化、缓存策略等性能优化工具
 */

import React from 'react';
import { FlatListProps, ListRenderItem } from 'react-native';

// 性能监控接口
interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
  jsHeapSize?: number;
}

// 组件性能配置
interface ComponentPerfConfig {
  enableMemo: boolean;
  enableCallback: boolean;
  enableUseMemo: boolean;
  debugRender: boolean;
}

/**
 * React.memo 增强工具
 */
export const memo = {
  /**
   * 基础记忆化组件
   */
  basic: <P extends object>(
    Component: React.ComponentType<P>,
    areEqual?: (prevProps: P, nextProps: P) => boolean
  ) => React.memo(Component, areEqual),
  
  /**
   * 深度比较记忆化
   */
  deep: <P extends object>(Component: React.ComponentType<P>) => 
    React.memo(Component, (prevProps, nextProps) => {
      return JSON.stringify(prevProps) === JSON.stringify(nextProps);
    }),
  
  /**
   * 浅比较记忆化（默认行为）
   */
  shallow: <P extends object>(Component: React.ComponentType<P>) => 
    React.memo(Component),
  
  /**
   * 自定义比较函数记忆化
   */
  custom: <P extends object>(
    Component: React.ComponentType<P>,
    compareKeys: (keyof P)[]
  ) => React.memo(Component, (prevProps, nextProps) => {
    return compareKeys.every(key => prevProps[key] === nextProps[key]);
  }),
};

/**
 * useCallback 优化工具
 */
export const callbackOptimizer = {
  /**
   * 创建稳定的事件处理器
   */
  createEventHandler: <T extends (...args: any[]) => any>(
    handler: T,
    deps: React.DependencyList
  ): T => React.useCallback(handler, deps),
  
  /**
   * 创建稳定的导航处理器
   */
  createNavigationHandler: (
    navigate: (route: string, params?: any) => void,
    route: string,
    params?: any
  ) => React.useCallback(() => {
    navigate(route, params);
  }, [navigate, route, params]),
  
  /**
   * 创建防抖处理器
   */
  createDebouncedHandler: <T extends (...args: any[]) => any>(
    handler: T,
    delay: number = 300
  ) => {
    const timeoutRef = React.useRef<NodeJS.Timeout>();
    
    return React.useCallback((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        handler(...args);
      }, delay);
    }, [handler, delay]);
  },
  
  /**
   * 创建节流处理器
   */
  createThrottledHandler: <T extends (...args: any[]) => any>(
    handler: T,
    limit: number = 100
  ) => {
    const lastRun = React.useRef<number>(0);
    
    return React.useCallback((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastRun.current >= limit) {
        handler(...args);
        lastRun.current = now;
      }
    }, [handler, limit]);
  },
};

/**
 * useMemo 优化工具
 */
export const memoOptimizer = {
  /**
   * 创建计算属性
   */
  createComputed: <T>(
    computeFn: () => T,
    deps: React.DependencyList
  ): T => React.useMemo(computeFn, deps),
  
  /**
   * 创建筛选结果
   */
  createFilteredData: <T>(
    data: T[],
    filterFn: (item: T) => boolean,
    deps: React.DependencyList
  ): T[] => React.useMemo(() => data.filter(filterFn), [data, ...deps]),
  
  /**
   * 创建排序结果
   */
  createSortedData: <T>(
    data: T[],
    sortFn: (a: T, b: T) => number,
    deps: React.DependencyList
  ): T[] => React.useMemo(() => [...data].sort(sortFn), [data, ...deps]),
  
  /**
   * 创建分组结果
   */
  createGroupedData: <T, K extends string | number>(
    data: T[],
    groupFn: (item: T) => K,
    deps: React.DependencyList
  ): Record<K, T[]> => React.useMemo(() => {
    return data.reduce((groups, item) => {
      const key = groupFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }, [data, ...deps]),
};

/**
 * FlatList 性能优化配置
 */
export const listOptimization = {
  /**
   * 基础优化配置
   */
  getBasicConfig: <T>(): Partial<FlatListProps<T>> => ({
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 20,
    windowSize: 10,
  }),
  
  /**
   * 大列表优化配置
   */
  getLargeListConfig: <T>(): Partial<FlatListProps<T>> => ({
    removeClippedSubviews: true,
    maxToRenderPerBatch: 5,
    updateCellsBatchingPeriod: 100,
    initialNumToRender: 10,
    windowSize: 5,
    getItemLayout: (data, index) => ({
      length: 100, // 预估的列表项高度
      offset: 100 * index,
      index,
    }),
  }),
  
  /**
   * 无限滚动优化配置
   */
  getInfiniteScrollConfig: <T>(): Partial<FlatListProps<T>> => ({
    removeClippedSubviews: true,
    maxToRenderPerBatch: 8,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 15,
    windowSize: 8,
    onEndReachedThreshold: 0.5,
  }),
  
  /**
   * 图片列表优化配置
   */
  getImageListConfig: <T>(): Partial<FlatListProps<T>> => ({
    removeClippedSubviews: true,
    maxToRenderPerBatch: 3,
    updateCellsBatchingPeriod: 100,
    initialNumToRender: 6,
    windowSize: 4,
    onEndReachedThreshold: 0.8,
  }),
  
  /**
   * 创建记忆化渲染器
   */
  createMemoizedRenderer: <T>(
    renderItem: ListRenderItem<T>,
    deps: React.DependencyList = []
  ): ListRenderItem<T> => {
    return React.useCallback(renderItem, deps);
  },
  
  /**
   * 创建优化的键提取器
   */
  createKeyExtractor: <T>(
    keyFn: (item: T, index: number) => string
  ) => React.useCallback(keyFn, []),
};

/**
 * 图片优化工具
 */
export const imageOptimization = {
  /**
   * 获取优化的图片样式
   */
  getOptimizedImageProps: (uri: string, width: number, height: number) => ({
    source: { uri },
    style: { width, height },
    resizeMode: 'cover' as const,
    // 启用图片缓存
    cache: 'force-cache' as const,
    // 图片加载优化
    priority: 'normal' as const,
  }),
  
  /**
   * 懒加载图片配置
   */
  getLazyLoadConfig: () => ({
    placeholder: { uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' },
    fadeDuration: 300,
    transition: true,
  }),
};

/**
 * 内存管理工具
 */
export const memoryManagement = {
  /**
   * 创建清理函数
   */
  createCleanup: (cleanupFn: () => void) => {
    return React.useEffect(() => {
      return cleanupFn;
    }, []);
  },
  
  /**
   * 创建内存监控Hook
   */
  useMemoryMonitor: (threshold: number = 100 * 1024 * 1024) => { // 100MB
    const [memoryWarning, setMemoryWarning] = React.useState(false);
    
    React.useEffect(() => {
      // TODO: 实现内存监控
      // 这里可以集成react-native-device-info获取内存信息
      console.log('内存监控初始化');
      
      return () => {
        console.log('内存监控清理');
      };
    }, [threshold]);
    
    return { memoryWarning };
  },
  
  /**
   * 创建资源清理Hook
   */
  useResourceCleanup: (resources: (() => void)[]) => {
    React.useEffect(() => {
      return () => {
        resources.forEach(cleanup => {
          try {
            cleanup();
          } catch (error) {
            console.warn('资源清理失败:', error);
          }
        });
      };
    }, []);
  },
};

/**
 * 渲染性能监控
 */
export const renderPerformance = {
  /**
   * 渲染时间监控Hook
   */
  useRenderTime: (componentName: string) => {
    const renderStartTime = React.useRef<number>(0);
    
    React.useEffect(() => {
      renderStartTime.current = performance.now();
    });
    
    React.useEffect(() => {
      const renderTime = performance.now() - renderStartTime.current;
      if (__DEV__ && renderTime > 16) { // 超过一帧时间
        console.warn(`${componentName} 渲染时间过长: ${renderTime.toFixed(2)}ms`);
      }
    });
  },
  
  /**
   * 重新渲染次数监控
   */
  useRenderCount: (componentName: string) => {
    const renderCount = React.useRef(0);
    
    React.useEffect(() => {
      renderCount.current += 1;
      if (__DEV__) {
        console.log(`${componentName} 渲染次数: ${renderCount.current}`);
      }
    });
    
    return renderCount.current;
  },
  
  /**
   * 创建性能监控的HOC
   */
  withPerformanceMonitor: <P extends object>(
    Component: React.ComponentType<P>,
    componentName?: string
  ) => {
    const MonitoredComponent = React.memo((props: P) => {
      renderPerformance.useRenderTime(componentName || Component.name);
      renderPerformance.useRenderCount(componentName || Component.name);
      
      return React.createElement(Component, props);
    });
    
    MonitoredComponent.displayName = `withPerformanceMonitor(${componentName || Component.name})`;
    
    return MonitoredComponent;
  },
};

/**
 * 状态更新优化
 */
export const stateOptimization = {
  /**
   * 批量状态更新
   */
  batchUpdate: (updates: (() => void)[]) => {
    // React 18+自动批处理，这里提供向后兼容
    React.unstable_batchedUpdates(() => {
      updates.forEach(update => update());
    });
  },
  
  /**
   * 防抖状态更新
   */
  useDebouncedState: <T>(
    initialValue: T,
    delay: number = 300
  ): [T, T, React.Dispatch<React.SetStateAction<T>>] => {
    const [immediateValue, setImmediateValue] = React.useState(initialValue);
    const [debouncedValue, setDebouncedValue] = React.useState(initialValue);
    
    React.useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedValue(immediateValue);
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }, [immediateValue, delay]);
    
    return [immediateValue, debouncedValue, setImmediateValue];
  },
  
  /**
   * 节流状态更新
   */
  useThrottledState: <T>(
    initialValue: T,
    limit: number = 100
  ): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = React.useState(initialValue);
    const lastUpdate = React.useRef<number>(0);
    
    const throttledSetValue = React.useCallback((newValue: React.SetStateAction<T>) => {
      const now = Date.now();
      
      if (now - lastUpdate.current >= limit) {
        setValue(newValue);
        lastUpdate.current = now;
      }
    }, [limit]);
    
    return [value, throttledSetValue];
  },
};

/**
 * 网络请求优化
 */
export const networkOptimization = {
  /**
   * 请求去重工具
   */
  createRequestDeduplicator: () => {
    const pendingRequests = new Map<string, Promise<any>>();
    
    return <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key)!;
      }
      
      const request = requestFn().finally(() => {
        pendingRequests.delete(key);
      });
      
      pendingRequests.set(key, request);
      return request;
    };
  },
  
  /**
   * 并发请求限制
   */
  createConcurrencyLimiter: (maxConcurrent: number = 5) => {
    let activeRequests = 0;
    const queue: (() => void)[] = [];
    
    return <T>(requestFn: () => Promise<T>): Promise<T> => {
      return new Promise((resolve, reject) => {
        const executeRequest = async () => {
          activeRequests++;
          try {
            const result = await requestFn();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            activeRequests--;
            if (queue.length > 0) {
              const nextRequest = queue.shift();
              nextRequest?.();
            }
          }
        };
        
        if (activeRequests < maxConcurrent) {
          executeRequest();
        } else {
          queue.push(executeRequest);
        }
      });
    };
  },
};

/**
 * 缓存优化工具
 */
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize: number;
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }
  
  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * 获取缓存统计
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // TODO: 实现命中率统计
    };
  }
}

/**
 * 全局缓存实例
 */
export const globalCache = new CacheManager(200);

/**
 * 组件缓存Hook
 */
export const useComponentCache = <T>(
  key: string,
  computeFn: () => T,
  deps: React.DependencyList,
  ttl: number = 5 * 60 * 1000
): T => {
  const cacheKey = `component_${key}`;
  
  return React.useMemo(() => {
    // 尝试从缓存获取
    const cached = globalCache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // 计算新值并缓存
    const newValue = computeFn();
    globalCache.set(cacheKey, newValue, ttl);
    
    return newValue;
  }, deps);
};

/**
 * 长列表虚拟化工具
 */
export const virtualization = {
  /**
   * 计算可见项目范围
   */
  calculateVisibleRange: (
    scrollOffset: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number
  ): { start: number; end: number } => {
    const start = Math.max(0, Math.floor(scrollOffset / itemHeight) - 2);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 4;
    const end = Math.min(totalItems - 1, start + visibleCount);
    
    return { start, end };
  },
  
  /**
   * 创建虚拟化渲染器
   */
  createVirtualizedRenderer: <T>(
    data: T[],
    renderItem: (item: T, index: number) => React.ReactElement,
    itemHeight: number
  ) => {
    return React.useCallback((visibleRange: { start: number; end: number }) => {
      const items: React.ReactElement[] = [];
      
      for (let i = visibleRange.start; i <= visibleRange.end; i++) {
        if (data[i]) {
          items.push(renderItem(data[i], i));
        }
      }
      
      return items;
    }, [data, renderItem, itemHeight]);
  },
};

/**
 * 性能监控Hook
 */
export const usePerformanceMonitor = (componentName: string): PerformanceMetrics => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    renderTime: 0,
    componentCount: 0,
  });
  
  const startTime = React.useRef<number>(0);
  
  React.useEffect(() => {
    startTime.current = performance.now();
  });
  
  React.useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime,
      componentCount: prev.componentCount + 1,
    }));
    
    // 开发环境性能警告
    if (__DEV__ && renderTime > 16) {
      console.warn(`⚠️ ${componentName} 渲染时间: ${renderTime.toFixed(2)}ms (>16ms)`);
    }
  });
  
  return metrics;
};

/**
 * 组件性能优化装饰器
 */
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  config: Partial<ComponentPerfConfig> = {}
) => {
  const {
    enableMemo = true,
    enableCallback = true,
    enableUseMemo = true,
    debugRender = __DEV__,
  } = config;
  
  let OptimizedComponent = Component;
  
  // 应用记忆化
  if (enableMemo) {
    OptimizedComponent = React.memo(OptimizedComponent) as React.ComponentType<P>;
  }
  
  // 包装性能监控
  if (debugRender) {
    OptimizedComponent = renderPerformance.withPerformanceMonitor(
      OptimizedComponent,
      Component.name
    );
  }
  
  return OptimizedComponent;
};

/**
 * 批量导出优化Hook
 */
export const performanceHooks = {
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  memo: React.memo,
  useComponentCache,
  usePerformanceMonitor,
  useDebouncedState: stateOptimization.useDebouncedState,
  useThrottledState: stateOptimization.useThrottledState,
  useMemoryMonitor: memoryManagement.useMemoryMonitor,
};

// 默认导出性能优化工具集
export default {
  memo,
  callbackOptimizer,
  memoOptimizer,
  listOptimization,
  imageOptimization,
  memoryManagement,
  renderPerformance,
  stateOptimization,
  networkOptimization,
  virtualization,
  globalCache,
  CacheManager,
  withPerformanceOptimization,
  performanceHooks,
};
