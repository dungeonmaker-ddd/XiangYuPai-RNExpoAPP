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
export { default as CodeInputArea } from './CodeInputArea'; // 🆕 新增
export { default as PasswordInputArea } from './PasswordInputArea';
export { default as PhoneInputArea } from './PhoneInputArea';
export { default as RegionSelectModal } from './RegionSelectModal'; // 🆕 新增
export { default as TopWelcomeArea } from './TopWelcomeArea';

// #endregion

// #region 组件类型导出
export type {
    ActionButtonAreaProps, AgreementAreaProps, AuthInputAreaProps, AuxiliaryAreaProps, PhoneInputAreaProps, TopWelcomeAreaProps
} from '../types';

// 🆕 新增组件类型
export type { CodeInputAreaProps, DigitBoxProps } from './CodeInputArea';
export type { PasswordInputAreaProps } from './PasswordInputArea';
export type { Country, CountrySection, RegionSelectModalProps } from './RegionSelectModal';
// 🆕 导出工具函数和Hooks
export { formatCountdown, useCountdown } from './ActionButtonArea';
export { getSubtitle, getTitle, useAuthInputAnimation } from './AuthInputArea';
export { filterCountries, getFirstLetter, getHotCountries, groupCountries } from './RegionSelectModal';

// #endregion

// #region 组件常量和工具导出
export { getPersonalizedWelcome, getTimeBasedGreeting, LOGO_CONFIG, WELCOME_CONTENT } from './TopWelcomeArea';

// #endregion
