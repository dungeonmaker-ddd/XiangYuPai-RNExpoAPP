// #region 1. File Banner & TOC
/**
 * navigateToMessage - Navigate to Message
 * 
 * 导航到消息页面
 * 
 * TOC:
 * [1] File Banner & TOC
 * [2] Implementation
 * [3] Export
 */
// #endregion

// #region 2. Implementation

import type { Router } from 'expo-router';

/**
 * Navigate to message/chat page
 */
export const navigateToMessage = (router: Router, userId: string, nickname: string) => {
  console.log('[Navigate] To message:', { userId, nickname });
  
  // Navigate to chat page
  router.push({
    pathname: '/(tabs)/messages',
    params: {
      userId,
      nickname,
    },
  });
};

// #endregion

// #region 3. Export

export default navigateToMessage;

// #endregion

