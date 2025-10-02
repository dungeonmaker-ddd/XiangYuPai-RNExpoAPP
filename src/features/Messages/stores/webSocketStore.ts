/**
 * WebSocket Store - WebSocket连接状态管理
 * 
 * 管理WebSocket连接、重连、事件发送
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WebSocketState } from '../types';

/**
 * WebSocket Store
 * 
 * 注意：实际的Socket.io连接管理需要在使用时实现
 * 这里只提供状态管理接口
 */
export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    (set, get) => ({
  // ============================================
  // 状态
  // ============================================
  connected: false,
  reconnectAttempts: 0,

  // ============================================
  // Actions
  // ============================================

  /**
   * 连接WebSocket
   */
  connect: () => {
    // TODO: 实现Socket.io连接逻辑
    // import { io } from 'socket.io-client';
    // const socket = io('your-server-url', config);
    
    console.log('[webSocketStore] Connecting to WebSocket...');
    
    // 模拟连接成功
    set({ connected: true, reconnectAttempts: 0 });
  },

  /**
   * 断开WebSocket
   */
  disconnect: () => {
    // TODO: 实现Socket.io断开逻辑
    // socket.disconnect();
    
    console.log('[webSocketStore] Disconnecting from WebSocket...');
    
    set({ connected: false });
  },

  /**
   * 发送WebSocket事件
   */
  sendEvent: (event: string, data: any) => {
    const { connected } = get();
    
    if (!connected) {
      console.warn('[webSocketStore] Cannot send event, not connected');
      return;
    }
    
    // TODO: 实现Socket.io事件发送逻辑
    // socket.emit(event, data);
    
    console.log('[webSocketStore] Sending event:', event, data);
  },
    }),
    { name: 'WebSocketStore' }
  )
);

// ============================================
// 选择器导出 (Selector Exports)
// ============================================

/**
 * 获取WebSocket连接状态
 */
export const useWebSocketConnected = () => useWebSocketStore(state => state.connected);

/**
 * 获取重连次数
 */
export const useWebSocketReconnectAttempts = () => useWebSocketStore(state => state.reconnectAttempts);
