/**
 * AuthInputArea 组件测试页面
 * 
 * 用于快速预览和测试AuthInputArea组件
 */

import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuthInputArea, { getSubtitle, getTitle } from './index';

export function AuthInputAreaTest() {
  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  
  const handleCountryCodePress = () => {
    Alert.alert('区号选择', '点击了区号按钮');
  };
  
  const toggleLoginMode = () => {
    setLoginMode(prev => prev === 'password' ? 'code' : 'password');
  };
  
  // 验证状态
  const phoneValid = phoneNumber.length === 11;
  const passwordValid = password.length >= 6 && !/^\d+$/.test(password);
  const codeValid = code.length === 6;
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AuthInputArea 测试</Text>
      
      {/* 模式切换按钮 */}
      <View style={styles.controlPanel}>
        <Text style={styles.controlTitle}>🎮 控制面板</Text>
        
        <TouchableOpacity
          style={styles.switchButton}
          onPress={toggleLoginMode}
        >
          <Text style={styles.switchButtonText}>
            🔄 切换到{loginMode === 'password' ? '验证码' : '密码'}登录
          </Text>
        </TouchableOpacity>
        
        <View style={styles.modeInfo}>
          <Text style={styles.modeLabel}>当前模式:</Text>
          <Text style={[
            styles.modeValue,
            loginMode === 'password' ? styles.modePassword : styles.modeCode
          ]}>
            {loginMode === 'password' ? '🔑 密码登录' : '📱 验证码登录'}
          </Text>
        </View>
      </View>
      
      {/* 主组件 */}
      <View style={styles.componentWrapper}>
        <AuthInputArea
          loginMode={loginMode}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          countryCode={countryCode}
          onCountryCodePress={handleCountryCodePress}
          phoneValid={phoneValid}
          password={password}
          onPasswordChange={setPassword}
          passwordValid={passwordValid}
          code={code}
          onCodeChange={setCode}
          codeValid={codeValid}
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
          <Text style={styles.debugLabel}>标题:</Text>
          <Text style={styles.debugValue}>{getTitle(loginMode)}</Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>副标题:</Text>
          <Text style={styles.debugValue}>{getSubtitle(loginMode)}</Text>
        </View>
        
        <View style={styles.debugSeparator} />
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>手机号:</Text>
          <Text style={styles.debugValue}>
            {phoneNumber || '(空)'}
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>手机号验证:</Text>
          <Text style={[styles.debugValue, phoneValid ? styles.valid : styles.invalid]}>
            {phoneValid ? '✅ 有效' : '❌ 无效'}
          </Text>
        </View>
        
        {loginMode === 'password' && (
          <>
            <View style={styles.debugSeparator} />
            
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>密码:</Text>
              <Text style={styles.debugValue}>
                {'*'.repeat(password.length) || '(空)'}
              </Text>
            </View>
            
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>密码长度:</Text>
              <Text style={styles.debugValue}>{password.length}/20</Text>
            </View>
            
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>密码验证:</Text>
              <Text style={[styles.debugValue, passwordValid ? styles.valid : styles.invalid]}>
                {passwordValid ? '✅ 有效' : '❌ 无效'}
              </Text>
            </View>
          </>
        )}
        
        {loginMode === 'code' && (
          <>
            <View style={styles.debugSeparator} />
            
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>验证码:</Text>
              <Text style={styles.debugValue}>
                {code || '(空)'}
              </Text>
            </View>
            
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>验证码长度:</Text>
              <Text style={styles.debugValue}>{code.length}/6</Text>
            </View>
            
            <View style={styles.debugRow}>
              <Text style={styles.debugLabel}>验证码验证:</Text>
              <Text style={[styles.debugValue, codeValid ? styles.valid : styles.invalid]}>
                {codeValid ? '✅ 有效' : '❌ 无效'}
              </Text>
            </View>
          </>
        )}
      </View>
      
      {/* 测试指南 */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>🧪 测试指南</Text>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>1️⃣ 密码登录模式测试</Text>
          <Text style={styles.guideText}>
            • 确保当前为密码模式{'\n'}
            • 输入手机号（11位）{'\n'}
            • 输入密码（6-20位，非纯数字）{'\n'}
            • 观察验证状态变化
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>2️⃣ 验证码登录模式测试</Text>
          <Text style={styles.guideText}>
            • 点击"切换到验证码登录"按钮{'\n'}
            • 观察动画效果（淡出→淡入）{'\n'}
            • 输入手机号（11位）{'\n'}
            • 输入验证码（6位数字）{'\n'}
            • 观察验证状态变化
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>3️⃣ 模式切换测试</Text>
          <Text style={styles.guideText}>
            • 在密码模式输入手机号和密码{'\n'}
            • 切换到验证码模式{'\n'}
            • 观察手机号数据是否保留{'\n'}
            • 输入验证码{'\n'}
            • 切换回密码模式{'\n'}
            • 观察密码数据是否保留
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>4️⃣ 动画效果测试</Text>
          <Text style={styles.guideText}>
            • 快速切换登录模式{'\n'}
            • 观察淡出→淡入动画（300ms）{'\n'}
            • 标题和副标题应同步变化{'\n'}
            • 输入框平滑过渡
          </Text>
        </View>
      </View>
      
      {/* 功能特性 */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ 功能特性</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>整合3个输入组件</Text> - PhoneInputArea, PasswordInputArea, CodeInputArea
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>模式切换动画</Text> - 淡出→淡入，总耗时300ms
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>动态标题</Text> - 根据登录模式自动更新
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>手机号共用</Text> - 两种模式共用手机号输入，切换时数据保留
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>统一管理</Text> - 所有输入状态在一个组件内管理
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>性能优化</Text> - React.memo + useNativeDriver
          </Text>
        </View>
      </View>
      
      {/* 组件架构 */}
      <View style={styles.architectureCard}>
        <Text style={styles.architectureTitle}>🏗️ 组件架构</Text>
        
        <Text style={styles.architectureTree}>
          AuthInputArea (容器){'\n'}
          ├── TitleArea (标题区域){'\n'}
          │   ├── title (主标题){'\n'}
          │   └── subtitle (副标题){'\n'}
          ├── PhoneInputArea (手机号){'\n'}
          └── Animated.View (动画容器){'\n'}
              ├── PasswordInputArea (密码){'\n'}
              └── CodeInputArea (验证码)
        </Text>
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
  switchButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  switchButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  modeValue: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modePassword: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
  },
  modeCode: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
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
    paddingVertical: 6,
  },
  debugSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  debugLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  debugValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
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
  
  // 组件架构
  architectureCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  architectureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#92400E',
  },
  architectureTree: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#92400E',
    lineHeight: 20,
  },
});

export default AuthInputAreaTest;

