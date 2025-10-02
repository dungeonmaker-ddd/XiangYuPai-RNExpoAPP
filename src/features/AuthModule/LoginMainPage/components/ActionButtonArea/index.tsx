/**
 * ActionButtonArea - 操作按钮区域组件（占位实现）
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ActionButtonAreaProps } from '../../types';

const ActionButtonArea: React.FC<ActionButtonAreaProps> = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity 
        style={[styles.button, props.disabled && styles.disabled]}
        onPress={props.onLogin}
        disabled={props.disabled}
      >
        <Text style={styles.buttonText}>
          {props.loading.login ? '登录中...' : '登录'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(ActionButtonArea);

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  button: {
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
});