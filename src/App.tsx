/**
 * App - 应用程序入口文件
 * 初始化全局配置、状态管理、样式系统等
 */

import React, { useEffect } from 'react';
import { LogBox } from 'react-native';

// 初始化工具
import { initializeApiData } from '../services/api';
import { initializeStores } from '../stores';
import { initDevEnvironment } from './utils/testing';

// 全局样式和主题
import './styles';

/**
 * 应用程序初始化Hook
 */
const useAppInitialization = () => {
  const [initialized, setInitialized] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 应用程序初始化开始...');
        
        // 1. 初始化开发环境
        if (__DEV__) {
          initDevEnvironment();
          
          // 忽略一些已知的警告
          LogBox.ignoreLogs([
            'Warning: componentWillMount has been renamed',
            'Warning: componentWillReceiveProps has been renamed',
            'Module RCTImageLoader requires main queue setup',
          ]);
        }
        
        // 2. 并行初始化核心系统
        await Promise.all([
          initializeStores(),
          initializeApiData(),
        ]);
        
        console.log('✅ 应用程序初始化完成');
        setInitialized(true);
        
      } catch (error) {
        console.error('❌ 应用程序初始化失败:', error);
        setError(error instanceof Error ? error.message : '初始化失败');
      }
    };
    
    initializeApp();
  }, []);
  
  return { initialized, error };
};

/**
 * App 主组件
 */
const App: React.FC = () => {
  const { initialized, error } = useAppInitialization();
  
  // 如果有初始化错误，显示错误信息
  if (error) {
    return (
      <div style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
      }}>
        <h2 style={{ color: '#EF4444', marginBottom: 16 }}>应用初始化失败</h2>
        <p style={{ color: '#6B7280', textAlign: 'center' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16,
            padding: '12px 24px',
            backgroundColor: '#6366F1',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          重新加载
        </button>
      </div>
    );
  }
  
  // 如果还未初始化完成，显示加载状态
  if (!initialized) {
    return (
      <div style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
      }}>
        <div style={{ marginBottom: 16 }}>⏳</div>
        <p style={{ color: '#6B7280' }}>正在初始化应用...</p>
      </div>
    );
  }
  
  // 初始化完成，应用正常运行
  // 注意：在Expo Router项目中，实际的路由渲染由app/_layout.tsx处理
  return null;
};

export default App;
