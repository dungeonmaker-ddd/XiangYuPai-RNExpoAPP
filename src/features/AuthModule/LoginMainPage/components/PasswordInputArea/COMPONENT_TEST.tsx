/**
 * PasswordInputArea 组件测试页面
 * 
 * 用于快速预览和测试PasswordInputArea组件
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PasswordInputArea from './index';

export function PasswordInputAreaTest() {
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>(undefined);
  
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    
    // 简单验证逻辑
    if (value.length === 0) {
      setPasswordValid(undefined);
    } else if (value.length < 6) {
      setPasswordValid(false);
    } else if (/^\d+$/.test(value)) {
      setPasswordValid(false); // 纯数字
    } else {
      setPasswordValid(true);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PasswordInputArea 测试</Text>
      
      <PasswordInputArea
        password={password}
        onPasswordChange={handlePasswordChange}
        passwordValid={passwordValid}
        hintText="请输入6-20位密码"
        maxLength={20}
      />
      
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>当前密码: {password}</Text>
        <Text style={styles.debugText}>密码长度: {password.length}</Text>
        <Text style={styles.debugText}>
          验证状态: {passwordValid === undefined ? '未验证' : passwordValid ? '✅ 有效' : '❌ 无效'}
        </Text>
      </View>
      
      <Text style={styles.hint}>
        💡 提示：
        {'\n'}• 输入6位以上非纯数字的密码
        {'\n'}• 点击眼睛图标切换显示/隐藏
        {'\n'}• 观察底部下划线颜色变化（聚焦时变紫色）
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  debugInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default PasswordInputAreaTest;

