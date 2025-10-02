/**
 * 统一的存储配置
 * 解决AsyncStorage序列化问题
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

// 安全的JSON序列化器
const safeJsonStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      console.warn(`[Storage] 读取失败: ${name}`, error);
      return null;
    }
  },
  
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      // 验证是否为有效JSON
      JSON.parse(value);
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.warn(`[Storage] 存储失败: ${name}`, error);
      // 忽略存储错误，避免崩溃
    }
  },
  
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn(`[Storage] 删除失败: ${name}`, error);
    }
  },
};

// 创建安全的存储配置
export const createSafeStorage = () => {
  // 在所有环境都使用安全存储，防止序列化错误
  return createJSONStorage(() => safeJsonStorage);
};

// 临时禁用存储（用于快速修复）
export const createNoStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

// 调试用存储（记录所有操作）
export const createDebugStorage = () => ({
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      console.log(`[DebugStorage] GET ${name}:`, value ? 'found' : 'null');
      return value;
    } catch (error) {
      console.error(`[DebugStorage] GET ${name} failed:`, error);
      return null;
    }
  },
  
  setItem: async (name: string, value: string) => {
    try {
      // 检查JSON有效性
      const parsed = JSON.parse(value);
      console.log(`[DebugStorage] SET ${name}:`, Object.keys(parsed));
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error(`[DebugStorage] SET ${name} failed:`, error);
      console.error(`[DebugStorage] Invalid JSON:`, value.substring(0, 200));
    }
  },
  
  removeItem: async (name: string) => {
    try {
      await AsyncStorage.removeItem(name);
      console.log(`[DebugStorage] REMOVE ${name}: success`);
    } catch (error) {
      console.error(`[DebugStorage] REMOVE ${name} failed:`, error);
    }
  },
});

// 导出配置选择器
export const getStorageConfig = (mode: 'safe' | 'none' | 'debug' | 'standard' = 'safe') => {
  switch (mode) {
    case 'none':
      return createNoStorage();
    case 'debug':
      return createDebugStorage();
    case 'safe':
      return createSafeStorage();
    case 'standard':
    default:
      return createJSONStorage(() => AsyncStorage);
  }
};

// 错误恢复工具
export const storageRecovery = {
  /**
   * 清除所有Zustand存储以修复AsyncStorage错误
   */
  clearAllStores: async () => {
    const storeKeys = [
      'auth-store',
      'user-store',
      'homepage-store',
      'location-store',
      'config-store',
      'messages-storage',
    ];
    
    try {
      console.log('🔧 开始清除损坏的存储...');
      for (const key of storeKeys) {
        await AsyncStorage.removeItem(key);
        console.log(`✅ 已清除: ${key}`);
      }
      console.log('✅ 存储清除完成，请重启应用');
    } catch (error) {
      console.error('❌ 存储清除失败:', error);
    }
  },

  /**
   * 诊断并修复AsyncStorage问题
   */
  diagnoseAndFix: async () => {
    console.group('🔧 AsyncStorage问题诊断');
    
    try {
      // 1. 测试基本功能
      await AsyncStorage.setItem('test-recovery', 'test');
      await AsyncStorage.getItem('test-recovery');
      await AsyncStorage.removeItem('test-recovery');
      console.log('✅ AsyncStorage基本功能正常');
      
      // 2. 检查问题存储
      const problemKeys = [];
      const storeKeys = ['auth-store', 'user-store', 'homepage-store', 'location-store', 'config-store', 'messages-storage'];
      
      for (const key of storeKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            JSON.parse(value); // 验证JSON
            console.log(`✅ ${key}: 正常`);
          }
        } catch (error) {
          console.error(`❌ ${key}: 损坏`, error);
          problemKeys.push(key);
        }
      }
      
      // 3. 清除问题存储
      if (problemKeys.length > 0) {
        console.log(`🔧 发现${problemKeys.length}个损坏的存储，开始清理...`);
        for (const key of problemKeys) {
          await AsyncStorage.removeItem(key);
          console.log(`✅ 已修复: ${key}`);
        }
      }
      
    } catch (error) {
      console.error('❌ 诊断失败:', error);
    }
    
    console.groupEnd();
  }
};

// 开发环境自动挂载恢复工具
if (__DEV__) {
  (global as any).storageRecovery = storageRecovery;
  console.log('🛠️ 存储恢复工具已挂载到全局: storageRecovery');
}
