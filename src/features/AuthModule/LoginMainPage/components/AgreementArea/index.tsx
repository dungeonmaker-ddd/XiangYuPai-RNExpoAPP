/**
 * AgreementArea - 协议同意区域组件（占位实现）
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AgreementAreaProps } from '../../types';

const AgreementArea: React.FC<AgreementAreaProps> = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity 
        style={styles.row}
        onPress={() => props.onAgreementChange(!props.agreed)}
      >
        <View style={[styles.checkbox, props.agreed && styles.checked]}>
          {props.agreed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.text}>
          我已阅读并同意 <Text style={styles.link}>用户协议</Text> 和 
          <Text style={styles.link}>隐私政策</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(AgreementArea);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  link: {
    color: '#6366F1',
    fontWeight: '500',
  },
});