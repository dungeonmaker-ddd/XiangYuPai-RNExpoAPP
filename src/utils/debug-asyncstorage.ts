/**
 * AsyncStorage调试工具
 * 帮助诊断AsyncStorage相关错误
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugAsyncStorage = {
  /**
   * 清除所有AsyncStorage数据
   */
  clearAll: async () => {
    try {
      console.log('🧹 清除所有AsyncStorage数据...');
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage清除完成');
    } catch (error) {
      console.error('❌ AsyncStorage清除失败:', error);
    }
  },

  /**
   * 列出所有存储的键
   */
  listAllKeys: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('📋 AsyncStorage存储的键:', keys);
      return keys;
    } catch (error) {
      console.error('❌ 获取AsyncStorage键失败:', error);
      return [];
    }
  },

  /**
   * 检查特定键的值
   */
  checkKey: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      console.log(`🔍 键 "${key}" 的值:`, value);
      return value;
    } catch (error) {
      console.error(`❌ 检查键 "${key}" 失败:`, error);
      return null;
    }
  },

  /**
   * 删除有问题的Zustand存储
   */
  clearZustandStores: async () => {
    try {
      console.log('🧹 清除Zustand存储...');
      const storeKeys = [
        'homepage-store',
        'user-store', 
        'location-store',
        'config-store'
      ];
      
      for (const key of storeKeys) {
        await AsyncStorage.removeItem(key);
        console.log(`✅ 已删除: ${key}`);
      }
      
      console.log('✅ Zustand存储清除完成');
    } catch (error) {
      console.error('❌ Zustand存储清除失败:', error);
    }
  },

  /**
   * 测试AsyncStorage基本功能
   */
  testBasicFunction: async () => {
    try {
      console.log('🧪 测试AsyncStorage基本功能...');
      
      // 测试存储
      await AsyncStorage.setItem('test-key', 'test-value');
      console.log('✅ 存储测试通过');
      
      // 测试读取
      const value = await AsyncStorage.getItem('test-key');
      console.log('✅ 读取测试通过:', value);
      
      // 测试删除
      await AsyncStorage.removeItem('test-key');
      console.log('✅ 删除测试通过');
      
      return true;
    } catch (error) {
      console.error('❌ AsyncStorage基本功能测试失败:', error);
      return false;
    }
  },

  /**
   * 全面诊断
   */
  fullDiagnosis: async () => {
    console.group('🔍 AsyncStorage诊断开始');
    
    // 1. 基本功能测试
    const basicWorking = await debugAsyncStorage.testBasicFunction();
    
    // 2. 列出所有键
    await debugAsyncStorage.listAllKeys();
    
    // 3. 检查Zustand存储
    const zustandKeys = ['homepage-store', 'user-store', 'location-store', 'config-store'];
    for (const key of zustandKeys) {
      await debugAsyncStorage.checkKey(key);
    }
    
    // 4. 如果基本功能正常但Zustand有问题，建议清除
    if (basicWorking) {
      console.log('💡 建议：运行 debugAsyncStorage.clearZustandStores() 清除有问题的存储');
    }
    
    console.groupEnd();
  }
};

// 开发环境自动导出到全局
if (__DEV__) {
  (global as any).debugAsyncStorage = debugAsyncStorage;
  console.log('🛠️ AsyncStorage调试工具已挂载到全局: debugAsyncStorage');
}
