/**
 * 🔐 登录API使用示例（完全对接后端）
 * 
 * 📋 对接后端: xypai-security/APP认证.md
 * 🎯 演示: 密码登录 + 短信登录完整流程
 * 
 * 使用说明:
 * 1. 复制代码到你的登录页面
 * 2. 调整UI样式
 * 3. 连接到实际的路由和状态管理
 */

import { authApi } from '@/services/api';
import type { PasswordLoginRequest, SmsLoginRequest } from '@/services/api/authApi';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ===== 示例1: 密码登录组件 =====

export function PasswordLoginExample() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 验证输入
    if (!username || !password) {
      Alert.alert('提示', '请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      // 🎯 调用后端密码登录接口
      const request: PasswordLoginRequest = {
        username,              // 用户名（必填）
        password,              // 密码（必填）
        clientType: 'app',     // 客户端类型
        deviceId: 'device_' + Date.now(), // 设备ID
        rememberMe: false,     // 是否记住登录
      };

      console.log('📤 发起登录请求:', request);
      const response = await authApi.loginWithPassword(request);

      console.log('📥 登录响应:', response);

      if (response.success) {
        // ✅ 登录成功
        const { userInfo, accessToken, refreshToken, expiresIn } = response.data;

        Alert.alert('登录成功', `欢迎 ${userInfo.nickname || userInfo.username}`);

        console.log('✅ 登录成功');
        console.log('   用户ID:', userInfo.id);
        console.log('   用户名:', userInfo.username);
        console.log('   昵称:', userInfo.nickname);
        console.log('   Token:', accessToken.substring(0, 20) + '...');
        console.log('   过期时间:', expiresIn + '秒');

        // 🎯 Token已自动存储到apiClient
        // 后续所有API请求会自动携带token

        // TODO: 保存到全局状态（AuthStore）
        // authStore.setAuthData({
        //   isAuthenticated: true,
        //   accessToken,
        //   refreshToken,
        //   userInfo,
        // });

        // TODO: 跳转到主页
        // navigation.navigate('Home');
      } else {
        // ❌ 登录失败（业务错误）
        Alert.alert('登录失败', response.message || '用户名或密码错误');
      }
    } catch (error: any) {
      // ❌ 登录失败（网络错误）
      console.error('❌ 登录失败:', error);
      
      if (error.type === 'NETWORK_ERROR') {
        Alert.alert('网络错误', '请检查网络连接');
      } else if (error.type === 'TIMEOUT_ERROR') {
        Alert.alert('请求超时', '请稍后重试');
      } else {
        Alert.alert('登录失败', error.message || '未知错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>密码登录</Text>

      <TextInput
        style={styles.input}
        placeholder="请输入用户名"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="请输入密码"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>登录</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ===== 示例2: 短信登录组件 =====

export function SmsLoginExample() {
  const [mobile, setMobile] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  // 发送验证码
  const handleSendCode = async () => {
    if (!mobile) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    if (countdown > 0) {
      return;
    }

    setSendingCode(true);
    try {
      // 🎯 调用后端发送短信验证码接口
      const response = await authApi.sendSmsCode({
        mobile,              // 手机号（必填）
        type: 'login',       // 验证码类型（必填）
        clientType: 'app',   // 客户端类型
      });

      console.log('📥 发送验证码响应:', response);

      if (response.success) {
        Alert.alert('成功', '验证码已发送');

        // 开始60秒倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        Alert.alert('发送失败', response.message);
      }
    } catch (error: any) {
      console.error('❌ 发送验证码失败:', error);
      Alert.alert('发送失败', error.message || '网络错误');
    } finally {
      setSendingCode(false);
    }
  };

  // 短信登录
  const handleLogin = async () => {
    if (!mobile || !smsCode) {
      Alert.alert('提示', '请输入手机号和验证码');
      return;
    }

    setLoading(true);
    try {
      // 🎯 调用后端短信登录接口
      const request: SmsLoginRequest = {
        mobile,                // 手机号（必填）
        smsCode,               // 短信验证码（必填）
        clientType: 'app',     // 客户端类型
        deviceId: 'device_' + Date.now(),
        rememberMe: false,
      };

      console.log('📤 发起短信登录请求:', request);
      const response = await authApi.loginWithSms(request);

      console.log('📥 登录响应:', response);

      if (response.success) {
        const { userInfo, accessToken } = response.data;

        Alert.alert('登录成功', `欢迎 ${userInfo.nickname || userInfo.username}`);

        console.log('✅ 短信登录成功');
        console.log('   Token已自动保存');

        // TODO: 保存到AuthStore并跳转
      } else {
        Alert.alert('登录失败', response.message || '验证码错误');
      }
    } catch (error: any) {
      console.error('❌ 短信登录失败:', error);
      Alert.alert('登录失败', error.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>短信登录</Text>

      <View style={styles.phoneRow}>
        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder="请输入手机号"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={11}
          editable={!loading}
        />

        <TouchableOpacity
          style={[
            styles.codeButton,
            (countdown > 0 || sendingCode) && styles.codeButtonDisabled,
          ]}
          onPress={handleSendCode}
          disabled={countdown > 0 || sendingCode}
        >
          <Text style={styles.codeButtonText}>
            {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒` : '获取验证码'}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="请输入验证码"
        value={smsCode}
        onChangeText={setSmsCode}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>登录</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ===== 示例3: 测试所有API接口 =====

export function TestAllAuthApis() {
  const [result, setResult] = useState('');

  const testPasswordLogin = async () => {
    try {
      setResult('测试密码登录...');
      const response = await authApi.loginWithPassword({
        username: 'alice_dev',
        password: '123456',
        clientType: 'app',
      });

      setResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`错误: ${error.message}`);
    }
  };

  const testSendSms = async () => {
    try {
      setResult('测试发送验证码...');
      const response = await authApi.sendSmsCode({
        mobile: '13800138001',
        type: 'login',
      });

      setResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`错误: ${error.message}`);
    }
  };

  const testVerifySms = async () => {
    try {
      setResult('测试验证验证码...');
      const response = await authApi.verifySmsCode('13800138001', '123456');

      setResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`错误: ${error.message}`);
    }
  };

  const testHeartbeat = async () => {
    try {
      setResult('测试心跳保活...');
      const response = await authApi.heartbeat();

      setResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`错误: ${error.message}`);
    }
  };

  const testHealthCheck = async () => {
    try {
      setResult('测试健康检查...');
      const response = await authApi.healthCheck();

      setResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`错误: ${error.message}`);
    }
  };

  return (
    <View style={styles.testContainer}>
      <Text style={styles.title}>测试认证API</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.testButton} onPress={testPasswordLogin}>
          <Text style={styles.testButtonText}>密码登录</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={testSendSms}>
          <Text style={styles.testButtonText}>发送验证码</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={testVerifySms}>
          <Text style={styles.testButtonText}>验证验证码</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={testHeartbeat}>
          <Text style={styles.testButtonText}>心跳保活</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={testHealthCheck}>
          <Text style={styles.testButtonText}>健康检查</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.resultTitle}>结果:</Text>
      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

// ===== 样式 =====

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  phoneInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  codeButton: {
    width: 110,
    height: 50,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  codeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    height: 50,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  result: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

// ===== 导出 =====

export default {
  PasswordLoginExample,
  SmsLoginExample,
  TestAllAuthApis,
};

