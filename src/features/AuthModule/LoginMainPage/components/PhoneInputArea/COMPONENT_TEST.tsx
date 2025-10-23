/**
 * PhoneInputArea 组件测试页面
 * 
 * 用于快速预览和测试PhoneInputArea组件
 */

import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import PhoneInputArea, { formatPhoneNumber, validatePhoneNumber } from './index';

export function PhoneInputAreaTest() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  
  const handleCountryCodePress = () => {
    Alert.alert(
      '选择国家/地区',
      '区号选择器将在RegionSelectModal完成后可用',
      [
        { text: '中国大陆 (+86)', onPress: () => setCountryCode('+86') },
        { text: '中国香港 (+852)', onPress: () => setCountryCode('+852') },
        { text: '中国澳门 (+853)', onPress: () => setCountryCode('+853') },
        { text: '中国台湾 (+886)', onPress: () => setCountryCode('+886') },
        { text: 'United States (+1)', onPress: () => setCountryCode('+1') },
        { text: 'United Kingdom (+44)', onPress: () => setCountryCode('+44') },
        { text: '取消', style: 'cancel' },
      ]
    );
  };
  
  // 验证状态
  const isValid = validatePhoneNumber(phoneNumber, countryCode);
  
  // 格式化显示
  const formattedPhone = formatPhoneNumber(phoneNumber, countryCode);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>PhoneInputArea 测试</Text>
      
      {/* 主组件 */}
      <PhoneInputArea
        phoneNumber={phoneNumber}
        onPhoneNumberChange={setPhoneNumber}
        countryCode={countryCode}
        onCountryCodePress={handleCountryCodePress}
        hintText="请输入手机号"
        maxLength={countryCode === '+86' ? 11 : 15}
        showValidation={true}
      />
      
      {/* 调试信息 */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugTitle}>🔍 调试信息</Text>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>区号:</Text>
          <Text style={styles.debugValue}>{countryCode}</Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>原始号码:</Text>
          <Text style={styles.debugValue}>{phoneNumber || '(空)'}</Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>格式化号码:</Text>
          <Text style={styles.debugValue}>{formattedPhone || '(空)'}</Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>号码长度:</Text>
          <Text style={styles.debugValue}>{phoneNumber.length}位</Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>验证状态:</Text>
          <Text style={[styles.debugValue, isValid ? styles.valid : styles.invalid]}>
            {phoneNumber.length === 0 
              ? '未输入' 
              : isValid 
                ? '✅ 有效' 
                : '❌ 无效'}
          </Text>
        </View>
      </View>
      
      {/* 验证规则说明 */}
      <View style={styles.rulesCard}>
        <Text style={styles.rulesTitle}>📋 验证规则</Text>
        
        {countryCode === '+86' && (
          <View>
            <Text style={styles.ruleText}>• 中国大陆手机号</Text>
            <Text style={styles.ruleText}>• 必须1开头</Text>
            <Text style={styles.ruleText}>• 11位数字</Text>
            <Text style={styles.ruleExample}>示例: 13812345678</Text>
          </View>
        )}
        
        {countryCode !== '+86' && (
          <View>
            <Text style={styles.ruleText}>• 国际手机号</Text>
            <Text style={styles.ruleText}>• 至少6位数字</Text>
            <Text style={styles.ruleText}>• 不超过15位</Text>
            <Text style={styles.ruleExample}>示例: 2025551234</Text>
          </View>
        )}
      </View>
      
      {/* 使用提示 */}
      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>💡 测试提示</Text>
        <Text style={styles.hintText}>
          1. 点击区号按钮（🇨🇳 +86）切换国家/地区
          {'\n'}2. 输入框聚焦时，底部下划线变紫色
          {'\n'}3. 只能输入数字，自动过滤其他字符
          {'\n'}4. 输入不合法手机号会显示错误提示
          {'\n'}5. 中国大陆号码会自动格式化（3-4-4）
        </Text>
      </View>
      
      {/* 测试用例 */}
      <View style={styles.testCases}>
        <Text style={styles.testCasesTitle}>🧪 测试用例</Text>
        
        <View style={styles.testCase}>
          <Text style={styles.testCaseLabel}>中国大陆有效:</Text>
          <Text style={styles.testCaseValue}>13812345678</Text>
        </View>
        
        <View style={styles.testCase}>
          <Text style={styles.testCaseLabel}>中国大陆无效:</Text>
          <Text style={styles.testCaseValue}>123456 (太短)</Text>
        </View>
        
        <View style={styles.testCase}>
          <Text style={styles.testCaseLabel}>美国有效:</Text>
          <Text style={styles.testCaseValue}>2025551234</Text>
        </View>
      </View>
    </ScrollView>
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
    color: '#1F2937',
  },
  
  // 调试信息卡片
  debugInfo: {
    marginTop: 24,
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
    fontFamily: 'monospace',
  },
  valid: {
    color: '#10B981',
  },
  invalid: {
    color: '#EF4444',
  },
  
  // 验证规则卡片
  rulesCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1E40AF',
  },
  ruleText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 4,
  },
  ruleExample: {
    fontSize: 13,
    color: '#3B82F6',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  
  // 使用提示卡片
  hintCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#92400E',
  },
  hintText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 22,
  },
  
  // 测试用例卡片
  testCases: {
    marginTop: 16,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  testCasesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#166534',
  },
  testCase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  testCaseLabel: {
    fontSize: 14,
    color: '#166534',
  },
  testCaseValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#166534',
    fontFamily: 'monospace',
  },
});

export default PhoneInputAreaTest;

