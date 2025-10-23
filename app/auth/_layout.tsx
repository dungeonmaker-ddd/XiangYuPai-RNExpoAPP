/**
 * Auth Layout - 认证路由组布局
 * 
 * 为所有认证相关页面提供统一的布局和背景
 */

import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.content,
          animation: 'fade',
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{
            title: '登录',
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // 纯白背景
  },
  content: {
    backgroundColor: '#FFFFFF', // 确保内容区域也是白色
  },
});

