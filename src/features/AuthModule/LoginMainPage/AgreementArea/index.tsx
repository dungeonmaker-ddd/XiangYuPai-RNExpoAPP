/**
 * AgreementArea - 协议同意区域组件
 * 按照UI设计图：纯文本显示，不需要checkbox
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AgreementAreaProps } from '../../types';

interface ExtendedAgreementAreaProps extends AgreementAreaProps {
  onViewUserAgreement?: () => void;
  onViewPrivacyPolicy?: () => void;
}

const AgreementArea: React.FC<ExtendedAgreementAreaProps> = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.text}>
        登陆即表明同意{' '}
        <TouchableOpacity onPress={props.onViewUserAgreement}>
          <Text style={styles.link}>《探店用户协议》</Text>
        </TouchableOpacity>
        {' '}和{' '}
        <TouchableOpacity onPress={props.onViewPrivacyPolicy}>
          <Text style={styles.link}>《隐私政策》</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default React.memo(AgreementArea);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#9C27B0',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});