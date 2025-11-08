/**
 * AuxiliaryArea - 辅助功能区域组件
 * 按照UI设计图：左边"验证码登陆"，右边"忘记密码?"
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AuxiliaryAreaProps } from '../../types';

interface ExtendedAuxiliaryAreaProps extends AuxiliaryAreaProps {
  onSwitchLoginMode?: () => void;
  loginMode?: 'password' | 'code';
}

const AuxiliaryArea: React.FC<ExtendedAuxiliaryAreaProps> = (props) => {
  const switchModeText = props.loginMode === 'password' ? '验证码登陆' : '密码登陆';
  
  return (
    <View style={[styles.container, props.style]}>
      {/* 左侧：切换登录模式 */}
      <TouchableOpacity onPress={props.onSwitchLoginMode}>
        <Text style={styles.leftLink}>{switchModeText}</Text>
      </TouchableOpacity>
      
      {/* 右侧：忘记密码 */}
      <TouchableOpacity onPress={props.onForgotPassword}>
        <Text style={styles.rightLink}>忘记密码?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(AuxiliaryArea);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftLink: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '500',
  },
  rightLink: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '500',
  },
});