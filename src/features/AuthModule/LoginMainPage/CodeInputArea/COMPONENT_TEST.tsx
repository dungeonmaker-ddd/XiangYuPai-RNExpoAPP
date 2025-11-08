/**
 * CodeInputArea 组件测试页面
 * 
 * 用于快速预览和测试CodeInputArea组件
 */

import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CodeInputArea, { parseCode } from './index';

export function CodeInputAreaTest() {
  const [code, setCode] = useState('');
  const [codeValid, setCodeValid] = useState<boolean | undefined>(undefined);
  
  const handleCodeChange = (value: string) => {
    setCode(value);
    
    // 简单验证：6位数字
    if (value.length === 0) {
      setCodeValid(undefined);
    } else if (value.length < 6) {
      setCodeValid(false);
    } else {
      setCodeValid(true);
    }
  };
  
  // 模拟收到验证码
  const handleSimulateCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    Alert.alert(
      '模拟验证码',
      `验证码：${randomCode}\n\n点击"复制并粘贴"按钮测试粘贴功能`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '自动填充',
          onPress: () => setCode(randomCode),
        },
      ]
    );
  };
  
  // 清空验证码
  const handleClear = () => {
    setCode('');
    setCodeValid(undefined);
  };
  
  // 解析验证码数组
  const parsedCode = parseCode(code, 6);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>CodeInputArea 测试</Text>
      
      {/* 主组件 */}
      <View style={styles.componentWrapper}>
        <CodeInputArea
          code={code}
          onCodeChange={handleCodeChange}
          codeValid={codeValid}
          digitCount={6}
          showValidation={true}
        />
      </View>
      
      {/* 快捷操作按钮 */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={handleSimulateCode}
        >
          <Text style={styles.actionButtonText}>📱 模拟验证码</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={handleClear}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
            🗑️ 清空
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 调试信息 */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugTitle}>🔍 调试信息</Text>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>原始验证码:</Text>
          <Text style={styles.debugValue}>
            {code || '(空)'}
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>解析数组:</Text>
          <Text style={styles.debugValue}>
            [{parsedCode.map(d => d || '_').join(', ')}]
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>验证码长度:</Text>
          <Text style={styles.debugValue}>{code.length}/6</Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>验证状态:</Text>
          <Text style={[styles.debugValue, codeValid ? styles.valid : styles.invalid]}>
            {codeValid === undefined 
              ? '未验证' 
              : codeValid 
                ? '✅ 有效' 
                : '❌ 无效'}
          </Text>
        </View>
        
        <View style={styles.debugRow}>
          <Text style={styles.debugLabel}>完成状态:</Text>
          <Text style={[styles.debugValue, code.length === 6 ? styles.valid : styles.invalid]}>
            {code.length === 6 ? '✅ 已完成' : '⏳ 未完成'}
          </Text>
        </View>
      </View>
      
      {/* 测试指南 */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>🧪 测试指南</Text>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>1️⃣ 正常输入测试</Text>
          <Text style={styles.guideText}>
            • 点击任意格子聚焦{'\n'}
            • 依次输入6个数字{'\n'}
            • 观察自动跳格效果
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>2️⃣ 粘贴测试</Text>
          <Text style={styles.guideText}>
            • 点击"模拟验证码"按钮{'\n'}
            • 复制验证码{'\n'}
            • 在输入区域粘贴{'\n'}
            • 观察自动填充6格
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>3️⃣ 删除测试</Text>
          <Text style={styles.guideText}>
            • 输入一些数字{'\n'}
            • 按Backspace键{'\n'}
            • 观察删除回退效果
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>4️⃣ 非法输入测试</Text>
          <Text style={styles.guideText}>
            • 尝试输入字母（会被过滤）{'\n'}
            • 尝试输入特殊字符（会被过滤）{'\n'}
            • 只有数字0-9会被接受
          </Text>
        </View>
      </View>
      
      {/* 功能特性 */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ 功能特性</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>6格分离输入</Text> - 每格1位数字
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>自动跳格</Text> - 输入时自动跳到下一格
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>删除回退</Text> - 删除时回到前一格
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>粘贴支持</Text> - 可直接粘贴完整验证码
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>聚焦指示</Text> - 紫色边框 + 光标
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>输入过滤</Text> - 只接受数字，自动过滤非法字符
          </Text>
        </View>
      </View>
      
      {/* 视觉效果说明 */}
      <View style={styles.visualCard}>
        <Text style={styles.visualTitle}>🎨 视觉效果</Text>
        
        <View style={styles.visualItem}>
          <View style={[styles.visualBox, styles.visualBoxDefault]} />
          <Text style={styles.visualText}>空格子 - 灰色边框 + 灰色背景</Text>
        </View>
        
        <View style={styles.visualItem}>
          <View style={[styles.visualBox, styles.visualBoxFocused]} />
          <Text style={styles.visualText}>聚焦格子 - 紫色边框 + 白色背景</Text>
        </View>
        
        <View style={styles.visualItem}>
          <View style={[styles.visualBox, styles.visualBoxFilled]}>
            <Text style={styles.visualDigit}>5</Text>
          </View>
          <Text style={styles.visualText}>已填格子 - 灰色边框 + 数字</Text>
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
    marginBottom: 32,
    color: '#1F2937',
  },
  
  // 组件包装器
  componentWrapper: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  
  // 快捷操作按钮
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#9C27B0',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  actionButtonTextSecondary: {
    color: '#6B7280',
  },
  
  // 调试信息卡片
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
    fontFamily: 'monospace',
  },
  valid: {
    color: '#10B981',
  },
  invalid: {
    color: '#EF4444',
  },
  
  // 测试指南卡片
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
  
  // 功能特性卡片
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
  
  // 视觉效果卡片
  visualCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  visualTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#92400E',
  },
  visualItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  visualBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualBoxDefault: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9FAFB',
  },
  visualBoxFocused: {
    borderWidth: 2,
    borderColor: '#9C27B0',
    backgroundColor: '#FFF',
  },
  visualBoxFilled: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9FAFB',
  },
  visualDigit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  visualText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
  },
});

export default CodeInputAreaTest;

