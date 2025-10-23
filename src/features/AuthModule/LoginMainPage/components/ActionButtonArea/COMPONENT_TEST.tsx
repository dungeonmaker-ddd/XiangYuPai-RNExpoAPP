/**
 * ActionButtonArea 组件测试页面
 * 
 * 用于快速预览和测试ActionButtonArea组件
 */

import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import ActionButtonArea, { formatCountdown } from './index';

export function ActionButtonAreaTest() {
  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [loginLoading, setLoginLoading] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [formValid, setFormValid] = useState(true);
  
  const handleLogin = () => {
    Alert.alert('登录', `执行${loginMode === 'password' ? '密码' : '验证码'}登录`);
    setLoginLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      setLoginLoading(false);
      Alert.alert('登录成功', '模拟登录请求完成');
    }, 2000);
  };
  
  const handleSendCode = () => {
    Alert.alert('发送验证码', '正在发送验证码...');
    setSendCodeLoading(true);
    
    // 模拟发送验证码请求
    setTimeout(() => {
      setSendCodeLoading(false);
      Alert.alert('发送成功', '验证码已发送');
    }, 1500);
  };
  
  const toggleLoginMode = () => {
    setLoginMode(prev => prev === 'password' ? 'code' : 'password');
  };
  
  const toggleFormValid = () => {
    setFormValid(prev => !prev);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ActionButtonArea 测试</Text>
      
      {/* 模式切换 */}
      <View style={styles.controlPanel}>
        <Text style={styles.controlTitle}>🎮 控制面板</Text>
        
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>登录模式:</Text>
          <View style={styles.controlButtons}>
            <Text
              style={[
                styles.modeButton,
                loginMode === 'password' && styles.modeButtonActive,
              ]}
              onPress={() => setLoginMode('password')}
            >
              密码模式
            </Text>
            <Text
              style={[
                styles.modeButton,
                loginMode === 'code' && styles.modeButtonActive,
              ]}
              onPress={() => setLoginMode('code')}
            >
              验证码模式
            </Text>
          </View>
        </View>
        
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>表单状态:</Text>
          <Text
            style={[
              styles.statusButton,
              formValid ? styles.statusButtonValid : styles.statusButtonInvalid,
            ]}
            onPress={toggleFormValid}
          >
            {formValid ? '✅ 有效' : '❌ 无效'}
          </Text>
        </View>
      </View>
      
      {/* 主组件 */}
      <View style={styles.componentWrapper}>
        <ActionButtonArea
          loginMode={loginMode}
          onLogin={handleLogin}
          loginDisabled={!formValid}
          loginLoading={loginLoading}
          onSendCode={loginMode === 'code' ? handleSendCode : undefined}
          sendCodeDisabled={!formValid}
          sendCodeLoading={sendCodeLoading}
        />
      </View>
      
      {/* 调试信息 */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugTitle}>🔍 调试信息</Text>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>登录模式:</Text>
          <Text style={styles.debugValue}>
            {loginMode === 'password' ? '密码登录' : '验证码登录'}
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>登录按钮文案:</Text>
          <Text style={styles.debugValue}>
            {loginMode === 'password' ? '登录' : '验证码登录'}
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>表单验证:</Text>
          <Text style={[styles.debugValue, formValid ? styles.valid : styles.invalid]}>
            {formValid ? '✅ 有效' : '❌ 无效'}
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>登录加载:</Text>
          <Text style={styles.debugValue}>
            {loginLoading ? '⏳ 加载中' : '⏸️ 空闲'}
          </Text>
        </View>
        
        {loginMode === 'code' && (
          <View style={styles.debugRow}>
            <Text style={styles.debugLabel}>发送验证码:</Text>
            <Text style={styles.debugValue}>
              {sendCodeLoading ? '⏳ 发送中' : '⏸️ 空闲'}
            </Text>
          </View>
        )}
      </View>
      
      {/* 测试指南 */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>🧪 测试指南</Text>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>1️⃣ 密码登录模式</Text>
          <Text style={styles.guideText}>
            • 切换到"密码模式"{'\n'}
            • 点击"登录"按钮{'\n'}
            • 观察加载状态（2秒）{'\n'}
            • 查看登录成功提示
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>2️⃣ 验证码登录模式</Text>
          <Text style={styles.guideText}>
            • 切换到"验证码模式"{'\n'}
            • 点击"发送验证码"按钮{'\n'}
            • 观察倒计时（60秒）{'\n'}
            • 等待倒计时结束{'\n'}
            • 再次点击"发送验证码"
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>3️⃣ 表单验证测试</Text>
          <Text style={styles.guideText}>
            • 点击"表单状态"切换为无效{'\n'}
            • 观察按钮变为禁用状态{'\n'}
            • 尝试点击按钮（无响应）{'\n'}
            • 切换回有效状态{'\n'}
            • 按钮恢复可用
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>4️⃣ 模式切换测试</Text>
          <Text style={styles.guideText}>
            • 在两种模式间切换{'\n'}
            • 观察按钮文案变化{'\n'}
            • 观察"发送验证码"按钮显示/隐藏
          </Text>
        </View>
      </View>
      
      {/* 功能特性 */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ 功能特性</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>动态按钮文案</Text> - 根据登录模式自动切换
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>60秒倒计时</Text> - 自动管理，无需手动清理
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>加载状态</Text> - ActivityIndicator自动显示
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>禁用状态</Text> - 自动降低透明度
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>圆角按钮</Text> - borderRadius: 24（Flutter样式）
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>阴影效果</Text> - elevation: 2（主按钮）
          </Text>
        </View>
      </View>
      
      {/* 倒计时格式化示例 */}
      <View style={styles.examplesCard}>
        <Text style={styles.examplesTitle}>📝 倒计时格式化示例</Text>
        
        <View style={styles.exampleRow}>
          <Text style={styles.exampleInput}>formatCountdown(60)</Text>
          <Text style={styles.exampleOutput}>{formatCountdown(60)}</Text>
        </View>
        
        <View style={styles.exampleRow}>
          <Text style={styles.exampleInput}>formatCountdown(30)</Text>
          <Text style={styles.exampleOutput}>{formatCountdown(30)}</Text>
        </View>
        
        <View style={styles.exampleRow}>
          <Text style={styles.exampleInput}>formatCountdown(10)</Text>
          <Text style={styles.exampleOutput}>{formatCountdown(10)}</Text>
        </View>
        
        <View style={styles.exampleRow}>
          <Text style={styles.exampleInput}>formatCountdown(1)</Text>
          <Text style={styles.exampleOutput}>{formatCountdown(1)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    color: '#1F2937',
  },
  
  // 控制面板
  controlPanel: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  controlButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
  },
  modeButtonActive: {
    backgroundColor: '#9C27B0',
    color: '#FFF',
    fontWeight: '600',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  statusButtonValid: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusButtonInvalid: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  
  // 组件包装器
  componentWrapper: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  
  // 调试信息
  debugInfo: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  debugLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  debugValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  valid: {
    color: '#10B981',
  },
  invalid: {
    color: '#EF4444',
  },
  
  // 测试指南
  guideCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E40AF',
  },
  guideSection: {
    marginBottom: 12,
  },
  guideSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1E40AF',
  },
  guideText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 20,
  },
  
  // 功能特性
  featuresCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#166534',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  featureBold: {
    fontWeight: '600',
  },
  
  // 示例卡片
  examplesCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#92400E',
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  exampleInput: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#92400E',
  },
  exampleOutput: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
});

export default ActionButtonAreaTest;

