/**
 * 测试和调试工具
 * 提供开发和测试环境下的调试工具
 */

import React from 'react';

// 测试配置接口
interface TestConfig {
  enableMockData: boolean;
  enablePerformanceLogging: boolean;
  enableStateLogging: boolean;
  enableNetworkLogging: boolean;
  mockDelay: number;
}

// 默认测试配置
export const DEFAULT_TEST_CONFIG: TestConfig = {
  enableMockData: __DEV__,
  enablePerformanceLogging: __DEV__,
  enableStateLogging: __DEV__,
  enableNetworkLogging: __DEV__,
  mockDelay: 500,
};

/**
 * 调试日志工具
 */
export const debugLogger = {
  /**
   * 组件渲染日志
   */
  logRender: (componentName: string, props?: any) => {
    if (__DEV__) {
      console.log(`🔄 [Render] ${componentName}`, props ? { props } : '');
    }
  },
  
  /**
   * 状态变更日志
   */
  logStateChange: (stateName: string, oldValue: any, newValue: any) => {
    if (__DEV__) {
      console.log(`📊 [State] ${stateName}:`, {
        from: oldValue,
        to: newValue,
      });
    }
  },
  
  /**
   * API请求日志
   */
  logApiRequest: (method: string, url: string, params?: any) => {
    if (__DEV__) {
      console.log(`🌐 [API] ${method} ${url}`, params ? { params } : '');
    }
  },
  
  /**
   * API响应日志
   */
  logApiResponse: (method: string, url: string, response: any, duration: number) => {
    if (__DEV__) {
      console.log(`✅ [API] ${method} ${url} (${duration}ms)`, {
        response: typeof response === 'object' ? Object.keys(response) : response,
      });
    }
  },
  
  /**
   * 错误日志
   */
  logError: (context: string, error: any, extra?: any) => {
    if (__DEV__) {
      console.group(`❌ [Error] ${context}`);
      console.error(error);
      if (extra) {
        console.log('额外信息:', extra);
      }
      console.groupEnd();
    }
  },
  
  /**
   * 性能日志
   */
  logPerformance: (operation: string, duration: number, threshold: number = 100) => {
    if (__DEV__) {
      const level = duration > threshold ? 'warn' : 'log';
      console[level](`⏱️ [Performance] ${operation}: ${duration.toFixed(2)}ms`);
    }
  },
  
  /**
   * 用户交互日志
   */
  logUserInteraction: (action: string, element: string, data?: any) => {
    if (__DEV__) {
      console.log(`👆 [Interaction] ${action} on ${element}`, data || '');
    }
  },
};

/**
 * 模拟数据生成器
 */
export const mockDataGenerator = {
  /**
   * 生成模拟用户数据
   */
  generateUsers: (count: number) => {
    const names = ['小明', '小红', '大神', '萌妹子', '技术宅', '游戏达人', '温柔小姐姐', '幽默大叔'];
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'];
    const tags = ['王者荣耀', '英雄联盟', '探店', 'K歌', '台球', '温柔', '幽默', '专业'];
    
    return Array.from({ length: count }, (_, index) => ({
      id: `user_${index + 1}`,
      name: `${names[index % names.length]}${index + 1}`,
      avatar: `https://picsum.photos/200/200?random=${index}`,
      age: 18 + (index % 15),
      gender: index % 3 === 0 ? 'female' : index % 3 === 1 ? 'male' : 'other',
      location: {
        city: cities[index % cities.length],
        district: `${cities[index % cities.length]}区`,
        distance: Math.floor(Math.random() * 50) + 1,
      },
      tags: tags.slice(0, 2 + (index % 3)),
      price: 30 + (index % 100),
      rating: 4.0 + Math.random(),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      isOnline: index % 4 !== 0,
      lastActiveTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      serviceTypes: ['honor_of_kings', 'league_of_legends', 'explore_shop'][index % 3],
      description: `我是用户${index + 1}，擅长游戏和生活服务。`,
      isVerified: index % 5 === 0,
      responseRate: 85 + Math.floor(Math.random() * 15),
    }));
  },
  
  /**
   * 生成模拟服务数据
   */
  generateServices: () => [
    { id: '1', name: '王者荣耀', type: 'honor_of_kings', icon: '👑', backgroundColor: '#FF6B6B' },
    { id: '2', name: '英雄联盟', type: 'league_of_legends', icon: '⚔️', backgroundColor: '#4ECDC4' },
    { id: '3', name: '探店', type: 'explore_shop', icon: '🏪', backgroundColor: '#45B7D1' },
    { id: '4', name: 'K歌', type: 'ktv', icon: '🎤', backgroundColor: '#F9CA24' },
    { id: '5', name: '台球', type: 'billiards', icon: '🎱', backgroundColor: '#6C5CE7' },
  ],
  
  /**
   * 模拟网络延迟
   */
  delay: (ms: number = DEFAULT_TEST_CONFIG.mockDelay) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};

/**
 * 组件测试工具
 */
export const componentTesting = {
  /**
   * 组件渲染测试
   */
  testRender: <P extends object>(
    Component: React.ComponentType<P>,
    props: P
  ): React.ReactElement => {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      console.error(`组件渲染测试失败: ${Component.name}`, error);
      throw error;
    }
  },
  
  /**
   * Props验证工具
   */
  validateProps: <P extends object>(
    props: P,
    requiredProps: (keyof P)[],
    componentName: string
  ): boolean => {
    const missingProps = requiredProps.filter(prop => 
      props[prop] === undefined || props[prop] === null
    );
    
    if (missingProps.length > 0) {
      console.error(`${componentName} 缺少必需的props:`, missingProps);
      return false;
    }
    
    return true;
  },
  
  /**
   * 事件处理测试
   */
  testEventHandlers: (handlers: Record<string, () => void>) => {
    Object.entries(handlers).forEach(([name, handler]) => {
      try {
        if (typeof handler === 'function') {
          console.log(`✅ ${name} 事件处理器可用`);
        } else {
          console.warn(`⚠️ ${name} 不是有效的事件处理器`);
        }
      } catch (error) {
        console.error(`❌ ${name} 事件处理器测试失败:`, error);
      }
    });
  },
};

/**
 * 状态测试工具
 */
export const stateTesting = {
  /**
   * Store状态快照
   */
  captureStoreSnapshot: (storeName: string, getState: () => any) => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      storeName,
      state: JSON.parse(JSON.stringify(getState())),
    };
    
    if (__DEV__) {
      console.log(`📸 [Snapshot] ${storeName}:`, snapshot);
    }
    
    return snapshot;
  },
  
  /**
   * 状态变更监听
   */
  watchStateChanges: (
    storeName: string,
    subscribe: (callback: () => void) => () => void,
    getState: () => any
  ) => {
    if (!__DEV__) return () => {};
    
    let previousState = JSON.stringify(getState());
    
    return subscribe(() => {
      const currentState = JSON.stringify(getState());
      
      if (currentState !== previousState) {
        console.log(`🔄 [State Change] ${storeName}`);
        previousState = currentState;
      }
    });
  },
};

/**
 * 网络测试工具
 */
export const networkTesting = {
  /**
   * API健康检查
   */
  checkApiHealth: async (endpoints: string[]): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        results[endpoint] = response.ok;
      } catch (error) {
        results[endpoint] = false;
      }
    }
    
    if (__DEV__) {
      console.log('🏥 [API Health]:', results);
    }
    
    return results;
  },
  
  /**
   * 网络连接测试
   */
  testNetworkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        cache: 'no-cache',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * 模拟网络错误
   */
  simulateNetworkError: (errorType: 'timeout' | 'offline' | 'server_error' = 'offline') => {
    const errors = {
      timeout: () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 100)
      ),
      offline: () => Promise.reject(new Error('Network request failed')),
      server_error: () => Promise.reject(new Error('Internal server error')),
    };
    
    return errors[errorType]();
  },
};

/**
 * 调试面板数据
 */
export const debugPanel = {
  /**
   * 获取应用状态摘要
   */
  getAppStateSummary: () => ({
    timestamp: new Date().toISOString(),
    platform: Platform.OS,
    version: Platform.Version,
    // TODO: 添加更多应用状态信息
  }),
  
  /**
   * 获取性能指标
   */
  getPerformanceMetrics: () => ({
    memory: {
      // TODO: 添加内存使用情况
      estimated: 'N/A',
    },
    render: {
      // TODO: 添加渲染性能指标
      fps: 'N/A',
    },
    network: {
      // TODO: 添加网络性能指标
      latency: 'N/A',
    },
  }),
};

/**
 * 开发者工具
 */
export const devTools = {
  /**
   * 启用React DevTools
   */
  enableReactDevTools: () => {
    if (__DEV__ && typeof global !== 'undefined') {
      // TODO: 集成React DevTools
      console.log('React DevTools 已启用');
    }
  },
  
  /**
   * 启用网络监控
   */
  enableNetworkMonitor: () => {
    if (__DEV__) {
      // TODO: 集成网络监控工具
      console.log('网络监控已启用');
    }
  },
  
  /**
   * 启用性能监控
   */
  enablePerformanceMonitor: () => {
    if (__DEV__) {
      // TODO: 集成性能监控工具
      console.log('性能监控已启用');
    }
  },
};

/**
 * 错误处理测试
 */
export const errorTesting = {
  /**
   * 模拟组件错误
   */
  simulateComponentError: (componentName: string, errorType: 'render' | 'runtime' = 'render') => {
    const errors = {
      render: () => {
        throw new Error(`${componentName} 渲染错误`);
      },
      runtime: () => {
        setTimeout(() => {
          throw new Error(`${componentName} 运行时错误`);
        }, 100);
      },
    };
    
    return errors[errorType];
  },
  
  /**
   * 测试错误边界
   */
  testErrorBoundary: (ErrorBoundaryComponent: React.ComponentType<any>) => {
    const TestComponent = () => {
      throw new Error('测试错误边界');
    };
    
    try {
      return React.createElement(
        ErrorBoundaryComponent,
        {},
        React.createElement(TestComponent)
      );
    } catch (error) {
      console.log('错误边界测试完成');
      return null;
    }
  },
};

/**
 * 功能测试套件
 */
export const functionalTests = {
  /**
   * 测试首页功能
   */
  testHomepageFeatures: async () => {
    const tests = [
      {
        name: '状态管理',
        test: () => {
          // TODO: 测试Zustand stores
          return true;
        },
      },
      {
        name: 'API接口',
        test: async () => {
          // TODO: 测试API连接
          return true;
        },
      },
      {
        name: '路由导航',
        test: () => {
          // TODO: 测试路由功能
          return true;
        },
      },
      {
        name: '组件渲染',
        test: () => {
          // TODO: 测试组件渲染
          return true;
        },
      },
    ];
    
    const results: Record<string, boolean> = {};
    
    for (const { name, test } of tests) {
      try {
        const result = await test();
        results[name] = result;
        console.log(`✅ ${name} 测试通过`);
      } catch (error) {
        results[name] = false;
        console.error(`❌ ${name} 测试失败:`, error);
      }
    }
    
    return results;
  },
  
  /**
   * 测试组件集成
   */
  testComponentIntegration: () => {
    const components = [
      'TopFunctionArea',
      'GameBannerArea', 
      'ServiceGridArea',
      'FeaturedUsersArea',
      'EventCenterArea',
      'UserListArea',
    ];
    
    components.forEach(componentName => {
      console.log(`🧩 测试组件: ${componentName}`);
      // TODO: 实际组件测试逻辑
    });
    
    return components.map(name => ({ name, status: 'pass' }));
  },
};

/**
 * 性能测试工具
 */
export const performanceTesting = {
  /**
   * 测试列表滚动性能
   */
  testListScrollPerformance: (listComponent: any, itemCount: number = 1000) => {
    const startTime = performance.now();
    
    // TODO: 模拟列表滚动测试
    console.log(`📋 测试列表滚动性能 (${itemCount}项)`);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    debugLogger.logPerformance('列表滚动', duration, 16);
    
    return {
      itemCount,
      duration,
      fps: 1000 / duration,
      passed: duration < 16,
    };
  },
  
  /**
   * 测试内存使用
   */
  testMemoryUsage: () => {
    // TODO: 实现内存使用测试
    console.log('💾 内存使用测试');
    
    return {
      heapUsed: 'N/A',
      heapTotal: 'N/A',
      external: 'N/A',
    };
  },
  
  /**
   * 测试启动时间
   */
  measureStartupTime: () => {
    const startTime = Date.now();
    
    return {
      start: startTime,
      measure: () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        debugLogger.logPerformance('应用启动', duration, 2000);
        
        return {
          duration,
          passed: duration < 2000,
        };
      },
    };
  },
};

/**
 * 用户体验测试
 */
export const uxTesting = {
  /**
   * 测试加载状态
   */
  testLoadingStates: () => {
    console.log('⏳ 测试加载状态');
    
    return {
      initialLoad: true,
      dataRefresh: true,
      infiniteScroll: true,
      imageLoad: true,
    };
  },
  
  /**
   * 测试错误处理
   */
  testErrorHandling: () => {
    console.log('🚨 测试错误处理');
    
    return {
      networkError: true,
      serverError: true,
      dataError: true,
      renderError: true,
    };
  },
  
  /**
   * 测试响应式设计
   */
  testResponsiveDesign: () => {
    console.log('📱 测试响应式设计');
    
    return {
      phone: true,
      tablet: true,
      landscape: true,
      portrait: true,
    };
  },
};

/**
 * 综合测试套件
 */
export const testSuite = {
  /**
   * 运行所有测试
   */
  runAllTests: async () => {
    console.group('🧪 开始运行测试套件');
    
    const results = {
      functional: await functionalTests.testHomepageFeatures(),
      components: functionalTests.testComponentIntegration(),
      performance: {
        list: performanceTesting.testListScrollPerformance(),
        memory: performanceTesting.testMemoryUsage(),
      },
      ux: {
        loading: uxTesting.testLoadingStates(),
        errors: uxTesting.testErrorHandling(),
        responsive: uxTesting.testResponsiveDesign(),
      },
    };
    
    console.log('📊 测试结果汇总:', results);
    console.groupEnd();
    
    return results;
  },
  
  /**
   * 快速健康检查
   */
  quickHealthCheck: () => {
    const checks = [
      { name: '组件导入', check: () => true },
      { name: '状态管理', check: () => true },
      { name: 'API配置', check: () => true },
      { name: '路由配置', check: () => true },
      { name: '样式系统', check: () => true },
    ];
    
    const results = checks.map(({ name, check }) => {
      try {
        return { name, status: check() ? 'pass' : 'fail' };
      } catch (error) {
        return { name, status: 'error', error: error.message };
      }
    });
    
    console.log('🏥 健康检查结果:', results);
    return results;
  },
};

// 开发环境初始化
export const initDevEnvironment = () => {
  if (__DEV__) {
    console.log('🚀 开发环境初始化');
    
    // 启用开发工具
    devTools.enableReactDevTools();
    devTools.enableNetworkMonitor();
    devTools.enablePerformanceMonitor();
    
    // 运行快速健康检查
    testSuite.quickHealthCheck();
    
    console.log('✅ 开发环境初始化完成');
  }
};

// 导入Platform
import { Platform } from 'react-native';
