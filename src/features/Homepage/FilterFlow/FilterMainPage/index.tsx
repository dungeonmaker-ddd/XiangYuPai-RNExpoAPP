// #region 1. File Banner & TOC
/**
 * FilterMainPage - 筛选主页面
 * 
 * 功能描述：多维度筛选功能，支持线上/线下筛选
 * 
 * TOC (快速跳转):
 * [1] Imports - [2] Types & Schema - [3] Constants & Config
 * [4] Utils & Helpers - [5] State Management - [6] Domain Logic
 * [7] UI Components & Rendering - [8] Exports
 */
// #endregion

// #region 2. Imports
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../../../../../stores';
import { ErrorBoundary } from '../../../../components';
// #endregion

// #region 3. Types & Schema
interface FilterPageProps { filterType?: 'online' | 'offline'; }
interface FilterConditions {
  serviceTypes: string[];
  priceRange: [number, number];
  gender: 'all' | 'male' | 'female';
  onlineOnly: boolean;
  ratingMin: number;
}
// #endregion

// #region 4. Constants & Config
const COLORS = { BACKGROUND: '#FFFFFF', PRIMARY: '#6366F1', TEXT: '#1F2937', TEXT_SECONDARY: '#6B7280', BORDER: '#E5E7EB', SURFACE: '#F8FAFC' };
// #endregion

// #region 5. Utils & Helpers
// 工具函数
// #endregion

// #region 6. State Management
const useFilterState = () => {
  const { applyFilters } = useUserStore();
  const [filters, setFilters] = useState<FilterConditions>({
    serviceTypes: [],
    priceRange: [0, 1000],
    gender: 'all',
    onlineOnly: false,
    ratingMin: 0,
  });
  return { filters, setFilters, applyFilters };
};
// #endregion

// #region 7. Domain Logic
const useFilterLogic = () => {
  const router = useRouter();
  const { filters, setFilters, applyFilters } = useFilterState();
  
  const handleApply = useCallback(() => {
    applyFilters(filters);
    router.back();
  }, [filters, applyFilters, router]);
  
  const handleReset = useCallback(() => {
    setFilters({
      serviceTypes: [],
      priceRange: [0, 1000],
      gender: 'all',
      onlineOnly: false,
      ratingMin: 0,
    });
  }, [setFilters]);
  
  return { filters, setFilters, handleApply, handleReset, handleBack: () => router.back() };
};
// #endregion

// #region 8. UI Components & Rendering
const FilterMainPage: React.FC<FilterPageProps> = (props) => {
  const { filters, setFilters, handleApply, handleReset, handleBack } = useFilterLogic();
  
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}><Text style={styles.backButton}>←</Text></TouchableOpacity>
          <Text style={styles.title}>筛选条件</Text>
          <TouchableOpacity onPress={handleReset}><Text style={styles.resetButton}>重置</Text></TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>性别筛选</Text>
          <View style={styles.genderButtons}>
            {['all', 'male', 'female'].map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.optionButton, filters.gender === g && styles.optionButtonActive]}
                onPress={() => setFilters({...filters, gender: g as any})}
              >
                <Text style={styles.optionText}>
                  {g === 'all' ? '不限' : g === 'male' ? '男性' : '女性'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.placeholder}>更多筛选条件开发中...</Text>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ErrorBoundary>
  );
};
// #endregion

// #region 9. Exports & Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER },
  backButton: { fontSize: 24, color: COLORS.TEXT, marginRight: 16 },
  title: { flex: 1, fontSize: 18, fontWeight: '600', color: COLORS.TEXT, textAlign: 'center' },
  resetButton: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT, marginBottom: 12 },
  genderButtons: { flexDirection: 'row', marginBottom: 24 },
  optionButton: { flex: 1, paddingVertical: 8, backgroundColor: COLORS.SURFACE, marginHorizontal: 4, borderRadius: 8, alignItems: 'center' },
  optionButtonActive: { backgroundColor: COLORS.PRIMARY },
  optionText: { fontSize: 14, color: COLORS.TEXT },
  placeholder: { fontSize: 14, color: COLORS.TEXT_SECONDARY, textAlign: 'center', paddingTop: 40 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.BORDER },
  applyButton: { backgroundColor: COLORS.PRIMARY, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  applyButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.BACKGROUND },
});

export default FilterMainPage;
// #endregion
