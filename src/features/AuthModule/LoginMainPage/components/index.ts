/**
 * LoginMainPage Components - 区域组件统一导出
 * 
 * 导出登录主页面的所有区域组件
 */

// #region 区域组件导出
export { default as ActionButtonArea } from './ActionButtonArea';
export { default as AgreementArea } from './AgreementArea';
export { default as AuthInputArea } from './AuthInputArea';
export { default as AuxiliaryArea } from './AuxiliaryArea';
export { default as PhoneInputArea } from './PhoneInputArea';
export { default as TopWelcomeArea } from './TopWelcomeArea';

// #endregion

// #region 组件类型导出
export type {
    ActionButtonAreaProps, AgreementAreaProps, AuthInputAreaProps, AuxiliaryAreaProps, PhoneInputAreaProps, TopWelcomeAreaProps
} from '../types';

// #endregion

// #region 组件常量和工具导出
export {
    LOGO_CONFIG, WELCOME_CONTENT, getPersonalizedWelcome, getTimeBasedGreeting
} from './TopWelcomeArea';

// #endregion
