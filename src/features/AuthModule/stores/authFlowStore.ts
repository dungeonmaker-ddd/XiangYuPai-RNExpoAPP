/**
 * Auth Flow Store - 认证流程状态管理
 * 
 * 管理认证流程的步骤和导航历史
 */

import { create } from 'zustand';

// #region 类型定义

export type AuthStep = 
  | 'login' 
  | 'reset_entry' 
  | 'code_send' 
  | 'code_verify' 
  | 'password_reset' 
  | 'success';

export interface AuthFlowState {
  currentStep: AuthStep;
  flowProgress: number;
  navigationHistory: string[];
  resetToken: string | null;
  flowData: Record<string, any>;
}

export interface AuthFlowActions {
  setStep: (step: AuthStep) => void;
  updateProgress: (progress: number) => void;
  pushHistory: (route: string) => void;
  popHistory: () => string | null;
  setResetToken: (token: string | null) => void;
  setFlowData: (data: Record<string, any>) => void;
  resetFlow: () => void;
}

export type AuthFlowStore = AuthFlowState & AuthFlowActions;

// #endregion

// #region Store创建

export const useAuthFlowStore = create<AuthFlowStore>((set, get) => ({
  // 初始状态
  currentStep: 'login',
  flowProgress: 0,
  navigationHistory: [],
  resetToken: null,
  flowData: {},
  
  // 设置当前步骤
  setStep: (step) => {
    set({ currentStep: step });
  },
  
  // 更新流程进度
  updateProgress: (progress) => {
    set({ flowProgress: Math.min(Math.max(progress, 0), 100) });
  },
  
  // 添加导航历史
  pushHistory: (route) => {
    set((state) => ({
      navigationHistory: [...state.navigationHistory, route],
    }));
  },
  
  // 返回上一个路由
  popHistory: () => {
    const { navigationHistory } = get();
    if (navigationHistory.length === 0) return null;
    
    const lastRoute = navigationHistory[navigationHistory.length - 1];
    set({
      navigationHistory: navigationHistory.slice(0, -1),
    });
    
    return lastRoute;
  },
  
  // 设置重置令牌
  setResetToken: (token) => {
    set({ resetToken: token });
  },
  
  // 设置流程数据
  setFlowData: (data) => {
    set((state) => ({
      flowData: {
        ...state.flowData,
        ...data,
      },
    }));
  },
  
  // 重置流程
  resetFlow: () => {
    set({
      currentStep: 'login',
      flowProgress: 0,
      navigationHistory: [],
      resetToken: null,
      flowData: {},
    });
  },
}));

// #endregion
