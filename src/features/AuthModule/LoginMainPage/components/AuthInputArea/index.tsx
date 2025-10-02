/**
 * AuthInputArea - 认证输入区域组件（占位实现）
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AuthInputAreaProps } from '../../types';

const AuthInputArea: React.FC<AuthInputAreaProps> = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.placeholder}>认证输入区域 - 待实现</Text>
    </View>
  );
};

export default React.memo(AuthInputArea);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});