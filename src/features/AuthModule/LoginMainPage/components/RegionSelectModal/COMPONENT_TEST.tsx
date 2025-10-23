/**
 * RegionSelectModal 组件测试页面
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RegionSelectModal, { type Country } from './index';

export function RegionSelectModalTest() {
  const [visible, setVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>RegionSelectModal 测试</Text>
      
      {/* 触发按钮 */}
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerButtonText}>
          {selectedCountry 
            ? `${selectedCountry.flag} ${selectedCountry.name} ${selectedCountry.code}`
            : '📱 点击选择国家/地区'}
        </Text>
      </TouchableOpacity>
      
      {/* 选中信息 */}
      {selectedCountry && (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>✅ 当前选择</Text>
          
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>国旗:</Text>
            <Text style={styles.selectedValue}>{selectedCountry.flag}</Text>
          </View>
          
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>中文名:</Text>
            <Text style={styles.selectedValue}>{selectedCountry.name}</Text>
          </View>
          
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>英文名:</Text>
            <Text style={styles.selectedValue}>{selectedCountry.nameEn}</Text>
          </View>
          
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>区号:</Text>
            <Text style={styles.selectedValue}>{selectedCountry.code}</Text>
          </View>
          
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>是否热门:</Text>
            <Text style={styles.selectedValue}>
              {selectedCountry.popular ? '✅ 是' : '❌ 否'}
            </Text>
          </View>
        </View>
      )}
      
      {/* 测试指南 */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>🧪 测试指南</Text>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>1️⃣ 打开模态框</Text>
          <Text style={styles.guideText}>
            • 点击上方按钮打开模态框{'\n'}
            • 观察从底部滑入动画{'\n'}
            • 查看半透明遮罩{'\n'}
            • 确认标题、搜索栏、热门地区显示正常
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>2️⃣ 测试搜索功能</Text>
          <Text style={styles.guideText}>
            • 在搜索栏输入"中国"{'\n'}
            • 观察实时过滤结果{'\n'}
            • 点击清除按钮{'\n'}
            • 确认列表恢复完整
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>3️⃣ 测试热门地区</Text>
          <Text style={styles.guideText}>
            • 点击热门地区中的任一项{'\n'}
            • 观察选中高亮效果{'\n'}
            • 确认模态框自动关闭{'\n'}
            • 查看上方显示选中信息
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>4️⃣ 测试分组列表</Text>
          <Text style={styles.guideText}>
            • 滚动列表查看分组标题（A-Z）{'\n'}
            • 点击任一列表项{'\n'}
            • 确认选择生效{'\n'}
            • 观察模态框关闭动画
          </Text>
        </View>
        
        <View style={styles.guideSection}>
          <Text style={styles.guideSectionTitle}>5️⃣ 测试空状态</Text>
          <Text style={styles.guideText}>
            • 搜索"不存在的国家"{'\n'}
            • 确认显示"未找到相关地区"提示
          </Text>
        </View>
      </View>
      
      {/* 功能特性 */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>✨ 功能特性</Text>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>底部抽屉</Text> - Modal + 滑动动画
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>搜索功能</Text> - 实时过滤，支持中文、英文、区号
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>热门地区</Text> - 6个常用国家/地区
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>分组列表</Text> - 按首字母A-Z分组
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>粘性标题</Text> - 滚动时标题固定
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>选中高亮</Text> - 紫色背景标识
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✅</Text>
          <Text style={styles.featureText}>
            <Text style={styles.featureBold}>14个国家</Text> - 覆盖主要国家和地区
          </Text>
        </View>
      </View>
      
      {/* RegionSelectModal */}
      <RegionSelectModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
        selectedCode={selectedCountry?.code}
      />
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
  
  triggerButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#9C27B0',
    borderRadius: 12,
  },
  
  triggerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  
  selectedCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#10B981',
  },
  
  selectedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  
  selectedLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  selectedValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  
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
  
  featuresCard: {
    marginHorizontal: 24,
    marginBottom: 32,
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
});

export default RegionSelectModalTest;

