/**
 * Auth UI Store - 认证UI状态管理
 * 
 * 管理认证相关的UI状态（加载、错误、提示等）
 */

import { create } from 'zustand';
import type { CountdownState, ErrorState, LoadingState } from '../LoginMainPage/types';

// #region 类型定义

export interface AuthUIState {
  loading: LoadingState;
  error: ErrorState;
  modals: {
    regionSelect: boolean;
    agreement: boolean;
  };
  toast: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    visible: boolean;
  };
  countdown: CountdownState;
}

export interface AuthUIActions {
  // 加载状态
  setLoading: (updates: Partial<LoadingState>) => void;
  clearLoading: () => void;
  
  // 错误状态
  setError: (error: Partial<ErrorState>) => void;
  clearError: () => void;
  
  // 模态框
  showModal: (modal: keyof AuthUIState['modals']) => void;
  hideModal: (modal: keyof AuthUIState['modals']) => void;
  
  // Toast提示
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
  
  // 倒计时
  startCountdown: (seconds: number, type: 'sms' | 'redirect') => void;
  stopCountdown: () => void;
  updateCountdown: (value: number) => void;
}

export type AuthUIStore = AuthUIState & AuthUIActions;

// #endregion

// #region 初始状态

const initialState: AuthUIState = {
  loading: {
    login: false,
    sendCode: false,
    verify: false,
  },
  error: {
    message: '',
    type: 'network',
    visible: false,
  },
  modals: {
    regionSelect: false,
    agreement: false,
  },
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },
  countdown: {
    value: 0,
    active: false,
    type: 'sms',
  },
};

// #endregion

// #region 倒计时管理

let countdownTimer: NodeJS.Timeout | null = null;

const startCountdownTimer = (initialValue: number, callback: (value: number) => void) => {
  // 清除之前的定时器
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  
  let currentValue = initialValue;
  
  countdownTimer = setInterval(() => {
    currentValue -= 1;
    callback(currentValue);
    
    if (currentValue <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }
  }, 1000);
};

const stopCountdownTimer = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

// #endregion

// #region Store创建

export const useAuthUIStore = create<AuthUIStore>((set, get) => ({
  // 初始状态
  ...initialState,
  
  // #region 加载状态管理
  
  setLoading: (updates) => {
    set((state) => ({
      loading: {
        ...state.loading,
        ...updates,
      },
    }));
  },
  
  clearLoading: () => {
    set({ loading: initialState.loading });
  },
  
  // #endregion
  
  // #region 错误状态管理
  
  setError: (error) => {
    set((state) => ({
      error: {
        ...state.error,
        ...error,
      },
    }));
  },
  
  clearError: () => {
    set({ error: initialState.error });
  },
  
  // #endregion
  
  // #region 模态框管理
  
  showModal: (modal) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: true,
      },
    }));
  },
  
  hideModal: (modal) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: false,
      },
    }));
  },
  
  // #endregion
  
  // #region Toast提示管理
  
  showToast: (message, type = 'info') => {
    set({
      toast: {
        message,
        type,
        visible: true,
      },
    });
    
    // 3秒后自动隐藏
    setTimeout(() => {
      get().hideToast();
    }, 3000);
  },
  
  hideToast: () => {
    set({
      toast: {
        ...get().toast,
        visible: false,
      },
    });
  },
  
  // #endregion
  
  // #region 倒计时管理
  
  startCountdown: (seconds, type) => {
    // 设置初始状态
    set({
      countdown: {
        value: seconds,
        active: true,
        type,
      },
    });
    
    // 启动定时器
    startCountdownTimer(seconds, (value) => {
      if (value > 0) {
        set((state) => ({
          countdown: {
            ...state.countdown,
            value,
          },
        }));
      } else {
        // 倒计时结束
        set({
          countdown: {
            value: 0,
            active: false,
            type,
          },
        });
      }
    });
  },
  
  stopCountdown: () => {
    stopCountdownTimer();
    set({
      countdown: {
        ...get().countdown,
        active: false,
      },
    });
  },
  
  updateCountdown: (value) => {
    set((state) => ({
      countdown: {
        ...state.countdown,
        value,
      },
    }));
  },
  
  // #endregion
}));

// #endregion
