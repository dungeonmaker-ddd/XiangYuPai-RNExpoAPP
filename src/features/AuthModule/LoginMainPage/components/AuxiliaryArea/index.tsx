/**
 * AuxiliaryArea - 辅助功能区域组件（占位实现）
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AuxiliaryAreaProps } from '../../types';

const AuxiliaryArea: React.FC<AuxiliaryAreaProps> = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity onPress={props.onForgotPassword}>
        <Text style={styles.link}>忘记密码？</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(AuxiliaryArea);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
});