/**
 * Auth Data Store - 认证数据状态管理
 * 
 * 管理认证相关的表单数据和验证状态
 */

import { create } from 'zustand';
import { DEFAULT_REGION } from '../LoginMainPage/constants';
import type {
    LoginFormData,
    RegionInfo,
    ValidationState,
} from '../LoginMainPage/types';

// #region 类型定义

export interface AuthDataState {
  // 表单数据
  loginForm: LoginFormData;
  
  // 验证状态
  validationState: ValidationState;
}

export interface AuthDataActions {
  // 表单更新
  updateLoginForm: (updates: Partial<LoginFormData>) => void;
  resetLoginForm: () => void;
  
  // 验证方法
  validateForm: () => void;
  setValidation: (updates: Partial<ValidationState>) => void;
  
  // 地区选择
  setRegion: (region: RegionInfo) => void;
}

export type AuthDataStore = AuthDataState & AuthDataActions;

// #endregion

// #region 初始状态

const initialState: AuthDataState = {
  loginForm: {
    phone: '',
    password: '',
    smsCode: '',
    region: DEFAULT_REGION,
  },
  validationState: {
    phoneValid: false,
    passwordValid: false,
    codeValid: false,
    agreementAccepted: false,
  },
};

// #endregion

// #region Store创建

export const useAuthDataStore = create<AuthDataStore>((set, get) => ({
  // 初始状态
  ...initialState,
  
  // 更新表单
  updateLoginForm: (updates) => {
    set((state) => ({
      loginForm: {
        ...state.loginForm,
        ...updates,
      },
    }));
  },
  
  // 重置表单
  resetLoginForm: () => {
    set({ loginForm: initialState.loginForm });
  },
  
  // 验证表单
  validateForm: () => {
    const { loginForm } = get();
    
    // 简单的验证逻辑
    const phoneValid = /^1[3-9]\d{9}$/.test(loginForm.phone);
    const passwordValid = loginForm.password.length >= 6;
    const codeValid = /^\d{6}$/.test(loginForm.smsCode);
    
    set({
      validationState: {
        phoneValid,
        passwordValid,
        codeValid,
        agreementAccepted: get().validationState.agreementAccepted,
      },
    });
  },
  
  // 设置验证状态
  setValidation: (updates) => {
    set((state) => ({
      validationState: {
        ...state.validationState,
        ...updates,
      },
    }));
  },
  
  // 设置地区
  setRegion: (region) => {
    set((state) => ({
      loginForm: {
        ...state.loginForm,
        region,
      },
    }));
  },
}));

// #endregion
