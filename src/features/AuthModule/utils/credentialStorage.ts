/**
 * Credential Storage Utility
 * 
 * 安全存储用户凭证（手机号和密码）
 * 使用 expo-secure-store 进行加密存储
 */

import * as SecureStore from 'expo-secure-store';

// Storage Keys
const KEYS = {
  REMEMBER_ME: 'auth_remember_me',
  PHONE_NUMBER: 'auth_phone_number',
  PASSWORD: 'auth_password',
  COUNTRY_CODE: 'auth_country_code',
  LAST_LOGIN_MODE: 'auth_last_login_mode',
} as const;

// Types
export interface SavedCredentials {
  phoneNumber: string;
  password: string;
  countryCode: string;
  loginMode?: 'password' | 'code';
}

/**
 * 保存用户凭证（仅在用户选择"记住我"时调用）
 */
export async function saveCredentials(
  credentials: SavedCredentials
): Promise<boolean> {
  try {
    // 保存记住我标志
    await SecureStore.setItemAsync(KEYS.REMEMBER_ME, 'true');
    
    // 保存手机号
    await SecureStore.setItemAsync(KEYS.PHONE_NUMBER, credentials.phoneNumber);
    
    // 保存密码（加密存储）
    await SecureStore.setItemAsync(KEYS.PASSWORD, credentials.password);
    
    // 保存区号
    await SecureStore.setItemAsync(KEYS.COUNTRY_CODE, credentials.countryCode);
    
    // 保存登录模式
    if (credentials.loginMode) {
      await SecureStore.setItemAsync(KEYS.LAST_LOGIN_MODE, credentials.loginMode);
    }
    
    console.log('[CredentialStorage] ✅ Credentials saved successfully');
    return true;
  } catch (error) {
    console.error('[CredentialStorage] ❌ Failed to save credentials:', error);
    return false;
  }
}

/**
 * 获取保存的凭证
 */
export async function getSavedCredentials(): Promise<SavedCredentials | null> {
  try {
    // 检查是否启用"记住我"
    const rememberMe = await SecureStore.getItemAsync(KEYS.REMEMBER_ME);
    if (rememberMe !== 'true') {
      console.log('[CredentialStorage] ℹ️  Remember me not enabled');
      return null;
    }
    
    // 获取保存的数据
    const phoneNumber = await SecureStore.getItemAsync(KEYS.PHONE_NUMBER);
    const password = await SecureStore.getItemAsync(KEYS.PASSWORD);
    const countryCode = await SecureStore.getItemAsync(KEYS.COUNTRY_CODE);
    const loginMode = await SecureStore.getItemAsync(KEYS.LAST_LOGIN_MODE);
    
    // 验证必需字段
    if (!phoneNumber || !password) {
      console.log('[CredentialStorage] ⚠️  Incomplete saved credentials');
      return null;
    }
    
    console.log('[CredentialStorage] ✅ Credentials loaded successfully');
    return {
      phoneNumber,
      password,
      countryCode: countryCode || '+86',
      loginMode: (loginMode as 'password' | 'code') || 'password',
    };
  } catch (error) {
    console.error('[CredentialStorage] ❌ Failed to load credentials:', error);
    return null;
  }
}

/**
 * 检查是否启用"记住我"
 */
export async function isRememberMeEnabled(): Promise<boolean> {
  try {
    const rememberMe = await SecureStore.getItemAsync(KEYS.REMEMBER_ME);
    return rememberMe === 'true';
  } catch (error) {
    console.error('[CredentialStorage] ❌ Failed to check remember me:', error);
    return false;
  }
}

/**
 * 清除保存的凭证
 */
export async function clearCredentials(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEYS.REMEMBER_ME);
    await SecureStore.deleteItemAsync(KEYS.PHONE_NUMBER);
    await SecureStore.deleteItemAsync(KEYS.PASSWORD);
    await SecureStore.deleteItemAsync(KEYS.COUNTRY_CODE);
    await SecureStore.deleteItemAsync(KEYS.LAST_LOGIN_MODE);
    
    console.log('[CredentialStorage] ✅ Credentials cleared successfully');
  } catch (error) {
    console.error('[CredentialStorage] ❌ Failed to clear credentials:', error);
  }
}

/**
 * 仅更新手机号（不影响密码）
 */
export async function updatePhoneNumber(phoneNumber: string, countryCode: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.PHONE_NUMBER, phoneNumber);
    await SecureStore.setItemAsync(KEYS.COUNTRY_CODE, countryCode);
    console.log('[CredentialStorage] ✅ Phone number updated');
  } catch (error) {
    console.error('[CredentialStorage] ❌ Failed to update phone number:', error);
  }
}

/**
 * 仅保存手机号（用于验证码登录）
 */
export async function savePhoneNumberOnly(
  phoneNumber: string,
  countryCode: string
): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEYS.PHONE_NUMBER, phoneNumber);
    await SecureStore.setItemAsync(KEYS.COUNTRY_CODE, countryCode);
    await SecureStore.setItemAsync(KEYS.LAST_LOGIN_MODE, 'code');
    console.log('[CredentialStorage] ✅ Phone number saved');
  } catch (error) {
    console.error('[CredentialStorage] ❌ Failed to save phone number:', error);
  }
}

